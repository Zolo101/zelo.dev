<script lang="ts">
    import PocketBase from "pocketbase";
    import Background from "$lib/components/Background.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev");
    const backgrounds = pb.collection<BackgroundItem>("backgrounds");
</script>

<!--    <p class="text-center text-4xl pb-4">backgrounds</p>-->
<p class="text-center">
    All backgrounds are licensed as <a
        class="font-bold hover:underline text-green-500 dark:text-green-500"
        href="https://creativecommons.org/licenses/by/4.0/deed.en">CC BY 4.0</a
    >. It means you can use this for whatever but just credit me by linking the
    website.
</p>
<p class="text-center">
    You can get the full images by clicking on them. An outline means there's
    also more information about the background.
</p>
{#await backgrounds.getFullList({ sort: "-created" })}
    <p>Loading...</p>
{:then items}
    <div class="flex flex-wrap gap-4 p-2">
        {#each items as item}
            <Background background={item} />
        {/each}
    </div>
{:catch error}
    <p>{error.message}</p>
{/await}
