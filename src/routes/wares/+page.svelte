<script lang="ts">
    import PocketBase from "pocketbase";
    import Ware from "../../components/Ware.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")
    const request = pb.collection<WareItem>("wares").getFullList(-1, {
        sort: "-date"
    })
</script>

<p class="text-center text-4xl pb-4">wares</p>
<div class="flex flex-col">
    {#await request then result}
        {#each result as ware}
            <Ware {ware}/>
        {/each}
    {/await}
</div>
<br>
