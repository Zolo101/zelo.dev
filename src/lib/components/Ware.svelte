<script module>
    let by = 1;
    function snap(n: number, to: number) {
        return Math.round(n / to) * to;
    }

    Object.defineProperty(Container.prototype, "x", {
        get: function () {
            return this._position.x;
        },
        set: function (value) {
            this._position.x = snap(value, by);
        }
    });
    Object.defineProperty(Container.prototype, "y", {
        get: function () {
            return this._position.y;
        },
        set: function (value) {
            this._position.y = snap(value, by);
        }
    });
</script>

<script lang="ts">
    import animations from "$lib/animations";
    import dither from "$lib/shaders/dither/dither";
    import { Container, Application, Filter } from "pixi.js";
    import loading_animation from "$lib/assets/loading_scan.webp";
    import type { Attachment } from "svelte/attachments";
    import { fade } from "svelte/transition";

    let { ware = $bindable() }: { ware: WareItem } = $props();

    const date = new Date(ware.updatedDate || ware.date)
        .toLocaleString("en-GB", {
            year: "2-digit",
            month: "short"
        })
        .replace(" ", " '")
        .split(" ")[1];
    const newDate = new Date(ware.date).getFullYear() === new Date().getFullYear();
    const newUpdatedDate =
        new Date(ware.updatedDate).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 90;
    // 3 months

    // Set default filter resolution to 2 for all new Filter instances
    type Animation = (app: Application, meta?: { dark: boolean }) => void | Promise<void>;
    async function runAnimation(app: Application, ware: WareItem, meta?: { dark: boolean }) {
        const animation: Animation = animations[ware.name];

        if (animation) {
            await animation(app, meta);
            console.log("rendered", ware.name);
        } else {
            // animations.default(app, meta);
            animations.default(app);
            console.warn("rendered default");
        }
    }
    let ready = $state(false);

    function animation(ware: WareItem): Attachment {
        const meta = {
            dark: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
            reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        };

        return (element) => {
            // const tempDPR = window.devicePixelRatio;
            const tempDPR = 2;
            Filter.defaultOptions.resolution = tempDPR;
            const width = element.clientWidth;
            const height = element.clientHeight;
            const ro = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    app.ticker.stop();
                    app.renderer.resize(width / 4, height / 4);
                    app.stage.removeChildren();
                    runAnimation(app, ware, meta).then(() => {
                        app.render();

                        // TODO: Figure out why SOTU does not show on reduce motion
                        if (!meta.reducedMotion) {
                            app.ticker.start();
                        }
                    });
                }
            });

            const app = new Application();
            app.init({
                // width: 360 / tempDPR / 2,
                // height: 256 / tempDPR / 2,
                width: width / 4,
                height: height / 4,
                backgroundColor: 0x000000,
                resolution: tempDPR || 1,
                eventMode: "none",
                powerPreference: "low-power",
                antialias: false

                // idk
                // multiView: true

                // no idea if these actually do anything
                // roundPixels: true,
                // antialias: true
            }).then(() => {
                app.stage.cullable = true;
                element.appendChild(app.canvas);
                app.ticker.maxFPS = 10;

                // console.log(app.renderer.);

                app.stage.filters = [
                    // posterize(64.0)
                    dither({ intensity: 0.5, levels: 8, matrixSize: 4 })
                    // dither({ intensity: 0, levels: 4, matrixSize: 4 })
                ];

                // runAnimation(app, ware, meta);

                ro.observe(element);
                ready = true;
            });

            return () => {
                console.log("unmount animation");
                ro.unobserve(element);
                app.destroy();
            };
        };
    }
</script>

