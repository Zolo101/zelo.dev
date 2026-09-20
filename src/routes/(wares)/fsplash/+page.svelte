<script lang="ts">
    import ExternalLink from "$lib/components/ExternalLink.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const fsplash = (hour: number, minute: number) => {
        return `hsl(${(minute / 60) * 360}deg 100% ${Math.sin(hour / 5 + 5.5) * 100})`;
    };

    const interval = 5;
</script>

<!-- <p>
    This is a modified version of TodePond's <ExternalLink
        href="https://www.todepond.com/lab/splash/">splash</ExternalLink
    > but using oklab.
</p> -->
<p class="text-center text-7xl font-black">analog colour</p>

<!-- <p>Why? Because of this...</p>

<div class="grid w-40 grid-cols-2 gap-4">
    {@render acolour(0, 0)}
    {@render acolour(1, 0)}
    {@render acolour(2, 0)}
</div> -->

<p></p>

<button class="rounded bg-purple-800 px-4 py-2 font-bold text-white"
    >Calculate Daytime and Nighttime</button
>

<hr class="my-4 border-violet-300 dark:border-violet-900" />

{#snippet acolour(hours: number, minutes: number)}
    <span
        class="my-auto px-4 py-2 text-center text-sm font-bold"
        style="background-color: {fsplash(hours, minutes)}"
        >{hours}:{minutes.toString().padStart(2, "0")}</span
    >
{/snippet}

<section class="fsplashes tabular-nums">
    {#each new Array((24 * 60) / interval) as _, i (i)}
        {@const minutes = (i * interval) % 60}
        {@const hours = Math.floor((i * interval) / 60)}
        {@render acolour(hours, minutes)}
    {/each}
</section>

<style>
    .fsplashes {
        display: grid;
        font-family: sans-serif;
        grid-template-columns: repeat(12, 1fr);
        text-shadow:
            1px 0 0 black,
            -1px 0 0 black,
            0 1px 0 black,
            0 -1px 0 black;
        gap: 8px;
    }
</style>
