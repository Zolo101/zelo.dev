<script lang="ts">
    export let news: NewsItem;

    const getNewsThumbnail = `https://cdn.zelo.dev/api/files/63wj7u8szd0trni/${news.id}/${news.header_img}`;
    const isVideo = news.header_img.endsWith(".webm");
    const formatNewsDate = (date: Date) => {
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
</script>

<section class="border-b border-b-white/25 p-2">
    <div class="flex items-center justify-between py-3">
        <a class="text-2xl" href="/news/{news.id}"><h3>{news.header}</h3></a>
        <p class="text-right italic">{formatNewsDate(new Date(news.created))}</p>
    </div>
    <div class="h-36">
        <!--                                BLUR -->
        <!--        TODO: Image&Video Component-->
        {#if isVideo}
            <video
                class="relative h-36 w-full blur-2xl brightness-50"
                src={getNewsThumbnail}
                autoplay
                muted
                loop><track kind="captions" src="" /></video
            >
        {:else}
            <img
                alt=""
                class="relative h-36 w-full object-cover blur-2xl brightness-50"
                src={getNewsThumbnail}
            />
        {/if}
        <!--        <img alt="" class="relative w-full h-36 object-cover blur-2xl brightness-50" src={getNewsThumbnail}/>-->
        <!--        TODO: News thumbnail alts -->
        {#if isVideo}
            <video
                class="relative bottom-36 h-36 w-full rounded-xs bg-black ring-1 ring-white/10"
                src={getNewsThumbnail}
                autoplay
                muted
                loop><track kind="captions" src="" /></video
            >
        {:else}
            <img
                alt="{news.header} thumbnail"
                class="relative bottom-36 h-36 w-full rounded-xs object-cover ring-1 ring-white/10"
                src={getNewsThumbnail}
            />
        {/if}
        <!--        <img alt="{news.header} thumbnail" class="relative bottom-36 w-full h-36 object-cover rounded-xs ring-1 ring-white/80" src={getNewsThumbnail}/>-->
    </div>
    <div class="max-h-24 overflow-hidden p-4">
        <div class="relative h-24 w-full bg-linear-to-b from-transparent to-neutral-950"></div>
        <div class="relative bottom-24">
            {@html news.blurb}
        </div>
    </div>
</section>
