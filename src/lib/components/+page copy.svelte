<script lang="ts">
    import ExternalLink from "$lib/components/ExternalLink.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    function oklchToLinearSRGB(L: number, C: number, hDegrees: number): [number, number, number] {
        const h = (hDegrees * Math.PI) / 180;

        // OKLCH → OKLab
        const a = C * Math.cos(h);
        const b = C * Math.sin(h);

        // OKLab → LMS
        const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
        const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
        const s_ = L - 0.0894841775 * a - 1.291485548 * b;

        const l = l_ ** 3;
        const m = m_ ** 3;
        const s = s_ ** 3;

        // LMS → linear sRGB
        const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

        return [r, g, blue];
    }

    function inSRGBGamut(L: number, C: number, h: number): boolean {
        const [r, g, b] = oklchToLinearSRGB(L, C, h);

        return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
    }

    function maxChromaForLightness(
        lightness: number,
        hue: number,
        inGamut: (l: number, c: number, h: number) => boolean
    ): number {
        let low = 0;
        let high = 0.5;

        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;

            if (inGamut(lightness, mid, hue)) {
                low = mid;
            } else {
                high = mid;
            }
        }

        return low;
    }

    const fsplash = (i: number) => {
        let [x, y, z] = i.toString().padStart(3, "0").split("").map(Number);

        // let l = (y + z) / 18;
        // let c = maxChromaForLightness(l, Math.sin(y / 9) * 360, inSRGBGamut);
        // let h = Math.sin(z / 9) * 360;

        // let l = 0; //Math.sin(z / 18) + Math.cos(y / 18) / 4;
        // let c = 0.8; // maxChromaForLightness(l, Math.sin(x / 9) * 360, inSRGBGamut);
        // let h = Math.sin((y + 2.5) / 4.5) * 360 + Math.cos((z - 4.5) / 4.5) * 180;

        // let p = Math.atan2(y - 4.5, z - 4.5) + Math.PI / 1.75;
        // let l = (x + 1) / 11;
        // let c = maxChromaForLightness(l, Math.sin(z / 9), inSRGBGamut);
        // let h = p * 50;

        let p = Math.atan2(y - 4.5, z - 4.5) + Math.PI / 1.75;
        let l = (x + 1) / 11;
        let c = maxChromaForLightness(l, Math.sin(z / 9), inSRGBGamut);
        let h = p * 50;
        return `oklch(${l} ${c} ${h})`;
    };
</script>

<p>
    This is a modified version of TodePond's <ExternalLink
        href="https://www.todepond.com/lab/splash/">splash</ExternalLink
    > but using oklab.
</p>
<p>I call it... analog colour.</p>

<p>Why? Because of this...</p>

{@render acolour(0)}
{@render acolour(1)}
{@render acolour(2)}

{#snippet acolour(i: number)}
    <span
        class="my-auto px-4 py-2 text-center text-xl font-bold"
        style="background-color: {fsplash(i)}">{i.toString().padStart(3, "0")}</span
    >
{/snippet}

<section class="fsplashes tabular-nums">
    {#each new Array(1000) as _, i (i)}
        <span
            class="my-auto px-4 py-2 text-center text-xl font-bold"
            style="background-color: {fsplash(i)}">{i.toString().padStart(3, "0")}</span
        >
    {/each}
</section>

<style>
    .fsplashes {
        display: grid;
        font-family: sans-serif;
        grid-template-columns: repeat(10, 1fr);
        text-shadow:
            1px 0 0 black,
            -1px 0 0 black,
            0 1px 0 black,
            0 -1px 0 black;
        gap: 8px;
    }
</style>
