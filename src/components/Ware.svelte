<script lang="ts">
    import github_icon from "$lib/assets/github.png"

    export let ware: WareItem;

    const href = `https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/${ware.id}/${ware.icon}?thumb=128x128`;
    const isVideo = ware.icon.endsWith(".webm");
</script>


<a href={ware.link} class="rounded backdrop-blur-xl ring-1 bg-amber-500/5 shadow-2xl px-0 mx-5 mb-4 flex gap-5 hover:bg-amber-500/10 transition-colors">
<!--    <img class="absolute w-full h-full blur-2xl -z-10" src={href} alt={ware.name}/>-->
    <div class="w-full flex flex-col justify-between p-5">
        <section>
            <div class="flex justify-between gap-2">
                {#if isVideo}
                    <video class="w-1/6 h-1/6 rounded" src={href} autoplay muted loop><track kind="captions" src=""/></video>
                {:else}
                    <img class="w-1/6 h-1/6 rounded" src={href} alt={ware.name}/>
                {/if}
                <div class="flex grow justify-between items-center p-2">
                    <span class="font-bold text-2xl">{ware.name}</span>
                    {#if ware.source}
                        <a href={ware.source}>
                            <img width="64" height="64" class="opacity-40 hover:opacity-100 px-5 py-1.5 transition-opacity min-w-16" src={github_icon}/>
                        </a>
                    {/if}
                </div>
            </div>
            <p class="text-sm pt-2 max-w-2xl break-words">{ware.description}</p>
        </section>
    </div>
</a>
