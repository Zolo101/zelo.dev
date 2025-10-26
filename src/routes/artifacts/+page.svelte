<script lang="ts">
    import Post from "$lib/components/Post.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { result } = data;
</script>

<div class="grid grid-cols-7 gap-4 p-10 text-xl">
    {#each result as artifact}
        <Post {artifact} />
    {/each}
</div>
