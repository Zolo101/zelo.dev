<script lang="ts">
    import PocketBase from "pocketbase";
    import Ware from "$lib/components/Ware.svelte";
    import { onMount } from "svelte";

    const pb = new PocketBase("https://cdn.zelo.dev");
    const request = pb.collection<WareItem>("wares").getFullList(-1, {
        sort: "-date",
    });

    const typeColours: Record<WareItem["type"], any> = {
        future: "#36cf00",
        stable: "#66d99e",
        contributed: "#999999",
        legacy: "#434343",
    }

    const boxSortWares = (wares: WareItem[]) => {
        const map: Record<WareItem["type"], WareItem[]> = {
            future: [],
            stable: [],
            contributed: [],
            legacy: [],
        };

        for (const ware of wares) {
            map[ware.type].push(ware);
        }

        return Object.entries(map);
    }
</script>

<p class="text-center text-4xl pb-4">wares</p>
<div>
    {#await request then result}
        {@const sortedResults = boxSortWares(result)}
        {#each sortedResults as [type, wares]}
            <h1 class="capitalize" style="border-color: {typeColours[type]}">{type}</h1>
            <div class="grid grid-cols-2 py-4">
                {#each wares as ware}
                    <Ware {ware}/>
                {/each}
            </div>
        {/each}
    {/await}
</div>

<style>
    h1 {
        @apply px-5 text-4xl font-bold italic border-b-4;
    }

    h2 {
        @apply py-1;
    }

    h3 {
        @apply font-bold text-3xl px-5 py-1;
    }
</style>