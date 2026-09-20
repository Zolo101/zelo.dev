<script module lang="ts">
    import type { Picture } from "@sveltejs/enhanced-img";

    // The sync step downloads these before Vite starts. Only optimize previews;
    // full-resolution downloads and animated images keep their original files.
    const previews = import.meta.glob<Picture>(
        "/static/media/pocketbase/thumbnails/**/*.{avif,jpeg,jpg,png,webp}",
        { eager: true, query: "?enhanced&w=320;640", import: "default" }
    );
</script>

<script lang="ts">
    import type { HTMLImgAttributes } from "svelte/elements";

    let { src, alt, ...attributes }: HTMLImgAttributes & { src: string; alt: string } = $props();
    const image = $derived(previews[`/static${src}`]);
</script>

{#if image}
    <enhanced:img src={image} {alt} loading="lazy" decoding="async" {...attributes} />
{:else}
    <img {src} {alt} loading="lazy" decoding="async" {...attributes} />
{/if}
