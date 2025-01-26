<script lang="ts">
    import Post from "$lib/components/Post.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const {result} = data;
</script>

<p class="text-center text-4xl pb-4">artifacts</p>
<div class="grid gap-4 grid-cols-7 p-10 text-xl">
    {#each result as artifact}
        <Post {artifact} />
    {/each}
</div>
