<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { wallpapers } = $derived(data);
</script>

{#snippet wallpaperArticle(wallpaper: WallpaperItem)}
    {@const date = new Date(wallpaper.date)
        .toLocaleString("en-GB", {
            year: "2-digit",
            month: "short"
        })
        .replace(" ", " '")}
    {@const newDate = new Date(wallpaper.created).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 4}
    {@const srcOG = `https://cdn.zelo.dev/api/files/gu9lna7y2ntbryv/${wallpaper.id}/${wallpaper.media}`}
    {@const src = `${srcOG}?token=&thumb=640x360`}

    <a href={srcOG}>
        <div class="article h-fit items-stretch bg-white">
            <div class="outline outline-violet-500 dark:outline-violet-400" class:new={newDate}>
                <div class="flex items-stretch bg-white dark:bg-black">
                    {#if newDate}
                        <div class="flex items-center">
                            <span
                                class="h-full bg-yellow-300 px-2 font-medium tracking-widest text-black"
                                >NEW!</span
                            >
                        </div>
                    {/if}
                    <div
                        class="flex w-full justify-between tracking-wider text-black dark:text-white"
                    >
                        <h1 class="title px-2">{wallpaper.name}</h1>
                        <p class="px-2">{wallpaper.date ? date : "no idea"}</p>
                    </div>
                </div>
                <img {src} alt={wallpaper.name} class="h-full w-full object-cover" />
                <p class="bg-white px-2 tracking-wide text-black dark:bg-black dark:text-white">
                    {wallpaper.info}
                </p>
            </div>
        </div>
    </a>
{/snippet}

<h1 class="m-5 text-center text-2xl">
    Really it's a digital art gallery, but I use them as wallpapers. All images here are licensed
    under <a
        class="font-bold text-violet-500 underline hover:text-violet-400"
        href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a
    >. So you can use this for whatever but just give credit by linking my website.
</h1>
<h2 class="m-5 text-center text-xl">Click on the preview to get the full image.</h2>
<div class="list text-xl">
    {#each wallpapers as b (b.name)}
        {@render wallpaperArticle(b)}
    {/each}
</div>

<style>
    .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 1.25rem;
        /* gap: 1.5rem; */
        justify-content: center;
    }

    @media (max-width: 1295px) {
        .list {
            gap: 1.5rem;
        }
    }

    @media (max-width: 1024px) {
        .list {
            gap: 1rem;
        }
    }

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
