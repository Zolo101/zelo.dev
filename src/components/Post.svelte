<script lang="ts">
    export let artifact: PostItem

    let title = new Date(artifact.created).toLocaleString("DE", {dateStyle: "short"})
    let href = artifact.media
        ? `https://cdn.zelo.dev/api/files/culgp15ck7df4db/${artifact.id}/${artifact.media}`
        : artifact.link;

    let notice = artifact.alt ? "(?)" : "";
</script>

<div>
    <a target="_blank" href={href}>
        <span>{title}</span>
        {#if artifact.alt}
            <span class="text-cyan-800 dark:text-cyan-500" title={artifact.alt}>{notice}</span>
        {/if}
    </a>

    <!--{#if note}-->
    <!--    <span class="underline text-cyan-800 dark:text-cyan-500" title={note}>{notice}</span>-->
    <!--{/if}-->
</div>
