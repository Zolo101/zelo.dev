<script lang="ts">
    import Ware from "$lib/components/Ware.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { inprogress, whatevers } = $derived(data);
</script>

<p class="text-2xl">Here are the projects I'm working on! Click for more details</p>
<hr class="my-4 border-violet-300 dark:border-violet-900" />
<div class="list">
    {#each inprogress as ware (ware.name)}
        <Ware {ware} />
    {/each}
</div>
<hr class="my-4 border-violet-300 dark:border-violet-900" />
<p class="text-2xl">
    The whatevers... projects that aren't all that / unfinished and no longer being worked on.
</p>
<hr class="my-4 border-violet-300 dark:border-violet-900" />
<div class="list">
    {#each whatevers as ware (ware.name)}
        <Ware {ware} />
    {/each}
</div>

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
