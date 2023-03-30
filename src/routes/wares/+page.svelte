<script>
    import Boilerplate from "../../components/Boilerplate.svelte";
    import PocketBase from "pocketbase";
    import Ware from "../../components/Ware.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")
    const request = pb.collection("wares").getFullList(-1, {
        sort: "-date"
    })
</script>

<Boilerplate>
    <p class="text-center text-4xl pb-4">wares</p>
    {#await request then result}
        {#each result as ware}
            <Ware {ware}/>
        {/each}
    {/await}
    <br>
</Boilerplate>