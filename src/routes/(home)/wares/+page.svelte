<script lang="ts">
    import Ware from "$lib/components/Ware.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { wares } = data;

    const typeColours: Record<WareItem["type"], any> = {
        future: "#36cf00",
        stable: "#66d99e",
        contributed: "#999999",
        legacy: "#434343"
    };

    const boxSortWares = (wares: WareItem[]) => {
        const map: Record<WareItem["type"], WareItem[]> = {
            future: [],
            stable: [],
            contributed: [],
            legacy: []
        };

        for (const ware of wares) {
            map[ware.type].push(ware);
        }

        return Object.entries(map);
    };
</script>

<p class="pb-4 text-center text-4xl">wares</p>
<div>
    {#each boxSortWares(wares) as [type, waresItself]}
        <h1 class="capitalize" style="border-color: {typeColours[type]}">{type}</h1>
        <div class="grid grid-cols-2 py-4">
            {#each waresItself as ware}
                <Ware {ware} />
            {/each}
        </div>
    {/each}
</div>
