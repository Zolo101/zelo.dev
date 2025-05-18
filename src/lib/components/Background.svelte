<script lang="ts">
    export let background: BackgroundItem;

    let srcOG = `https://cdn.zelo.dev/api/files/gu9lna7y2ntbryv/${background.id}/${background.media}`;
    let src = `${srcOG}?thumb=256x256`;

    let date = new Date(background.date).toLocaleString("DE", { dateStyle: "short" });
</script>

<div class="p-1 transition-colors hover:bg-black/20 dark:hover:bg-white/5">
    <p class="absolute bg-black/40 px-2">{background.name}</p>
    <a href={background.info || srcOG}
        ><img
            class:background-info={background.info}
            class="h-[256px] w-[256px] object-cover transition-transform active:scale-95"
            {src}
            alt={background.name}
        /></a
    >
    <div class="flex justify-between">
        <div class="flex flex-col">
            {#if background.madeIn.startsWith("blender")}
                <span class="font-bold text-amber-500">{background.madeIn}</span>
            {/if}
        </div>
        <div class="relative right-0 bottom-6 flex flex-col items-end">
            <span class="bg-black/60 px-2">{date === "Invalid Date" ? "xx.xx.xx" : date}</span>
            {#if background.source}
                <a class="underline" href={background.source}>Source</a>
            {/if}
        </div>
    </div>
</div>
