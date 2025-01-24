<script lang="ts">
    export let artifact: PostItem

    let title = new Date(artifact.created).toLocaleString("DE", {dateStyle: "short"})
    let href = artifact.media
        ? `https://cdn.zelo.dev/api/files/culgp15ck7df4db/${artifact.id}/${artifact.media}`
        : artifact.link;

    let notice = artifact.alt ? "(?)" : "";

    let type = "unknown";
    if (artifact.media.endsWith(".png") || artifact.media.endsWith(".jpg") || artifact.media.endsWith(".webp")) {
        type = "image";
    } else if (artifact.media.endsWith(".webm") || artifact.media.endsWith(".mp4")) {
        type = "video";
    } else if (artifact.media.endsWith(".gif")) {
        type = "animation";
    } else if (artifact.link) {
        type = "link";
    }
</script>

<div>
    <a target="_blank" href={href}>
        <span class="type-{type}">{title}</span>
        {#if artifact.alt}
            <span class="text-cyan-800 dark:text-cyan-500" title={artifact.alt}>{notice}</span>
        {/if}
    </a>

    <!--{#if note}-->
    <!--    <span class="underline text-cyan-800 dark:text-cyan-500" title={note}>{notice}</span>-->
    <!--{/if}-->
</div>