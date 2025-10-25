<script lang="ts">
    import type { PageData } from "./$types";
    import Ware from "$lib/components/Ware.svelte";
    let { data }: { data: PageData } = $props();
    const { wares } = data;
</script>

{#snippet articleList()}
    <div class="list">
        {#each wares as ware}
            <Ware {ware} />
        {/each}
    </div>
{/snippet}

{@render articleList()}

<style>
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
