<script lang="ts">
    import "../app.css";
    import type { LayoutProps } from "./$types";
    import Logo from "$lib/assets/zelo_logo.svelte";
    import github from "$lib/assets/logos/github.svg";
    import { onNavigate } from "$app/navigation";
    let { data, children }: LayoutProps = $props();

    // view transition stuff
    // TODO: This is from 2023, I don't know if there's a better way to do this
    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

{#snippet dropdown()}
    <div class="flex gap-6 text-violet-500">
        <a href="/">wares</a>
        <a href="/backgrounds">backgrounds</a>
        <a href="/qa">q&a</a>
        <!-- <a href="/blog">blog</a> -->
        <!-- <a href="/branding">branding</a> -->
        <!-- <a class="corkboard" href="https://corkboard.zelo.dev/">corkboard</a> -->
    </div>
{/snippet}

{#snippet socials()}
    <div class="flex gap-6 text-violet-500">
        <a href="/about">about</a>
        <a href="https://github.com/Zolo101" target="_blank" class="flex gap-2">
            <img src={github} alt="icon" class="h-6 w-6 dark:invert" />
            <span>github</span>
        </a>
    </div>
{/snippet}

<main class="dark:bg-violet-990 container m-auto bg-violet-100 md:px-20 md:py-5">
    <!-- Header -->
    <nav class="flex items-center gap-2 p-2 max-md:flex-col md:items-end md:gap-10">
        <Logo width={192} height={80} textFill="#ede9fe" backgroundFill="#7B00FF" />
        <div class="flex w-full justify-between">
            {@render dropdown()}
            {@render socials()}
        </div>
    </nav>
    <hr class="mt-2 mb-4 border-violet-300 dark:border-violet-900" />
    {@render children()}
</main>
<footer class="container m-auto h-64 md:px-20"></footer>

<style>
    /* nav {
        position: sticky;
        top: -50px;
        z-index: 10;
        animation: squash-desktop-nav 0.5s linear both;
        animation-timeline: scroll();
        animation-range: 8px 90px;
    } */

    footer {
        background: linear-gradient(in oklab, var(--color-violet-100) 100px, white);
    }

    @media (prefers-color-scheme: dark) {
        footer {
            background: linear-gradient(in oklab, var(--color-violet-990) 100px, black);
        }
    }

    /* @keyframes darken-bg {
        to {
            background-color: color-mix(var(--color-violet-990), black, 90%);
        }
    } */

    @keyframes squash {
        to {
            /* height: 50px; */
            transform: scaleY(0);
        }
    }

    /* @keyframes squash-desktop {
        to {
            transform: scaleY(0.45);
        }
    }

    @keyframes squash-desktop-nav {
        to {
            background-color: hsl(262.4, 77.8%, 8.9%);
        }
    }

    :global(svg) {
        transform-origin: center bottom;
        animation: squash-desktop 0.5s linear both;
        animation-timeline: scroll();
        animation-range: 35px 70px;
    } */

    @media (max-width: 768px) {
        :global(svg) {
            transform-origin: center bottom;
            animation: squash 0.5s linear both;
            animation-timeline: scroll();
            animation-range: 8px 90px;
        }

        footer {
            display: none;
        }
    }

    /* .children { */
    /* position: absolute; */
    /* top: 150px; */
    /* left: 90px; */
    /* width: 100%; */
    /* height: 100%; */
    /* } */

    /* main {
        height: max(100vh, 100%);
    } */
    /* .corkboard {
        color: color-mix(in srgb, var(--color-violet-500) 70%, var(--color-orange-200));
    } */
</style>
