<script lang="ts">
    import github_icon from "$lib/assets/github.png";

    export let ware: WareItem;

    const href = `https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/${ware.id}/${ware.icon}?thumb=128x128`;
    const isVideo = ware.icon.endsWith(".webm");
    const date = new Date(ware.date).toLocaleDateString();
</script>

<a
    href={ware.link}
    class="ware type-{ware.type} rounded-xs backdrop-blur-xl ring-1 shadow-2xl px-0 mx-5 mb-4 flex gap-5 hover:scale-105 transition-transform"
>
    <div class="w-full flex flex-col justify-between p-5">
        <section>
            <div class="flex justify-between gap-2">
                {#if ware.type !== "future"}
                    {#if isVideo}
                        <video
                            class="w-1/6 h-1/6 rounded-xs"
                            src={href}
                            autoplay
                            muted
                            loop><track kind="captions" src="" /></video
                        >
                    {:else}
                        <img
                            class="w-1/6 h-1/6 rounded-xs"
                            src={href}
                            alt={ware.name}
                        />
                    {/if}
                {/if}
                <div class="flex grow justify-between items-center p-2">
                    <span class="font-bold text-2xl">{ware.name}</span>
                </div>
            </div>
            <div class="flex gap-2 text-xs items-center justify-between">
                {#if !ware.featured}
                    {#if ware.type !== "future"}
                        <span>{date}</span>
                    {/if}
                    {#if ware.source}
                        <!-- IDK how to fix this "warning" -->
                        <button class="cursor-pointer" onclick={() => window.open(ware.source, "_blank")}>
                            <img
                                alt="Github logo"
                                width="64"
                                height="64"
                                class="opacity-40 hover:opacity-100 w-8 h-8 transition-opacity"
                                src={github_icon}
                            />
                        </button>
                    {/if}
                {/if}
            </div>
            <p class="text-sm pt-2 max-w-2xl break-words">{ware.description}</p>
        </section>
    </div>
</a>