<a href={ware.link} aria-label={ware.name}>
    <div
        class="article relative h-full bg-white"
        class:new={newDate}
        class:updated={newUpdatedDate}
    >
        <div class="flex items-stretch bg-white dark:bg-black">
            {#if newDate}
                <div class="flex items-center">
                    <span
                        class="rainbow h-full bg-indigo-300 px-2 font-medium tracking-widest dark:bg-indigo-500"
                        >NEW</span
                    >
                </div>
            {/if}
            {#if newUpdatedDate}
                <div class="flex items-center">
                    <span
                        class="rainbow h-full bg-violet-300 px-2 font-medium tracking-widest dark:bg-violet-500"
                        >UPDATE</span
                    >
                </div>
            {/if}
            <div class="flex w-full justify-between tracking-wider text-black dark:text-white">
                <h1 class="px-1.5 font-medium">{ware.name}</h1>
                {#if !(newDate || newUpdatedDate)}
                    <p class="px-2">{date}</p>
                {/if}
            </div>
        </div>
        {#if newUpdatedDate}
        <!-- TODO: Freeze everything for Reduced motion users -->
            <!-- svelte-ignore a11y_distracting_elements -->
            <marquee
                class="absolute bg-violet-300 tracking-wider text-black italic dark:bg-violet-500"
            >
                {ware.updateText}
            </marquee>
        {/if}
        {#if !ready}
            <img
                src={loading_animation}
                alt="Loading Animation"
                class="absolute canvas-container w-full h-64 object-cover"
                style="image-rendering: pixelated;"
                transition:fade={{ duration: 200 }}
            />
        {/if}
        <div class="canvas-container h-64" {@attach animation(ware)}></div>
        <p
            class="absolute bottom-0 w-full bg-white px-2 pb-0.5 tracking-wide text-black dark:bg-black dark:text-white"
        >
            {ware.description}
        </p>
    </div>
</a>

<style>
    a[aria-label="Scale of the Universe"] {
        --grid-height: 1;
        --grid-width: 2;

        grid-row: span var(--grid-height);
        grid-column: span var(--grid-width);

        .canvas-container {
            height: calc(17rem * var(--grid-height));
        }
    }

    @media (max-width: 1295px) {
        a[aria-label="Scale of the Universe"] {
            --grid-height: 2;
        }
    }

    @media (max-width: 1024px) {
        a[aria-label="Scale of the Universe"] {
            --grid-height: 1;
        }
    }

    @media (max-width: 768px) {
        a {
            .canvas-container {
                /* height: calc(17rem * 3); */
                /* height: calc(100svh - 3lh); */
                height: calc(50vh);
            }
        }
    }

    @media (min-width: 768px) {
        .article {
            --shadow-size: 0.5rem;
            /* transition: box-shadow 0.2s ease-in; */
            transition:
                box-shadow 0.2s ease-out,
                transform 0.2s ease-out;
            box-shadow:
                calc((var(--shadow-size) / 3) * 1.5) calc((var(--shadow-size) / 3) * 1.5)
                    hsla(0, 0%, 33%, 0.25),
                calc((var(--shadow-size) / 3) * 3) calc((var(--shadow-size) / 3) * 3)
                    hsla(0, 0%, 66%, 0.0625);
            /* calc(var(--shadow-size) - 0.4rem) calc(var(--shadow-size) - 0.4rem) hsl(0, 0%, 60%), */
            /* calc(var(--shadow-size) - 0.5rem) calc(var(--shadow-size) - 0.5rem) hsl(0, 0%, 80%); */
            /* border-image: repeating-linear-gradient(45deg, white 0 4px, black 4px 5px) 20; */
        }

        .article:hover {
            border-bottom: 0rem solid;
            border-right: 0rem solid;
            box-shadow: 0rem 0rem black;
            transform: translateY(0.4rem) translateX(0.4rem);
        }
    }

    :global(canvas) {
        touch-action: pan-y !important; /* What's causing it to always do touch-action: none? */
    }

    @keyframes rainbow {
        0% {
            color: hsl(0deg, 0%, 0%);
        }
        100% {
            color: hsl(0deg, 0%, 50%);
        }
    }

    .rainbow {
        /* animation: rainbow 1s linear infinite alternate; */
        color: black;
    }

    .new {
        outline-color: var(--color-indigo-300);
    }

    .updated {
        outline-color: var(--color-violet-300);
    }

    @keyframes marquee {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(-100%);
        }
    }

    @media (prefers-color-scheme: dark) {
        .new {
            outline-color: var(--color-indigo-500);
        }

        .updated {
            outline-color: var(--color-violet-500);
        }
    }
</style>
