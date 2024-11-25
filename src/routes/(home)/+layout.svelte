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
        class="absolute top-0 w-full h-24 bg-gradient-to-b from-transparent via-neutral-950/10 via-75% to-neutral-950"
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
        /*@apply blur-sm;*/
        /*@apply blur-2xl;*/
        /*@apply brightness-50;*/
        @apply bg-neutral-950;
        /*background-image: url("$lib/assets/doubledoubledodecdouble2.png");*/
        /*background-size: cover;*/
        position: fixed;
        /*left: -5px;*/
        /*top: -5px;*/
        /*width: 105%;*/
        /*height: 105%;*/

        left: -100px;
        top: -100px;
        width: 150%;
        height: 150%;
        z-index: -1;

        overflow-x: hidden;

        perspective: 1px;
    }
</style>
