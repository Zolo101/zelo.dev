<script lang="ts">
    export let background: BackgroundItem;

    let srcOG = `https://cdn.zelo.dev/api/files/gu9lna7y2ntbryv/${background.id}/${background.media}`;
    let src = `${srcOG}?thumb=256x256`;

    let date = new Date(background.date).toLocaleString("DE", {dateStyle: "short"})
    console.log(background)
</script>

<div class="hover:bg-black/20 dark:hover:bg-white/5 p-1 transition-colors">
    <p class="absolute px-2 bg-black/40">{background.name}</p>
        <a href={background.info || srcOG}><img class:info={background.info} class="w-[256px] h-[256px] object-cover" {src} alt={background.name}/></a>
    <div class="flex justify-between">
        <div class="flex flex-col">
            {#if background.madeIn.startsWith("blender")}
                <span class="font-bold text-amber-500">{background.madeIn}</span>
            {/if}
        </div>
        <div class="flex flex-col items-end relative bottom-6 right-0">
            <span class="bg-black/60 px-2">{date === "Invalid Date" ? "xx.xx.xx" : date}</span>
            {#if background.source}
                <a class="underline" href={background.source}>Source</a>
            {/if}
        </div>
    </div>
</div>

<style>
    .info {
        @apply outline outline-green-400;
    }

    img {
        @apply transition-transform;
    }

    img:active {
        @apply scale-95;
    }
</style>