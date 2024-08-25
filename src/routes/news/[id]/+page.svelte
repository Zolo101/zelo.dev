<script lang="ts">
    import PocketBase from "pocketbase";
    import { page } from "$app/stores";

    const pb = new PocketBase("https://cdn.zelo.dev");
    const newsRequest = pb.collection("news").getOne($page.params.id);

    const getNewsThumbnail = (id: string, src: string) =>
        `https://cdn.zelo.dev/api/files/63wj7u8szd0trni/${id}/${src}`;
    const formatNewsDate = (date: Date) => {
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getCorkboardLink = () => {};
    const getMastodonLink = () => {};
    const copyLink = () => {};
</script>

<!-- TODO: Figure out how to create a seperate layout page for /news -->
<section class="px-5 mt-2">
    {#await newsRequest then news}
        <h1>{news.header}</h1>
        <p>by Zelo on <span>{formatNewsDate(new Date(news.created))}</span></p>
        <div class="h-96 my-10">
            <!--                                BLUR -->
            <img
                alt=""
                class="relative w-full h-96 object-contain blur-2xl brightness-50"
                src={getNewsThumbnail(news.id, news.header_img)}
            />
            <!--        TODO: News thumbnail alts -->
            <img
                alt="{news.header} thumbnail"
                class="relative bottom-96 w-full h-96 object-contain rounded ring-1 ring-white/25"
                src={getNewsThumbnail(news.id, news.header_img)}
            />
        </div>
        <!--        <section class="flex gap-2 justify-center w-full font-bold text-blue-100 backdrop-blur-xl bg-blue-950/20 ring-1 ring-blue-950 rounded p-3 mb-5">-->
        <!--            <span class="text-xl">Share the news!</span>-->
        <!--            <div class="flex gap-2">-->
        <!--                <button>Corkboard</button>-->
        <!--                <button>Mastodon</button>-->
        <!--                <button>Copy Link</button>-->
        <!--            </div>-->
        <!--        </section>-->
        <div class="text-xl" id="article">
            {@html news.article}
        </div>
    {/await}
</section>
<footer class="text-2xl">
    <a href="../">Go back</a>
</footer>

<style>
    h1 {
        @apply text-4xl font-bold;
    }

    :global(#article a) {
        @apply text-blue-500 underline transition-colors;
    }

    :global(#article a:hover) {
        @apply text-teal-400;
    }

    a {
        @apply text-blue-400 italic;
    }

    button {
        @apply px-5 ring-1 rounded transition-all;
    }

    button:hover {
        @apply ring-blue-500 bg-blue-900/40;
    }
</style>
