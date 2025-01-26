<script lang="ts">
    import Background from "$lib/components/Background.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const {backgrounds} = data;
</script>

<p class="text-center">
    All backgrounds are licensed as <a
        class="font-bold hover:underline text-green-500 dark:text-green-500"
        href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a
    >. It means you can use this for whatever but just credit me by linking the
    website. Click on the preview to get the full image.
</p>
<br>
<div class="flex flex-wrap gap-4 p-2">
    {#each backgrounds as background}
        <Background {background} />
    {/each}
</div>