<script lang="ts">
    import type { PageProps } from "./$types";
    import noteIcon from "$lib/assets/zeal/note.png?enhanced";
    import articleIcon from "$lib/assets/zeal/article.png?enhanced";
    import imageIcon from "$lib/assets/zeal/image.png?enhanced";
    import newsIcon from "$lib/assets/zeal/news.png?enhanced";

    let { data }: PageProps = $props();
    const { zeals } = $derived(data);

    function formatDate(date: string) {
        return new Date(date)
            .toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            })
            .replace(", ", " ");
    }

    const latestZeal = $derived(zeals[0]);
    const icons = {
        note: noteIcon,
        article: articleIcon,
        image: imageIcon,
        news: newsIcon
    };
</script>

<div class="flex bg-white p-2 text-4xl text-black">
    <!-- <span class="font-black">ZEAL ARCHIVES</span> -->
    <span class="font-black">make this an image</span>
    <span class="ml-auto">{formatDate(latestZeal?.created)}</span>
</div>

{#each zeals as zeal, i (zeal.id)}
    <div class="mb-5 bg-white/10 p-5">
        <div class="flex gap-2">
            <enhanced:img class="size-6" src={icons[zeal.type]} alt={zeal.type} />
            <!-- <p class="text-xl font-bold">{zeal.type}</p> -->
            {#if i}
                <p class="ml-auto text-xl font-bold">{formatDate(zeal.created)}</p>
            {/if}
        </div>
        <div>
            {@html zeal.content}
        </div>
    </div>
{/each}
