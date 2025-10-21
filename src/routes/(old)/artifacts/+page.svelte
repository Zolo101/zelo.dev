<script lang="ts">
    import Post from "$lib/components/Post.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { result } = data;
</script>

<p class="pb-4 text-center text-4xl">artifacts</p>
<div class="grid grid-cols-7 gap-4 p-10 text-xl">
    {#each result as artifact}
        <Post {artifact} />
    {/each}
</div>
