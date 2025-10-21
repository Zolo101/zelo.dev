struct DitherUniforms {
    intensity: f32,
    levels: f32,
    matrixSize: f32,
};

struct GlobalFilterUniforms {
    uInputSize:vec4<f32>,
    uInputPixel:vec4<f32>,
    uInputClamp:vec4<f32>,
    uOutputFrame:vec4<f32>,
    uGlobalFrame:vec4<f32>,
    uOutputTexture:vec4<f32>,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;

@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var<uniform> ditherUniforms: DitherUniforms;

// 4x4 Bayer matrix (scaled to 0-1 range)
const bayerMatrix4x4: mat4x4<f32> = mat4x4<f32>(
    vec4<f32>(0.0/16.0, 12.0/16.0, 3.0/16.0, 15.0/16.0),
    vec4<f32>(8.0/16.0, 4.0/16.0, 11.0/16.0, 7.0/16.0),
    vec4<f32>(2.0/16.0, 14.0/16.0, 1.0/16.0, 13.0/16.0),
    vec4<f32>(10.0/16.0, 6.0/16.0, 9.0/16.0, 5.0/16.0)
);

// 8x8 Bayer matrix (scaled to 0-1 range)
const bayerMatrix8x8: array<mat4x4<f32>, 4> = array<mat4x4<f32>, 4>(
    mat4x4<f32>(
        vec4<f32>(0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0),
        vec4<f32>(32.0/64.0, 16.0/64.0, 44.0/64.0, 28.0/64.0),
        vec4<f32>(8.0/64.0, 56.0/64.0, 4.0/64.0, 52.0/64.0),
        vec4<f32>(40.0/64.0, 24.0/64.0, 36.0/64.0, 20.0/64.0)
    ),
    mat4x4<f32>(
        vec4<f32>(2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0),
        vec4<f32>(34.0/64.0, 18.0/64.0, 46.0/64.0, 30.0/64.0),
        vec4<f32>(10.0/64.0, 58.0/64.0, 6.0/64.0, 54.0/64.0),
        vec4<f32>(42.0/64.0, 26.0/64.0, 38.0/64.0, 22.0/64.0)
    ),
    mat4x4<f32>(
        vec4<f32>(3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0),
        vec4<f32>(35.0/64.0, 19.0/64.0, 47.0/64.0, 31.0/64.0),
        vec4<f32>(11.0/64.0, 59.0/64.0, 7.0/64.0, 55.0/64.0),
        vec4<f32>(43.0/64.0, 27.0/64.0, 39.0/64.0, 23.0/64.0)
    ),
    mat4x4<f32>(
        vec4<f32>(1.0/64.0, 49.0/64.0, 13.0/64.0, 61.0/64.0),
        vec4<f32>(33.0/64.0, 17.0/64.0, 45.0/64.0, 29.0/64.0),
        vec4<f32>(9.0/64.0, 57.0/64.0, 5.0/64.0, 53.0/64.0),
        vec4<f32>(41.0/64.0, 25.0/64.0, 37.0/64.0, 21.0/64.0)
    )
);

fn getBayerValue4x4(screenPos: vec2<f32>) -> f32 {
    let x = i32(screenPos.x) % 4;
    let y = i32(screenPos.y) % 4;
    return bayerMatrix4x4[x][y];
}

fn getBayerValue8x8(screenPos: vec2<f32>) -> f32 {
    let x = i32(screenPos.x) % 8;
    let y = i32(screenPos.y) % 8;
    
    let matrixIndex = (x / 4) + (y / 4) * 2;
    let localX = x % 4;
    let localY = y % 4;
    
    return bayerMatrix8x8[matrixIndex][localX][localY];
}

fn dither(color: vec3<f32>, threshold: f32) -> vec3<f32> {
    if (ditherUniforms.levels <= 1.0) {
        return color;
    }
    
    let levels = ditherUniforms.levels - 1.0;
    let scaledColor = color * levels;
    let lowerBound = floor(scaledColor);
    let upperBound = lowerBound + vec3<f32>(1.0);
    let fraction = scaledColor - lowerBound;
    let dithered = select(lowerBound, upperBound, fraction >= vec3<f32>(threshold));
    
    return dithered / levels;
}

@fragment
fn mainFragment(@location(0) uv: vec2<f32>, @builtin(position) position: vec4<f32>) -> @location(0) vec4<f32> {
    let originalColor = textureSample(uTexture, uSampler, uv);
    
    if (ditherUniforms.intensity <= 0.0) {
        return originalColor;
    }
    
    let screenPos = position.xy;
    
    var bayerValue: f32;
    if (ditherUniforms.matrixSize <= 4.0) {
        bayerValue = getBayerValue4x4(screenPos);
    } else {
        bayerValue = getBayerValue8x8(screenPos);
    }
    
    let ditheredColor = dither(originalColor.rgb, bayerValue);
    let finalColor = mix(originalColor.rgb, ditheredColor, ditherUniforms.intensity);
    
    return vec4<f32>(finalColor, originalColor.a);
}