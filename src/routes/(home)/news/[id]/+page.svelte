<script lang="ts">
    import PocketBase from "pocketbase";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { article: news } = data;

    const getNewsThumbnail = `https://cdn.zelo.dev/api/files/63wj7u8szd0trni/${news.id}/${news.header_img}`;
    const isVideo = news.header_img.endsWith(".webm");

    const formatNewsDate = (date: Date) => {
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getCorkboardLink = () => {};
    const getMastodonLink = () => {};
    const copyLink = () => {};
</script>

<!-- TODO: Figure out how to create a seperate layout page for /news -->
<section class="mt-2 px-5">
    <h1>{news.header}</h1>
    <p>by Zelo on <span>{formatNewsDate(new Date(news.created))}</span></p>
    <div class="my-10 h-96">
        <!--                                BLUR -->
        {#if isVideo}
            <video
                class="relative h-96 w-full object-contain blur-2xl brightness-200"
                src={getNewsThumbnail}
                autoplay
                muted
                loop><track kind="captions" src="" /></video
            >
        {:else}
            <img
                alt=""
                class="relative h-96 w-full object-contain blur-2xl brightness-50"
                src={getNewsThumbnail}
            />
        {/if}
        <!--            <img-->
        <!--                alt=""-->
        <!--                class="relative w-full h-96 object-contain blur-2xl brightness-50"-->
        <!--                src={getNewsThumbnail(news.id, news.header_img)}-->
        <!--            />-->
        <!--        TODO: News thumbnail alts -->
        {#if isVideo}
            <video
                class="relative bottom-96 h-96 w-full rounded-xs bg-black object-contain ring-1 ring-white/10"
                src={getNewsThumbnail}
                autoplay
                muted
                loop><track kind="captions" src="" /></video
            >
        {:else}
            <img
                alt=""
                class="relative bottom-96 h-96 w-full rounded-xs object-contain ring-1 ring-white/10"
                src={getNewsThumbnail}
            />
        {/if}
        <!--            <img-->
        <!--                alt="{news.header} thumbnail"-->
        <!--                class="relative bottom-96 w-full h-96 object-contain rounded-xs ring-1 ring-white/25"-->
        <!--                src={getNewsThumbnail(news.id, news.header_img)}-->
        <!--            />-->
    </div>
    <!--        <section class="flex gap-2 justify-center w-full font-bold text-blue-100 backdrop-blur-xl bg-blue-950/20 ring-1 ring-blue-950 rounded-xs p-3 mb-5">-->
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
</section>
<footer class="text-2xl">
    <a class="text-blue-400 italic" href="../">Go back</a>
</footer>
