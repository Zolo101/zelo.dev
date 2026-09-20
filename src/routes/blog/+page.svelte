<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { news } = data;
</script>

{#if news.length === 0}
    <p>No blog posts yet. Check back later!</p>
{:else}
    <ul class="space-y-4">
        {#each news as post}
            <li>
                <a href={`/blog/${post.id}`} class="text-2xl text-blue-400 hover:underline">
                    {post.header}
                </a>
                <p class="text-sm text-gray-400">{post.created}</p>
                <p>{post.blurb}</p>
            </li>
        {/each}
    </ul>
{/if}
