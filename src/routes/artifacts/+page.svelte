<script lang="ts">
    import PocketBase from "pocketbase"
    import Post from "../../components/Post.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")
    const request = pb.collection<PostItem>("artifacts").getFullList(-1, {
        sort: "-created"
    })
</script>

<p class="text-center text-4xl pb-4">artifacts</p>
<div class="grid gap-4 grid-cols-7 p-10 text-xl">
    {#await request then result}
        {#each result as artifact}
            <Post {artifact}/>
        {/each}
    {/await}
</div>
