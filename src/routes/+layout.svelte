<script lang="ts">
    import "../app.css";
    import type { LayoutProps } from "./$types";
    import favicon from "$lib/assets/favicon.png";
    import footerImage from "$lib/assets/zelodev_footer.png";
    import Logo from "$lib/assets/zelo_logo.svelte";
    import github from "$lib/assets/logos/github.svg";
    import bluesky from "$lib/assets/logos/bluesky.svg";
    import { onNavigate } from "$app/navigation";
    let { data, children }: LayoutProps = $props();

    // view transition
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

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>zelo.dev</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="Zelo101" />
    <meta name="description" content="Zelo101's projects, Q&A and more!" />
    <script
        defer
        src="https://analytics.zelo.dev/script.js"
        data-website-id="2709cca4-26c3-43bc-84a1-5b33684bf4a1"
    ></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
        rel="stylesheet"
    />
</svelte:head>

{#snippet pages()}
    <div class="pages flex gap-10 text-violet-500 max-xl:text-2xl max-lg:flex-wrap">
        <a href="/">wares</a>
        <a href="/wips">whatevers</a>
        <a href="/wallpapers">wallpapers</a>
        <a href="/qa">q&a</a>
        <a href="/about">about me</a>
        <!-- <a href="/blog">blog</a> -->
        <!-- <a href="/branding">branding</a> -->
        <!-- <a class="corkboard" href="https://corkboard.zelo.dev/">corkboard</a> -->
    </div>
{/snippet}

<div class="page-shell">
    <main class="dark:bg-violet-990 container m-auto bg-violet-100 max-lg:px-5 lg:px-20 lg:py-5">
        <!-- Header -->
        <nav class="flex items-center gap-2 p-2 text-4xl max-lg:flex-col lg:items-end lg:gap-10">
            <Logo width={192} height={80} textFill="#ede9fe" backgroundFill="#7B00FF" />
            <div class="flex w-full max-lg:justify-center max-md:hidden">
                {@render pages()}
            </div>
        </nav>
        <hr class="mt-2 mb-4 border-violet-300 dark:border-violet-900" />
        {@render children()}
    </main>
    <footer class="container m-auto">
        <img src={footerImage} alt="" class="footer-image" />
    </footer>
</div>

<style>
    /* nav {
        position: sticky;
        top: -50px;
        z-index: 10;
        animation: squash-desktop-nav 0.5s linear both;
        animation-timeline: scroll();
        animation-range: 8px 90px;
    } */

    .page-shell {
        display: flex;
        min-height: 100svh;
        flex-direction: column;
    }

    main {
        flex: 1 0 auto;
        width: 100%;
    }

    footer {
        display: flex;
        flex-shrink: 0;
        align-items: end;
        justify-content: center;
        width: 100%;
        min-height: 28.75rem;
        background: linear-gradient(in oklab, var(--color-violet-100) 50px, white 60%);
    }

    .footer-image {
        width: 100%;
        height: auto;
        object-fit: contain;
    }

    @media (prefers-color-scheme: light) {
        .footer-image {
            filter: invert() hue-rotate(170deg);
        }
    }

    @media (prefers-color-scheme: dark) {
        footer {
            background: linear-gradient(in oklab, var(--color-violet-990) 50px, black 60%);
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
            min-height: 9rem;
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
