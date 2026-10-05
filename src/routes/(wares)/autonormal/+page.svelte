<script lang="ts">
    import { onMount } from "svelte";
    import { blockFaceUvs, decodeLabPbr, packBlockFaces } from "$lib/autonormal/lab-pbr";
    // import loadingScan from "$lib/assets/loading_scan.webp";
    import modrinthIcon from "$lib/assets/logos/modrinth.svg";
    import linuxIcon from "$lib/assets/logos/linux.svg";
    import macosIcon from "$lib/assets/logos/macos.svg";
    import windowsIcon from "$lib/assets/logos/windows.svg";
    import type { Application, CubeTexture, Texture } from "pixi.js";
    import type { BaseMaterial3D, CubeGeometry, View3D } from "@pixi/3d";
    import { type BloomEffect } from "@pixi/3d/extras";

    import f1 from "$lib/assets/autonormal/f1.png";
    import f2 from "$lib/assets/autonormal/f2.png?enhanced&w=640";
    import f3 from "$lib/assets/autonormal/f3.png?enhanced&w=640";
    import staticPreview from "$lib/assets/autonormal/static_a.png";

    type Platform = "Linux" | "macOS" | "Windows";

    const modUrl = "https://modrinth.com/mod/autonormal";
    const cliUrl = "https://github.com/Zolo101/autonormal";
    const platforms: Platform[] = ["Linux", "macOS", "Windows"];
    const platformIcons: Record<Platform, string> = {
        Linux: linuxIcon,
        macOS: macosIcon,
        Windows: windowsIcon
    };
    const glyph = ["01110", "00001", "01111", "10001", "10001", "01111"];
    const blockTextureUrls = import.meta.glob<string>("/src/lib/assets/autonormal/a/*.png", {
        eager: true,
        query: "?url",
        import: "default"
    });
    type BlockTexture = { side: string; top?: string; bottom?: string };
    // Row order follows the occupied cells of the glyph above.
    const blocks: BlockTexture[] = [
        { side: "iron_block" },
        { side: "spruce_log", top: "spruce_log_top", bottom: "spruce_log_top" },
        { side: "diamond_ore" },
        { side: "redstone_lamp_on" },
        { side: "tnt_side", top: "tnt_top", bottom: "tnt_bottom" },
        { side: "prismarine_bricks" },
        { side: "obsidian" },
        { side: "purpur_block" },
        { side: "bricks" },
        { side: "gold_block" },
        { side: "melon_side", top: "melon_top", bottom: "melon_top" },
        { side: "redstone_block" },
        { side: "sand" },
        { side: "sulfur_bricks" },
        { side: "bookshelf" },
        { side: "ice" }
    ];
    // TODO: Might've been better to take screenshots at a lower FOV...
    // TODO: The bookshelf needs wooden planks on the top & bottom
    const features = [
        {
            number: "01",
            title: "Add PBR textures to any block, item or entity",
            description: "You can choose which mods to exclude, which kind of texture to skip.",
            image: f1,
            tiled: true
        },
        {
            number: "02",
            title: "Specifically for minecraft!",
            description:
                "We've created a custom model trained on minecraft textures to give the best quality for generating normal and specular maps.",
            image: f2,
            tiled: false
        },
        {
            number: "03",
            title: "Post processing effects",
            description: "Not just PBR! Autonormal can also modify textures, such as upscaling!",
            image: f3,
            tiled: false
        }
    ];

    let canvasHost: HTMLDivElement;
    let previewCanvas: HTMLCanvasElement;
    let platform = $state<Platform>("Linux");
    let ready = $state(false);
    let previewFailed = $state(false);
    let playing = $state(true);
    let updatePlayback: (() => void) | undefined;

    function togglePlayback() {
        playing = !playing;
        updatePlayback?.();
    }

    onMount(() => {
        if (/Mac/i.test(navigator.platform)) platform = "macOS";
        else if (/Win/i.test(navigator.platform)) platform = "Windows";

        let disposed = false;
        let app: Application | undefined;
        let initialized = false;
        let view: View3D | undefined;
        let bloom: BloomEffect | undefined;
        // let tiltshift: TiltShiftEffect | undefined;
        let geometry: CubeGeometry | undefined;
        let environment: CubeTexture | undefined;
        const materials: BaseMaterial3D[] = [];
        const textures: Texture[] = [];
        const textureRequests = new AbortController();
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
        playing = !motionPreference.matches;
        let visible = true;
        let pointerX = 0;
        let pointerY = 0;
        let time = 0;

        function destroyScene() {
            textureRequests.abort();
            if (initialized) app?.stop();
            if (view) view.environment = null;
            view?.destroy({ children: true });
            view = undefined;
            bloom?.destroy();
            bloom = undefined;
            // tiltshift?.destroy();
            // tiltshift = undefined;
            // Release renderer bindings before the textures they reference.
            if (initialized) app?.destroy({ removeView: false }, { children: true });
            geometry?.destroy();
            geometry = undefined;
            materials.splice(0).forEach((material) => material.destroy());
            environment?.destroy(true);
            environment = undefined;
            textures.splice(0).forEach((texture) => texture.destroy(true));
            app = undefined;
            initialized = false;
        }

        function pointerMove(event: PointerEvent) {
            const bounds = canvasHost.getBoundingClientRect();
            pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.45;
            pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.25;
        }

        function pointerLeave() {
            pointerX = pointerY = 0;
        }

        function syncPlayback() {
            if (!initialized || disposed) return;
            if (playing && visible && !document.hidden) app?.start();
            else app?.stop();
        }

        function motionChanged() {
            playing = !motionPreference.matches;
            syncPlayback();
        }

        const observer = new ResizeObserver(() => {
            if (!initialized || disposed) return;
            app?.renderer.resize(canvasHost.clientWidth, canvasHost.clientHeight);
            app?.render();
        });
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            syncPlayback();
        });
        observer.observe(canvasHost);
        visibilityObserver.observe(canvasHost);
        canvasHost.addEventListener("pointermove", pointerMove);
        canvasHost.addEventListener("pointerleave", pointerLeave);
        document.addEventListener("visibilitychange", syncPlayback);
        motionPreference.addEventListener("change", motionChanged);
        updatePlayback = syncPlayback;

        async function createScene() {
            // found it a bit funny how ai called pixi/3d "three" like three.js...
            const [pixi, three, { BloomEffect }] = await Promise.all([
                import("pixi.js"),
                import("@pixi/3d"),
                import("@pixi/3d/extras")
            ]);
            if (disposed) return;
            app = new pixi.Application();
            await app.init({
                canvas: previewCanvas,
                width: canvasHost.clientWidth,
                height: canvasHost.clientHeight,
                backgroundAlpha: 0,
                antialias: true,
                resolution: Math.min(window.devicePixelRatio || 1, 2),
                autoDensity: true,
                preference: "webgl",
                autoStart: false
            });
            initialized = true;
            if (disposed) {
                destroyScene();
                return;
            }

            async function loadPixels(name: string, suffix = "") {
                const url = blockTextureUrls[`/src/lib/assets/autonormal/a/${name}${suffix}.png`];
                if (!url) throw new Error(`Missing Minecraft texture: ${name}${suffix}`);
                const response = await fetch(url, { signal: textureRequests.signal });
                if (!response.ok)
                    throw new Error(`Could not load Minecraft texture: ${name}${suffix}`);
                const bitmap = await createImageBitmap(await response.blob(), {
                    premultiplyAlpha: "none",
                    colorSpaceConversion: "none"
                });
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = bitmap.width;
                    canvas.height = bitmap.height;
                    const context = canvas.getContext("2d", { willReadFrequently: true });
                    if (!context) throw new Error("Block texture canvas unavailable");
                    context.drawImage(bitmap, 0, 0);
                    return context.getImageData(0, 0, bitmap.width, bitmap.height);
                } finally {
                    bitmap.close();
                }
            }
            const faceNames = [
                ...new Set(
                    blocks.flatMap(({ side, top, bottom }) => [side, top ?? side, bottom ?? side])
                )
            ];
            const faces = new Map(
                await Promise.all(
                    faceNames.map(async (name) => {
                        const [albedo, normal, specular] = await Promise.all([
                            loadPixels(name),
                            loadPixels(name, "_n"),
                            loadPixels(name, "_s")
                        ]);
                        return [name, decodeLabPbr(albedo, normal, specular)] as const;
                    })
                )
            );
            if (disposed) return;

            // LabPBR dielectric reflectance is independent of metalness. Pixi's
            // core material fixes it from IOR, so read F0 from the packed R channel.
            const labPbrReflectance = {
                name: "autonormalLabPbrReflectance",
                gpu: {
                    fragment: {
                        material: `
                    fresnelF0 = mix(vec3<f32>(sampleMetallicRoughness(input.vUV).r), albedo, metallic);
                `
                    }
                },
                gl: {
                    fragment: {
                        material: `
                    fresnelF0 = mix(vec3(sampleMetallicRoughness(vUV).r), albedo, metallic);
                `
                    }
                }
            };
            const blockMaterials = blocks.map(({ side, top = side, bottom = side }) => {
                const maps = packBlockFaces([
                    faces.get(side)!,
                    faces.get(top)!,
                    faces.get(bottom)!
                ]);
                function textureFrom(pixels: Uint8Array, label: string) {
                    const texture = new pixi.Texture({
                        source: new pixi.BufferImageSource({
                            resource: pixels,
                            width: maps.width,
                            height: maps.height,
                            format: "rgba8unorm",
                            alphaMode: "premultiplied-alpha",
                            scaleMode: "nearest",
                            label: `${side}-${label}`
                        })
                    });
                    textures.push(texture);
                    return texture;
                }
                const material = new three.Material3D({
                    baseColorTexture: textureFrom(maps.baseColor, "albedo"),
                    normalTexture: textureFrom(maps.normals, "normal"),
                    normalScale: 1,
                    metallicRoughnessTexture: textureFrom(
                        maps.metallicRoughness,
                        "metallic-roughness"
                    ),
                    occlusionTexture: textureFrom(maps.occlusion, "occlusion"),
                    metallic: 1,
                    roughness: 1,
                    alphaMode: maps.transparent ? "blend" : "opaque",
                    extraBits: [labPbrReflectance],
                    ...(maps.hasEmission
                        ? {
                              emissive: {
                                  texture: textureFrom(maps.emissive, "emissive"),
                                  strength: 2
                              }
                          }
                        : {})
                });
                materials.push(material);
                return material;
            });
            const lightMaterial = new three.FlatMaterial({ baseColor: 0xffefd6 });
            materials.push(lightMaterial);

            // A small studio cubemap supplies real reflected shapes, including
            // bright softboxes, rather than a uniform hemisphere fill.
            function studioFace(base: string, panel: string, offset: number) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = 64;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Reflection canvas unavailable");
                context.fillStyle = base;
                context.fillRect(0, 0, 64, 64);
                context.fillStyle = panel;
                context.fillRect(offset, 8, 12, 48);
                context.fillStyle = "#604478";
                context.fillRect(44, 0, 4, 64);
                const texture = pixi.Texture.from(canvas);
                textures.push(texture);
                return texture;
            }
            environment = pixi.CubeTexture.from({
                faces: {
                    right: studioFace("#30203e", "#d5c8f3", 12),
                    left: studioFace("#201329", "#bba2da", 36),
                    top: studioFace("#71617e", "#f5ebff", 24),
                    bottom: studioFace("#170e20", "#523664", 8),
                    front: studioFace("#35233f", "#fff1db", 18),
                    back: studioFace("#21152c", "#9877bc", 40)
                },
                label: "autonormal-studio"
            });

            // bloom = new BloomEffect({ threshold: 0.8, intensity: 0.6, radius: 0.6 });
            bloom = new BloomEffect({
                threshold: 0.6,
                intensity: 1,
                radius: 1
            });
            // TODO: what about a super high threshold but super high intensity bloom that acts as like a glint
            view = new three.View3D({
                autoResize: true,
                environment,
                toneMapping: "aces", // kinda bland
                // passes: [bloom, tiltshift]
                passes: [bloom]
            });
            app.stage.addChild(view);
            view.camera.fov = 35;
            view.camera.position.set(0, 0.15, 11.5);
            view.camera.lookAt({ x: 0, y: 0, z: 0 });
            const key = new three.PointLight({ color: 0xffefd6, intensity: 85, range: 14 });
            const rim = new three.DirectionalLight({ color: 0xbca5ff, intensity: 0.8 });
            rim.position.set(4, 1, -2);
            rim.lookAt({ x: 0, y: 0, z: 0 });
            const fill = new three.AmbientLight({ color: 0xf6efff, intensity: 0.7 });
            view.root.addChild(key, rim, fill);

            const logo = new three.Container3D();
            logo.scale.set(1.18, 1.18, 1.18);
            view.root.addChild(logo);
            // const cubeGeometry = new three.CubeGeometry({ width: 0.73, height: 0.73, depth: 0.85 });
            const cubeGeometry = new three.CubeGeometry({ width: 0.73, height: 0.73, depth: 0.73 });
            geometry = cubeGeometry;
            const faceSize = faces.get(blocks[0].side)!.width;
            cubeGeometry.uvs = blockFaceUvs(
                cubeGeometry.uvs as Float32Array,
                cubeGeometry.normals!,
                faceSize
            );
            let blockIndex = 0;
            glyph.forEach((row, y) => {
                [...row].forEach((pixel, x) => {
                    if (pixel !== "1") return;
                    const cube = new three.Mesh3D({
                        geometry: cubeGeometry,
                        material: blockMaterials[blockIndex++]
                    });
                    // cube.position.set((x - 2) * 0.76, (2.5 - y) * 0.76, 0);
                    cube.position.set((x - 2) * 0.73, (2.5 - y) * 0.73, 0);
                    logo.addChild(cube);
                });
            });

            const satellites = [
                { position: [-2.85, 1.8, -0.5], size: 0.48, material: blockMaterials[4] },
                { position: [2.85, -1.7, 0.3], size: 0.62, material: blockMaterials[9] },
                { position: [2.3, 2.6, -1], size: 0.26, material: blockMaterials[7] }
            ].map(({ position, size, material }) => {
                const cube = new three.Mesh3D({ geometry: cubeGeometry, material });
                cube.position.set(position[0], position[1], position[2]);
                cube.scale.set(size, size, size);
                cube.rotation.set(0.3, 0.5, 0.2);
                view!.root.addChild(cube);
                return { cube, originalY: position[1] };
            });

            logo.rotation.set(-0.13, -0.38, -0.06);
            const lamp = new three.Mesh3D({ geometry: cubeGeometry, material: lightMaterial });
            lamp.scale.set(0.16, 0.16, 0.16);
            view.root.addChild(lamp);
            function moveLight() {
                const angle = time * 0.22 + 0.85;
                key.position.set(
                    Math.cos(angle) * 3.4,
                    1.3 + Math.sin(angle) * 1.2,
                    Math.sin(angle) * 3.6
                );
                lamp.position.copyFrom(key.position);
                lamp.rotation.set(angle * 0.3, angle, 0.2);
            }
            moveLight();
            app.ticker.maxFPS = 40;
            app.ticker.add((ticker) => {
                time += ticker.deltaMS * 0.001 * 2; // last multi is speed
                moveLight();
                logo.rotation.y += (-0.38 + pointerX * 10 - logo.rotation.y) * 0.04;
                logo.rotation.x += (-0.13 + pointerY * 10 - logo.rotation.x) * 0.04;
                logo.position.y = Math.sin(time * 0.8) * 0.04;
                satellites.forEach(({ cube, originalY }, index) => {
                    cube.position.y = originalY + Math.sin(time * 0.6 + index * 2) * 0.12;
                    cube.rotation.y += ticker.deltaMS * 0.0002;
                });
            });
            app.render();
            ready = true;
            syncPlayback();
        }

        void createScene().catch((error: unknown) => {
            destroyScene();
            if (!disposed) {
                previewFailed = true;
                console.warn("autonormal preview could not initialize", error);
            }
        });

        return () => {
            disposed = true;
            observer.disconnect();
            visibilityObserver.disconnect();
            canvasHost.removeEventListener("pointermove", pointerMove);
            canvasHost.removeEventListener("pointerleave", pointerLeave);
            document.removeEventListener("visibilitychange", syncPlayback);
            motionPreference.removeEventListener("change", motionChanged);
            updatePlayback = undefined;
            if (initialized) destroyScene();
        };
    });
