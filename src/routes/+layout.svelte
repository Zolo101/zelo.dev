<script lang="ts">
    import "../app.css";
    import { onNavigate } from "$app/navigation";
    import header from "$lib/assets/header.png";

    onNavigate((navigation) => {
        // @ts-ignore
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            // @ts-ignore
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete;
            })
        })
    })
</script>

<div class="m"></div>
<div class="w-full h-24">
    <img class="w-full h-full" src={header}/>
    <div class="absolute top-5 w-full h-24 bg-gradient-to-b from-transparent to-neutral-950"></div>
</div>
<main class="h-full max-w-4xl m-auto">
    <header>
        <a class="mt-2.5 no-underline block cursor-pointer hover:underline" href="https://zelo.dev/">zelo.dev</a>
    </header>
    <slot/>
    <noscript>
        <p>This website currently requires Javascript to be enabled.</p>
        <p>Hopefully in the future... it won't need to be.</p>
    </noscript>
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