<script lang="ts">
    import { onMount } from "svelte";
    import * as publicEnv from "$env/static/public";
    import Post from "$lib/components/Post.svelte";
    import { getLiveArtifacts } from "$lib/live-content";

    const env: Record<string, string> = { ...publicEnv };
    const baseURL = "https://cdn.zelo.dev";
    let artifacts = $state<Awaited<ReturnType<typeof getLiveArtifacts>>>([]);
    let loading = $state(true);
    let failure = $state("");
    let controller: AbortController;

    async function loadArtifacts() {
        controller?.abort();
        controller = new AbortController();
        const { signal } = controller;
        loading = true;
        failure = "";
        try {
            const result = await getLiveArtifacts(
                baseURL,
                AbortSignal.any([signal, AbortSignal.timeout(30_000)])
            );
            if (!signal.aborted) artifacts = result;
        } catch {
            if (!signal.aborted) failure = "Couldn't load artifacts. Please try again.";
        } finally {
            if (!signal.aborted) loading = false;
        }
    }

    onMount(() => {
        void loadArtifacts();
        return () => controller?.abort();
    });
</script>

<noscript>Enable JavaScript to load artifacts.</noscript>
{#if loading}
    <p role="status">Loading artifacts…</p>
{:else if failure}
    <p role="alert">{failure}</p>
    <button type="button" class="underline" onclick={loadArtifacts}>Try again</button>
{:else if artifacts.length === 0}
    <p>No artifacts yet.</p>
{:else}
    <div class="grid grid-cols-7 gap-4 p-10 text-xl">
        {#each artifacts as artifact (artifact.id)}
            <Post {artifact} />
        {/each}
    </div>
{/if}
