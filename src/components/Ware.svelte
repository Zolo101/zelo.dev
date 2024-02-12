<script>
    export let ware;

    let href = `https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/${ware.id}/${ware.icon}`;
    let date = new Date(ware.date).toLocaleString("DE", {dateStyle: "short"})
</script>

<div class="outline outline-1 outline-white/25 shadow-md px-0 mx-5 mb-4 flex gap-5 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
    <img class="w-1/6 h-1/6" src={href} alt={ware.name}/>
    <div class="flex flex-col justify-between grow">
        <div>
            <div class="flex justify-between">
                <p class="font-bold text-3xl">{ware.name}</p>
                <p class="text-lg font-bold text-right pr-2">{date}</p>
            </div>
            <p class="pt-2 max-w-2xl break-words">{ware.description}</p>
        </div>
        <div class="flex">
            {#if ware.link}
                <a class="text-sm font-bold px-5 py-1 bg-green-500/5 hover:bg-green-500/20 transition-colors" href={ware.link}>Link</a>
            {/if}

            {#if ware.source}
                <a class="text-sm font-bold px-5 py-1 bg-blue-500/5 hover:bg-blue-500/20 transition-colors" href={ware.source}>Source</a>
            {/if}
        </div>
    </div>
</div>
