type PixelImage = {
    width: number;
    height: number;
    data: Uint8ClampedArray;
};

// Pixi uses perceptual roughness and RGB tangent normals, rather than LabPBR's
// smoothness and XY/AO/height packing. Height, porosity and SSS have no equivalent
// in this preview's material. See https://shaderlabs.org/wiki/LabPBR_Material_Standard.
export function decodeLabPbr(albedo: PixelImage, normal: PixelImage, specular: PixelImage) {
    if (
        normal.width !== albedo.width ||
        normal.height !== albedo.height ||
        specular.width !== albedo.width ||
        specular.height !== albedo.height
    ) {
        throw new Error("LabPBR maps must have matching dimensions");
    }

    const baseColor = new Uint8Array(albedo.data.length);
    const normals = new Uint8Array(albedo.data.length);
    const metallicRoughness = new Uint8Array(albedo.data.length);
    const occlusion = new Uint8Array(albedo.data.length);
    const emissive = new Uint8Array(albedo.data.length);
    let hasEmission = false;
    let transparent = false;

    for (let offset = 0; offset < albedo.data.length; offset += 4) {
        const alpha = albedo.data[offset + 3];
        transparent ||= alpha < 255;
        // Pixi's base-color shader expects premultiplied color, then undoes it
        // before converting sRGB to linear light. Data maps stay opaque/linear.
        for (let channel = 0; channel < 3; channel++) {
            baseColor[offset + channel] = Math.round((albedo.data[offset + channel] * alpha) / 255);
        }
        baseColor[offset + 3] = alpha;

        const nx = (normal.data[offset] / 255) * 2 - 1;
        const ny = (normal.data[offset + 1] / 255) * 2 - 1;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        normals.set(
            [
                normal.data[offset],
                255 - normal.data[offset + 1], // DirectX Y-down to tangent Y-up.
                Math.round((nz * 0.5 + 0.5) * 255),
                255
            ],
            offset
        );

        const f0 = specular.data[offset + 1];
        // R carries dielectric F0 for the preview's small shader extension.
        // Metal IDs use albedo as F0, the LabPBR fallback for predefined metals.
        // Pixi squares perceptual roughness in its BRDF, so do not square it here.
        metallicRoughness.set(
            [f0 < 230 ? f0 : 0, 255 - specular.data[offset], f0 >= 230 ? 255 : 0, 255],
            offset
        );
        const ao = normal.data[offset + 2];
        occlusion.set([ao, ao, ao, 255], offset);

        // 255 is the no-emission sentinel; 254 is full emission. Encode the
        // mask into sRGB color because Pixi linearizes its emissive texture.
        const emission = specular.data[offset + 3] === 255 ? 0 : specular.data[offset + 3] / 254;
        hasEmission ||= emission > 0;
        for (let channel = 0; channel < 3; channel++) {
            emissive[offset + channel] = Math.round(
                albedo.data[offset + channel] * emission ** (1 / 2.2)
            );
        }
        emissive[offset + 3] = 255;
    }

    return {
        width: albedo.width,
        height: albedo.height,
        baseColor,
        normals,
        metallicRoughness,
        occlusion,
        emissive,
        hasEmission,
        transparent
    };
}

export type BlockFaceMaps = ReturnType<typeof decodeLabPbr>;

export function blockFaceUvs(uvs: Float32Array, normals: ArrayLike<number>, faceSize: number) {
    const mapped = uvs.slice();
    const vertexCount = uvs.length / 2;
    // Pixi pads quantized normals to four components, while float normals use three.
    const normalStride = normals.length / vertexCount;
    const tileSize = faceSize + 2;
    for (let vertex = 0; vertex < vertexCount; vertex++) {
        const ny = normals[vertex * normalStride + 1];
        const tile = ny > 0 ? 1 : ny < 0 ? 2 : 0;
        mapped[vertex * 2] =
            ((tile % 2) * tileSize + 1 + uvs[vertex * 2] * faceSize) / (tileSize * 2);
        mapped[vertex * 2 + 1] =
            (Math.floor(tile / 2) * tileSize + 1 + uvs[vertex * 2 + 1] * faceSize) / (tileSize * 2);
    }
    return mapped;
}

// A small in-memory atlas lets a cube use different side/top/bottom images
// with one material. Square UV scaling preserves the normal map's tangent basis;
// duplicate edge pixels prevent sampling neighboring faces.
export function packBlockFaces(faces: [BlockFaceMaps, BlockFaceMaps, BlockFaceMaps]) {
    const size = faces[0].width;
    if (faces.some((face) => face.width !== size || face.height !== size)) {
        throw new Error("Block faces must be square and have matching dimensions");
    }
    const tileSize = size + 2;
    const width = tileSize * 2;
    const height = tileSize * 2;
    const pack = (
        key: "baseColor" | "normals" | "metallicRoughness" | "occlusion" | "emissive"
    ) => {
        const pixels = new Uint8Array(width * height * 4);
        faces.forEach((face, index) => {
            for (let y = 0; y < tileSize; y++) {
                // Texture V increases upward on the cube; PNG rows go downward.
                const sourceY = size - 1 - Math.max(0, Math.min(size - 1, y - 1));
                for (let x = 0; x < tileSize; x++) {
                    const sourceX = Math.max(0, Math.min(size - 1, x - 1));
                    const sourceOffset = (sourceY * size + sourceX) * 4;
                    const targetX = (index % 2) * tileSize + x;
                    const targetY = Math.floor(index / 2) * tileSize + y;
                    const targetOffset = (targetY * width + targetX) * 4;
                    pixels.set(face[key].subarray(sourceOffset, sourceOffset + 4), targetOffset);
                }
            }
        });
        return pixels;
    };
    return {
        width,
        height,
        size,
        baseColor: pack("baseColor"),
        normals: pack("normals"),
        metallicRoughness: pack("metallicRoughness"),
        occlusion: pack("occlusion"),
        emissive: pack("emissive"),
        hasEmission: faces.some((face) => face.hasEmission),
        transparent: faces.some((face) => face.transparent)
    };
}
