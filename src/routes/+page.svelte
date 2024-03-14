<script lang="ts">
    // import IndexComponent from "../components/IndexComponent.svelte";
    // import ZelosAntLite from "zelos.ant.lite";
    import PocketBase from "pocketbase";
    import Ware from "../components/Ware.svelte";

    import header from "$lib/assets/header.png"
    import Other from "../components/Other.svelte";
    import Social from "../components/Social.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")
    const waresRequest = pb.collection("wares").getFullList(-1, {
        sort: "-date",
        filter: "featured = true"
    })
    const newsRequest = pb.collection("news").getFullList(-1, {
        sort: "-created",
    })

    import github_logo from "$lib/assets/github.png"
    import discord_logo from "$lib/assets/discord.png"
    import ZelosAntLite from "zelos.ant.lite";

    const getNewsThumbnail = (id: string, src: string) => `https://cdn.zelo.dev/api/files/63wj7u8szd0trni/${id}/${src}`;
    const formatNewsDate = (date: Date) => {
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    }
    // fetch("https://api.github.com/search/commits?q=author:Zolo101 sort:author-date")
    //     .then(res => res.json())
    //     .then(json => localStorage.setItem("test", JSON.stringify(json)))

    const t = JSON.parse(localStorage.getItem("test")!)
    console.log(t.items[0])
</script>

<div class="flex max-sm:flex-col gap-8 max-w-[1000px] mt-5 px-5 mx-auto">
    <div class="sm:w-1/2">
        <h1 class="border-red-500">News</h1>
        <section class="mb-10">
<!--            TODO: News Section-->
            {#await newsRequest then res}
                <section>
                    {#each res as news}
                        <section class="p-2 border-b border-b-white/25">
                            <a href="/news/{news.id}"><h3>{news.header}</h3></a>
                            <p class="italic text-right">{formatNewsDate(new Date(news.created))}</p>
                            <div class="h-36">
<!--                                BLUR -->
                                <img class="relative w-full h-36 object-cover blur-2xl brightness-50" src={getNewsThumbnail(news.id, news.header_img)}/>
                                <img class="relative bottom-36 w-full h-36 object-cover rounded ring-1 ring-white/80" src={getNewsThumbnail(news.id, news.header_img)}/>
                            </div>
                            <div class="max-h-24 overflow-hidden p-4">
                                <div class="relative z-10 w-full h-24 bg-gradient-to-b from-transparent to-neutral-950"></div>
                                <div class="relative bottom-24">
                                    {@html news.article}
                                </div>
                            </div>
                        </section>
                    {/each}
                </section>
            {/await}
        </section>
        <h1 class="border-emerald-500 max-sm:hidden">Commits</h1>
        <div class="p-2 order-5 max-sm:hidden">
            <!--{#await commitsRequest then commits}-->
            <!--    {#each commits.items as item}-->
                {#each t.items as item}
                    {@const date = new Date(item.commit.author.date)}
                    <!-- TODO: Make this its own component -->
                    <section>
                        <div class="flex justify-between items-center pb-2">
                            <div class="flex items-start">
                                <a href={item.html_url}>
                                    <img width="32" height="32" src={github_logo}/>
                                </a>
<!--                                <p>{item.repository.name}</p>-->
<!--                                TODO: Make this the icon of the ware if found -->
                                <div class="px-2">
                                    <h2>{item.commit.message}</h2>
<!--                                    TODO: Make it say something like "2 days ago" -->
                                    <span class="text-sm opacity-75 italic">{date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}</span>
                                </div>
                            </div>
                            <a href={item.committer.html_url}>
                                <img class="opacity-50 hover:opacity-100 transition-opacity rounded" width="32" height="32" src={item.author.avatar_url}/>
                            </a>
                        </div>
                        <div class="w-full ring-1 ring-emerald-300/20 mb-2"></div>
                    </section>
                {/each}
            <!--{/await}-->
        </div>
    </div>
    <div class="flex flex-col gap-4 sm:w-1/2">
        <h1 class="border-amber-500">Projects</h1>
            {#await waresRequest then result}
                <section class="*:ring-amber-500/50">
                    {#each result as ware}
                        <Ware {ware}/>
                    {/each}
                </section>
            {/await}
        <h1 class="border-blue-500">More</h1>
        <div class="flex flex-col gap-3 *:ring-blue-600/50">
            <div class="grid grid-cols-2 gap-3 hover:*:bg-blue-600/10">
                <Other href="/wares">wares</Other>
                <Other href="/backgrounds">backgrounds</Other>
<!--                <Other href="/artifacts">artifacts</Other>-->
            </div>
            <div class="hover:*:bg-blue-600/10">
                <Other href="/qa">q&a</Other>
            </div>
        </div>
        <h1 class="border-purple-500">Socials</h1>
        <div class="flex gap-2 mb-24 *:ring-1 *:ring-purple-600/50 *:rounded *:p-2 *:transition-colors">
            <Social name="Github" href="https://github.com/Zolo101" image={github_logo}/>
            <Social name="Discord" image={discord_logo}>@zelo101</Social>
        </div>
        <h1 class="border-pink-500">Boredom Repellent</h1>
        <div class="flex justify-center">
            <ZelosAntLite/>
        </div>
    </div>
</div>

<style>
    h1 {
        @apply px-5 text-4xl font-bold italic border-b border-b-4;
    }

    h2 {
        @apply py-1;
    }

    h3 {
        @apply font-bold text-3xl px-5 py-1;
    }
</style>