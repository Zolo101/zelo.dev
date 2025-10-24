<script lang="ts">
    import "../../app.css";
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
        <!-- <a href="/branding">branding</a> -->
        <!-- <a class="corkboard" href="https://corkboard.zelo.dev/">corkboard</a> -->
    </div>
{/snippet}

{#snippet socials()}
    <div class="flex gap-6 text-violet-400">
        <!-- icons here -->
        <!-- <a>about</a> -->
        <!-- <a>old site</a> -->
        <a href="https://github.com/Zolo101" target="_blank" class="flex gap-2">
            <img src={github} alt="icon" class="h-6 w-6 dark:invert" />
            <span>github</span>
        </a>
        <!-- <a href="https://github.com/Zolo101">github</a> -->
        <!-- <a>discord</a> -->
    </div>
{/snippet}

<!-- TODO: Fade transitions -->
<main class="dark:bg-violet-990 container m-auto bg-violet-100 px-1 md:px-20 md:py-5">
    <!-- Header -->
    <nav class="max-md flex items-center gap-2 px-2 pt-2 max-md:flex-col md:items-end md:gap-10">
        <Logo width={192} height={80} textFill="#ede9fe" backgroundFill="#7B00FF" />
        <!-- <h1 class="text-7xl font-light text-violet-600">{page}</h1> -->
        <div class="flex w-full justify-between">
            {@render dropdown()}
            {@render socials()}
        </div>
    </nav>
    <hr class="my-4 border-violet-300 dark:border-violet-900" />
    <!-- <img src={zelo_logo} alt="zelo logo" class="h-48 w-48" /> -->
    <!-- {#key page.route.id}
        <div
            class="children dark:bg-violet-990 container m-auto bg-violet-100"
            transition:fly={{ x: 100, duration: 1000 }}
        > -->
    {@render children()}
    <!-- </div>
    {/key} -->
    <!-- in:receive={{ key: page.route.id }}
        out:send={{ key: page.route.id }} -->
</main>
<footer class="container m-auto h-64 px-1 md:px-20"></footer>

<style>
    footer {
        background: linear-gradient(var(--color-violet-100), transparent);
    }

    @media (prefers-color-scheme: dark) {
        footer {
            background: linear-gradient(var(--color-violet-990), transparent);
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
