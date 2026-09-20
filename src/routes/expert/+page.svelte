<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const { artifacts } = $derived(data);

    function getTitle(date: string) {
        return new Date(date).toLocaleString("DE", { dateStyle: "short" });
    }
</script>

{#snippet artifact(artifact: PostItem)}
    {@const title = getTitle(artifact.created)}
    {@const href = artifact.media
        ? artifact.media
        : artifact.link}
    <a target="_blank" href={href}>
        <span class="artifact">{title}</span>
        {#if artifact.alt}
            <span class="alt" title={artifact.alt}>?</span>
        {/if}
        <!-- <span>{getTitle(artifact.created)}</span>
        <span>{getTitle(artifact.updated)}</span> -->
    </a>
{/snippet}

<section>
    <div>
        <a href="/about">me</a>
        <span>Legend</span>
        <ul>
            <li class="artifact"></li>
            <li class="note"></li>
            <li class="ware"></li>
            <li class="social"></li>
            <li class="blog"></li>
            <li class="reality"></li>
        </ul>
        <!-- <a href="/artifacts">artifacts</a> -->
    </div>
    <div>
        <span style="opacity: 0.1;">dd/mm/yy</span>
        {#each artifacts as a}
            {@render artifact(a)}
        {/each}
    </div>
    <div class="display">
    </div>
</section>

<style>
    section {
        display: flex;
        gap: 2rem;
        width: 100%;
    }

    div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    a {
        color: var(--color-violet-500);
        
        &:hover {
            color: var(--color-violet-100);
        }

        &::before {
            content: "-> ";
            color: var(--color-violet-300);
        }
    }

    :global(main) {
        background: light-dark(var(--color-stone-50), var(--color-stone-950));
    }

    :global(footer) {
        display: none;
    }
    
    :global(nav rect) {
        fill: none;
    }

    .display {
        flex-grow: 1;
    }

    .alt {
        color: var(--color-red-500);

        &::before {
            content: "(";
        }

        &::after {
            content: ")";
        }

        &:hover {
            /* color: var(--color-red-300); */
            text-decoration: underline;
        }
    }

    .artifact::before {
        content: "artifact ";
        color: var(--color-violet-500);
    }

    .note::before {
        content: "note ";
        color: var(--color-stone-300);
    }

    .ware::before {
        content: "ware ";
        color: var(--color-pink-400);
    }

    .social::before {
        content: "social media ";
        color: var(--color-cyan-400);
    }

    .blog::before {
        content: "blog ";
        color: var(--color-amber-400);
    }

    .reality::before {
        content: "reality ";
        color: var(--color-neutral-700);
    }
</style>