</script>

<svelte:head>
    <title>autonormal by zelo</title>
    <meta
        name="description"
        content="Turn your Minecraft modpack's textures into a shader-ready labPBR resource pack with autonormal. Available as a Minecraft mod."
    />
</svelte:head>

{#snippet arrow()}
    <svg
        class="ml-auto shrink-0"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="3" />
    </svg>
{/snippet}

<div class="autonormal-page pt-2 pb-4 text-violet-950 dark:text-violet-100">
    <!-- <div class="mb-6.25 flex items-center justify-between text-sm max-md:mb-5">
        <a class="text-violet-950/60 dark:text-violet-300/75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-990 dark:focus-visible:outline-violet-300" href="/">wares <span class="mx-2.5 text-violet-300 dark:text-violet-700">/</span> <strong class="font-medium text-violet-950 dark:text-violet-100">autonormal</strong></a>
    </div> -->

    <section
        class="hero grid items-center max-md:grid-cols-1 lg:grid-cols-[1.08fr_1fr]"
        aria-labelledby="autonormal-title"
    >
        <div
            class="relative min-h-132.5 self-stretch overflow-hidden max-md:min-h-105 max-sm:my-25 max-sm:min-h-150 xl:min-h-142.5"
        >
            <!-- <div
                class="pointer-events-none absolute top-42/100 left-1/2 h-47/100 w-3/4 -translate-1/2 -rotate-35 rounded-full border-2 border-violet-300/35 dark:border-violet-800/10"
                aria-hidden="true"
            ></div>
            <div
                class="pointer-events-none absolute top-42/100 left-1/2 h-36/100 w-82/100 -translate-1/2 rotate-35 rounded-full border-2 border-dashed border-violet-300/35 dark:border-violet-800/10"
                aria-hidden="true"
            ></div> -->
            <div
                class="absolute inset-x-0 top-5 bottom-14.5"
                bind:this={canvasHost}
                aria-hidden="true"
            >
                <canvas
                    class="block h-full w-full [image-rendering:auto]"
                    class:invisible={!ready || previewFailed}
                    bind:this={previewCanvas}
                ></canvas>
                {#if !ready || previewFailed}
                    <img
                        class="pointer-events-none absolute inset-0 h-full w-full object-contain"
                        src={staticPreview}
                        alt=""
                        width="689"
                        height="615"
                        fetchpriority="high"
                    />
                {/if}
            </div>
            <!-- <div class="absolute right-4.5 bottom-4.5 left-6 flex items-center justify-end gap-2.5 max-[1100px]:inset-x-3.75">
                <button
                    class="grid size-8.5 cursor-pointer place-items-center rounded-lg border border-violet-300 dark:border-violet-800 text-violet-950/60 dark:text-violet-300/75 disabled:cursor-default dark:bg-violet-990 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-990 dark:focus-visible:outline-violet-300"
                    disabled={!ready}
                    onclick={togglePlayback}
                    aria-label={playing ? "Pause animation" : "Play animation"}
                    aria-pressed={playing}
                >
                    {#if playing}<span class="h-2.75 w-2 border-x-2 border-current" aria-hidden="true"></span>{:else}<span
                            class="size-0 border-y-5 border-l-8 border-y-transparent border-l-current"
                            aria-hidden="true"
                        ></span>{/if}
                </button>
            </div> -->
            <!-- {#if previewFailed}
                <p
                    class="absolute bottom-4 w-full text-center font-mono text-xs text-violet-950/60 dark:text-violet-300/75"
                    role="status"
                >
                    3D preview unavailable.
                </p>
            {/if} -->
        </div>

        <div class="py-4.25 max-lg:mb-25 max-md:px-1 max-md:py-0">
            <!-- <h1 id="autonormal-title">
                auto<span>normal</span>
            </h1> -->
            <h1
                class="hero-title text-primary mt-3.5 mb-5 text-center text-8xl font-bold -tracking-[0.3125rem] max-[1100px]:-tracking-[0.21875rem] max-md:mt-2.75 max-md:mb-4 max-md:text-7xl max-md:-tracking-[0.25rem] dark:text-white"
            >
                autonormal
            </h1>
            <p
                class="mt-4.25 text-2xl text-violet-950/60 max-md:max-w-full lg:text-xl dark:text-violet-300/75"
            >
                Give your minecraft world the glow-up it deserves. Turn your modpack textures into a <strong
                    class="font-medium text-violet-950 dark:text-violet-100"
                    >shader-ready labPBR resource pack.</strong
                >
                <!-- Automagically. -->
            </p>
            <!-- <div class="mt-3.75 flex gap-1.75">
                <span class="rounded-sm border border-violet-300 dark:border-violet-800 px-1.75 py-0.75 font-mono text-xs text-violet-950/60 dark:text-violet-300/75 dark:bg-violet-990">normal maps</span><span class="rounded-sm border border-violet-300 dark:border-violet-800 px-1.75 py-0.75 font-mono text-xs text-violet-950/60 dark:text-violet-300/75 dark:bg-violet-990">specular maps</span><span class="rounded-sm border border-violet-300 dark:border-violet-800 px-1.75 py-0.75 font-mono text-xs text-violet-950/60 dark:text-violet-300/75 dark:bg-violet-990">labPBR</span>
            </div> -->

            <div class="mt-6.75 max-md:mt-5.75">
                <a
                    class="download-button focus-visible:outline-violet-990 flex items-center gap-3.25 rounded-lg border-3 border-green-200 bg-green-100 px-4.25 py-3.5 text-green-800 transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-4 dark:border-green-800 dark:bg-green-950 dark:text-green-100 dark:hover:border-green-300 dark:focus-visible:outline-violet-300"
                    href={modUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get the Minecraft mod on Modrinth"
                >
                    <span
                        class="brand-icon inline-block size-6.25 shrink-0 bg-current"
                        style:--icon={`url("${modrinthIcon}")`}
                        aria-hidden="true"
                    ></span>
                    <span class="flex flex-col gap-0.75"
                        ><strong class="text-sm font-bold">Download Mod</strong></span
                    >
                    {@render arrow()}
                </a>
                <!-- <a
                    class="download-button flex items-center gap-3.25 rounded-lg border-2 px-4.25 py-3.5 transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-990 dark:focus-visible:outline-violet-300 mt-2.25 border-violet-950 bg-violet-950 text-violet-100 dark:border-violet-800 dark:bg-violet-900"
                    href={cliUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get the CLI for ${platform} — GitHub project, coming soon`}
                >
                    <span
                        class="brand-icon inline-block size-6.25 shrink-0 bg-current"
                        style:--icon={`url("${platformIcons[platform]}")`}
                        aria-hidden="true"
                    ></span>
                    <span class="flex flex-col gap-0.75"
                        ><strong class="text-xs font-bold"
                            >Get the CLI <span class="text-xs font-normal text-violet-300">/ {platform}</span></strong
                        ></span
                    >
                    <svg class="ml-auto shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                        ><path
                            d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"
                            stroke="currentColor"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /></svg
                    >
                </a> -->
                <!-- <div class="mt-2.75 flex items-center gap-0.75 text-[0.625rem] text-violet-950/60 dark:text-violet-300/75" role="group" aria-label="CLI operating system">
                    {#each platforms as option (option)}
                        <button
                            class="inline-flex cursor-pointer items-center gap-1.25 rounded-xs border border-transparent px-1.75 py-1 aria-pressed:border-violet-300 aria-pressed:bg-violet-50 aria-pressed:text-violet-990 dark:aria-pressed:border-violet-800 dark:aria-pressed:bg-violet-900 dark:aria-pressed:text-violet-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-990 dark:focus-visible:outline-violet-300"
                            aria-pressed={platform === option}
                            onclick={() => {
                                platform = option;
                            }}
                        >
                            <span
                                class="brand-icon inline-block size-3 shrink-0 bg-current"
                                style:--icon={`url("${platformIcons[option]}")`}
                                aria-hidden="true"
                            ></span>
                            {option}</button
                        >
                    {/each}
                </div> -->
            </div>
        </div>
    </section>

    <section class="mt-14.5 max-md:mt-10.25" aria-labelledby="features-title">
        <!-- <div class="flex items-center justify-between gap-5 border-b border-violet-300 dark:border-violet-800 pb-4.75 max-md:flex-col max-md:items-start max-md:gap-1.75">
            <h2 class="text-[1.375rem] font-semibold -tracking-[0.05rem] max-md:text-[1.4375rem]" id="features-title">Flat textures have potential.</h2>
        </div> -->
        <!-- <hr class="border-primary" /> -->
        <div class="features mt-6 grid grid-cols-3 gap-5.75 max-md:grid-cols-1 max-md:gap-7.25">
            {#each features as feature (feature.number)}
                <article>
                    <div
                        class="feature-image relative aspect-17/10 overflow-hidden rounded-lg border-2 border-violet-300 bg-violet-950 after:pointer-events-none after:absolute after:inset-0 max-md:aspect-19/10 dark:border-violet-400"
                    >
                        {#if feature.tiled}
                            <div
                                class="feature-pattern"
                                style:background-image={`url("${feature.image}")`}
                                aria-hidden="true"
                            ></div>
                        {:else}
                            <enhanced:img
                                class="block h-full w-full object-cover"
                                src={feature.image}
                                alt=""
                                loading="lazy"
                            />
                        {/if}
                        <!-- <span
                            class="absolute top-3.25 left-3.5 z-1 font-mono text-[0.625rem] text-violet-100"
                            >{feature.number} /</span
                        > -->
                    </div>
                    <div class="pt-4.75 max-md:pt-3.75">
                        <h3 class="mt-2 text-xl font-bold max-md:text-lg">
                            {feature.title}
                        </h3>
                        <p
                            class="mt-2.5 text-sm text-violet-950/60 max-md:text-lg dark:text-violet-300/75"
                        >
                            {feature.description}
                        </p>
                    </div>
                </article>
            {/each}
        </div>
    </section>
    <!-- <div class="mt-11.25 flex items-center justify-end gap-5 border-t border-violet-300 dark:border-violet-800 pt-4.25 font-mono text-xs text-violet-950/60 dark:text-violet-300/75 max-md:mt-7.5 max-md:flex-col max-md:items-start max-md:gap-3 max-md:leading-relaxed">
        <a class="flex items-center gap-1.75 text-violet-990 dark:text-violet-300 [&_svg]:size-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-990 dark:focus-visible:outline-violet-300" href="/about">a project by zelo {@render arrow()}</a>
    </div> -->
</div>

<style>
    :global(main) {
        background: linear-gradient(transparent 500px, var(--color-violet-100) 700px);
    }

    :global(#logo rect) {
        fill: transparent !important;
    }

    .download-button {
        background: linear-gradient(178deg, var(--color-green-200) 10%, var(--color-green-300) 70%);

        &:hover {
            background: linear-gradient(
                178deg,
                var(--color-green-300) 10%,
                var(--color-green-400) 70%
            );
            box-shadow: 0 5px 14px color-mix(in srgb, var(--color-violet-950) 7%, transparent);
        }
    }

    @media (prefers-color-scheme: dark) {
        :global(main) {
            background: linear-gradient(transparent 500px, var(--color-violet-990) 700px);
        }

        .download-button {
            /* transition: background-color 300ms ease-in; */
            background: linear-gradient(
                178deg,
                var(--color-green-600) 10%,
                var(--color-green-800) 70%
            );

            &:hover {
                background: linear-gradient(
                    178deg,
                    var(--color-green-500) 10%,
                    var(--color-green-700) 70%
                );
                box-shadow: 0 5px 14px color-mix(in srgb, var(--color-violet-950) 7%, transparent);
            }
        }
    }

    .feature-pattern {
        position: absolute;
        /* Extend the tiled layer so rotating it still fills the card's corners. */
        inset: -50%;
        background-position: center;
        background-repeat: repeat;
        background-size: 12rem auto;
        transform: rotate(-15deg);
        opacity: 0.7;
    }

    article:last-child img {
        /* filter: hue-rotate(50deg); */
        filter: sepia();
    }

    /* .autonormal-page {
        --font-mono: "DM Mono", monospace;
    } */

    /* Override the layout's unlayered mobile SVG animation. */
    .autonormal-page :global(svg) {
        animation: none;
    }

    /* Keep fluid sizing and layered effects in CSS. */
    .hero {
        /* rectangle radial gradient */
        /* background:
            linear-gradient(
                to right,
                var(--color-violet-990),
                var(--color-black) 20%,
                var(--color-black) 80%,
                var(--color-violet-990)
            ),
            linear-gradient(
                to bottom,
                var(--color-violet-990),
                var(--color-black) 50%,
                var(--color-black) 80%,  var(--color-violet-990)
            ); */
        /* background: radial-gradient(
            ellipse at center in hsl shorter hue,
            var(--color-black) 10%,
            var(--color-violet-990) 70%
        ); */
        /* background-blend-mode: lighten; */
        gap: clamp(1.75rem, 4vw, 4rem);
    }

    .brand-icon {
        -webkit-mask: var(--icon) center / contain no-repeat;
        mask: var(--icon) center / contain no-repeat;
    }

    .feature-image::after {
        /* TODO: IDK if i like the purple gradient thingy... */
        /* background: linear-gradient(
            transparent 40%,
            color-mix(in srgb, var(--color-violet-950) 40%, transparent)
        ); */
    }

    @media (max-width: 1100px) {
        .hero {
            gap: 1.75rem;
        }
    }

    @media (max-width: 760px) {
        .hero {
            gap: 1.6875rem;
        }

        /* .hero-title {
            font-size: clamp(4.75rem, 11vw, 4.75rem);
        } */
    }
</style>
