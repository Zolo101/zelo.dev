<script lang="ts">
    import SnapshotImage from "$lib/components/SnapshotImage.svelte";
    export let wallpaper: WallpaperItem;

    let srcOG = wallpaper.media;
    let src = wallpaper.mediaSquareThumbnail;

    let date = new Date(wallpaper.date).toLocaleString("DE", { dateStyle: "short" });
</script>

<div class="p-1 transition-colors hover:bg-black/20 dark:hover:bg-white/5">
    <p class="absolute bg-black/40 px-2">{wallpaper.name}</p>
    <a
        href={wallpaper.info || srcOG}
        aria-label={wallpaper.name}
        target="_blank"
        rel="noopener noreferrer"
        ><SnapshotImage
            class={`h-[256px] w-[256px] object-cover transition-transform active:scale-95 ${wallpaper.info ? "background-info" : ""}`}
            sizes="256px"
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
