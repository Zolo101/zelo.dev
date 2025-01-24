<script lang="ts">
    import PocketBase from "pocketbase";
    import Ware from "$lib/components/Ware.svelte";
    import { onMount } from "svelte";

    let { data }: PageProps = $props();
    const {wares} = data;

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
    {#each boxSortWares(wares) as [type, wares]}
        <h1 class="capitalize" style="border-color: {typeColours[type]}">{type}</h1>
        <div class="grid grid-cols-2 py-4">
            {#each wares as ware}
                <Ware {ware}/>
            {/each}
        </div>
    {/each}
</div>