<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { backgrounds } = data;
</script>

{#snippet backgroundArticle(background: BackgroundItem)}
    {@const date = new Date(background.date)
        .toLocaleString("en-GB", {
            year: "2-digit",
            month: "short"
        })
        .replace(" ", " '")}
    {@const newDate = new Date(background.date).getFullYear() === new Date().getFullYear()}
    {@const srcOG = `https://cdn.zelo.dev/api/files/gu9lna7y2ntbryv/${background.id}/${background.media}`}
    {@const src = `${srcOG}?thumb=256x256`}

    <a href={srcOG}>
        <div class="article h-fit w-40 bg-white">
            <div class="outline outline-violet-500 dark:outline-violet-400" class:new={newDate}>
                <div class="flex items-stretch bg-white dark:bg-black">
                    {#if newDate}
                        <div class="flex items-center">
                            <span
                                class="rainbow h-full bg-yellow-300 px-2 font-medium tracking-widest"
                                >NEW!</span
                            >
                        </div>
                    {/if}
                    <div
                        class="flex w-full justify-between text-xs tracking-wider text-black dark:text-white"
                    >
                        <h1 class="title px-2">{background.name}</h1>
                        {#if background.date}
                            <p class="px-2">{date}</p>
                        {/if}
                    </div>
                </div>
                <img {src} alt={background.name} class="h-full w-full object-cover" />
                <p class="bg-white px-2 tracking-wide text-black dark:bg-black dark:text-white">
                    {background.info}
                </p>
            </div>
        </div>
    </a>
{/snippet}

<h1 class="m-5 text-center">
    All backgrounds are licensed as <a
        class="font-bold text-violet-500 underline hover:text-violet-400"
        href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a
    >. It means you can use this for whatever but just credit me by linking the website. Click on
    the preview to get the full image.
</h1>
<div class="flex flex-wrap gap-4">
    {#each backgrounds as b}
        {@render backgroundArticle(b)}
    {/each}
</div>

<style>
    .article {
        --shadow-size: 0.5rem;
        transition:
            box-shadow 0.2s ease-out,
            transform 0.2s ease-out;
        box-shadow: calc((var(--shadow-size) / 3) * 3) calc((var(--shadow-size) / 3) * 3)
            hsla(0, 0%, 99%, 0.1);
    }

    .article:hover {
        border-bottom: 0rem solid;
        border-right: 0rem solid;
        box-shadow: 0rem 0rem black;
        transform: translateY(0.4rem) translateX(0.4rem);
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
        animation: rainbow 1s linear infinite alternate;
    }

    .new {
        outline-color: var(--color-yellow-300);
    }
</style>
