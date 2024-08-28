<script lang="ts">
    export let news: NewsItem;

    const getNewsThumbnail = (id: string, src: string) => `https://cdn.zelo.dev/api/files/63wj7u8szd0trni/${id}/${src}`;
    const formatNewsDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>

<section class="p-2 border-b border-b-white/25">
    <div class="flex items-center justify-between py-3">
        <a class="text-2xl" href="/news/{news.id}"><h3>{news.header}</h3></a>
        <p class="italic text-right">{formatNewsDate(new Date(news.created))}</p>
    </div>
    <div class="h-36">
        <!--                                BLUR -->
        <img alt="" class="relative w-full h-36 object-cover blur-2xl brightness-50" src={getNewsThumbnail(news.id, news.header_img)}/>
<!--        TODO: News thumbnail alts -->
        <img alt="{news.header} thumbnail" class="relative bottom-36 w-full h-36 object-cover rounded ring-1 ring-white/80" src={getNewsThumbnail(news.id, news.header_img)}/>
    </div>
    <div class="max-h-24 overflow-hidden p-4">
        <div class="relative w-full h-24 bg-gradient-to-b from-transparent to-neutral-950"></div>
        <div class="relative bottom-24">
            {@html news.blurb}
        </div>
    </div>
</section>