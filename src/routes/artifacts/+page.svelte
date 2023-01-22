<script>
    import PocketBase from "pocketbase"
    import Post from "../../components/Post.svelte";
    import Boilerplate from "../../components/Boilerplate.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")
    const request = pb.collection("artifacts").getFullList()
</script>

<Boilerplate>
    <p class="text-center text-4xl pb-4">artifacts</p>
    <div class="grid gap-4 grid-cols-7 p-10 text-xl">
        {#await request then result}
            {@const _ = result.sort((a, b) => new Date(b.created) - new Date(a.created))}
            {#each result as artifact}
                <Post {artifact}/>
            {/each}
        {/await}
    </div>
</Boilerplate>
