<script lang="ts">
    import type { PageData } from "./$types";
    import Ware from "$lib/components/Ware.svelte";
    let { data }: { data: PageData } = $props();
    const { wares } = $derived(data);
</script>

{#snippet articleList()}
    <div class="list">
        {#each wares as ware (ware.name)}
            <Ware {ware} />
        {/each}
    </div>
{/snippet}

<p class="text-2xl">
    <strong>Hi!</strong> I'm Zelo, and welcome to my site! Below are cool projects I've made that
    you can play right now! Above me, you can check out
    <a href="/whatever">projects im working on</a>
    right now, <a href="/wallpapers">free wallpapers</a>, and a <a href="/qa">Q&A</a>
    where you can ask me anything! Or, maybe you want to know more
    <a href="/about">about me...?</a>
</p>
<hr class="my-4 border-violet-300 dark:border-violet-900" />

{@render articleList()}

<style>
    a {
        transition: background-color 0.1s ease-out;
        color: white;
        background-color: var(--color-violet-400);

        padding: 0.05rem 0.2rem;

        &:hover {
            background-color: var(--color-violet-600);
        }
    }

    @media (prefers-color-scheme: dark) {
        a {
            background-color: var(--color-violet-900);

            &:hover {
                background-color: var(--color-violet-600);
            }
        }
    }

    .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 1.25rem;
        /* gap: 1.5rem; */
        justify-content: center;
    }

    @media (max-width: 1295px) {
        .list {
            gap: 1.5rem;
        }
    }

    @media (max-width: 1024px) {
        .list {
            gap: 1rem;
        }
    }
</style>
