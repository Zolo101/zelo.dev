<script>
    export let ware;

    let href = `https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/${ware.id}/${ware.icon}`;
    let date = new Date(ware.date).toLocaleString("DE", {dateStyle: "short"})
</script>

<div class="outline outline-1 shadow-md p-2 mb-4 cursor-pointer flex gap-5 hover:bg-gray-100" on:click={() => window.open(ware.link, "_blank")}>
    <img class="w-1/6 h-1/6" src={href}/>
    <div class="grow">
        <div class="flex justify-between">
            <p class="font-bold text-3xl">{ware.name}</p>
            <p class="text-lg text-right">{date}</p>
        </div>
        <p class="pt-2 max-w-2xl break-words">{ware.description}</p>
    </div>
</div>
