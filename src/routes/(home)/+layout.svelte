<script lang="ts">
    import "../../app.css";
    import header from "$lib/assets/header.webp";
</script>

<svelte:head>
    <link rel="icon" href="favicon.png" />
    <link rel="preconnect" href="https://cdn.zelo.dev/" />
</svelte:head>

<div class="m"></div>
<div class="w-full h-24">
    <img class="w-full h-full" alt="" src={header} />
    <div
        class="absolute top-0 w-full h-24 bg-linear-to-b from-transparent via-neutral-950/10 via-75% to-neutral-950"
    ></div>
</div>

<main class="h-full max-w-7xl m-auto">
    <header>
        <a
            class="mt-2.5 font-bold tracking-tighter no-underline block cursor-pointer hover:scale-105 transition-transform"
            href="/">zelo.dev</a
        >
    </header>
    <slot />
</main>

<style>
    .m {
        background: oklch(0.145 0 0);
        position: fixed;
        left: -100px;
        top: -100px;
        width: 150%;
        height: 150%;
        z-index: -1;
        overflow-x: hidden;
        perspective: 1px;
    }
</style>
