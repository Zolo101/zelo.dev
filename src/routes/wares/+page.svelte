<script>
    import Boilerplate from "../../components/Boilerplate.svelte";
    import PocketBase from "pocketbase";
    import Ware from "../../components/Ware.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")
    const request = pb.collection("wares").getFullList()
</script>

<Boilerplate>
    <p class="text-center text-4xl pb-4">wares</p>
    {#await request then result}
        {@const _ = result.sort((a, b) => new Date(b.date) - new Date(a.date))}
        {#each result as ware}
            <Ware {ware}/>
        {/each}
    {/await}
    <br>
</Boilerplate>