<script lang="ts">
    import github_icon from "$lib/assets/github.png";

    export let ware: WareItem;

    const href = `https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/${ware.id}/${ware.icon}?thumb=128x128`;
    const isVideo = ware.icon.endsWith(".webm");
    const date = new Date(ware.date).toLocaleDateString();
</script>

<a
    href={ware.link}
    class="ware type-{ware.type} mx-5 mb-4 flex gap-5 rounded-xs px-0 ring-1 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105"
>
    <div class="flex w-full flex-col justify-between p-5">
        <section>
            <div class="flex justify-between gap-2">
                {#if ware.type !== "future"}
                    {#if isVideo}
                        <video class="h-1/6 w-1/6 rounded-xs" src={href} autoplay muted loop
                            ><track kind="captions" src="" /></video
                        >
                    {:else}
                        <img class="h-1/6 w-1/6 rounded-xs" src={href} alt={ware.name} />
                    {/if}
                {/if}
                <div class="flex grow items-center justify-between p-2">
                    <span class="text-2xl font-bold">{ware.name}</span>
                </div>
            </div>
            <div class="flex items-center justify-between gap-2 text-xs">
                {#if !ware.featured}
                    {#if ware.type !== "future"}
                        <span>{date}</span>
                    {/if}
                    {#if ware.source}
                        <!-- IDK how to fix this "warning" -->
                        <button
                            class="cursor-pointer"
                            onclick={() => window.open(ware.source, "_blank")}
                        >
                            <img
                                alt="Github logo"
                                width="64"
                                height="64"
                                class="h-8 w-8 opacity-40 transition-opacity hover:opacity-100"
                                src={github_icon}
                            />
                        </button>
                    {/if}
                {/if}
            </div>
            <p class="max-w-2xl pt-2 text-sm break-words">{ware.description}</p>
        </section>
    </div>
</a>
