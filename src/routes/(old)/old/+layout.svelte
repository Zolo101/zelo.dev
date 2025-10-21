<script lang="ts">
    import "../../../app.css";
    import header from "$lib/assets/header.webp";
</script>

<svelte:head>
    <link rel="icon" href="favicon.png" />
    <link rel="preconnect" href="https://cdn.zelo.dev/" />
</svelte:head>

<div class="m"></div>
<div class="h-24 w-full">
    <img class="h-full w-full" alt="" src={header} />
    <div
        class="absolute top-0 h-24 w-full bg-linear-to-b from-transparent via-neutral-950/10 via-75% to-neutral-950"
    ></div>
</div>

<main class="m-auto h-full max-w-7xl">
    <header>
        <a
            class="mt-2.5 block cursor-pointer font-bold tracking-tighter no-underline transition-transform hover:scale-105"
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
