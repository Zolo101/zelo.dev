<script lang="ts">
    export let wallpaper: WallpaperItem;

    let srcOG = `https://cdn.zelo.dev/api/files/gu9lna7y2ntbryv/${wallpaper.id}/${wallpaper.media}`;
    let src = `${srcOG}?thumb=256x256`;

    let date = new Date(wallpaper.date).toLocaleString("DE", { dateStyle: "short" });
</script>

<div class="p-1 transition-colors hover:bg-black/20 dark:hover:bg-white/5">
    <p class="absolute bg-black/40 px-2">{wallpaper.name}</p>
    <a href={wallpaper.info || srcOG}
        ><img
            class:background-info={wallpaper.info}
            class="h-[256px] w-[256px] object-cover transition-transform active:scale-95"
            {src}
            alt={wallpaper.name}
        /></a
    >
    <div class="flex justify-between">
        <div class="flex flex-col">
            {#if wallpaper.madeIn.startsWith("blender")}
                <span class="font-bold text-amber-500">{wallpaper.madeIn}</span>
            {/if}
        </div>
        <div class="relative right-0 bottom-6 flex flex-col items-end">
            <span class="bg-black/60 px-2">{date === "Invalid Date" ? "xx.xx.xx" : date}</span>
            {#if wallpaper.source}
                <a class="underline" href={wallpaper.source}>Source</a>
            {/if}
        </div>
    </div>
</div>
