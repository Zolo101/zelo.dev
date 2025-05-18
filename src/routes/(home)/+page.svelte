<script lang="ts">
    import Ware from "$lib/components/Ware.svelte";
    import Other from "$lib/components/Other.svelte";
    import Social from "$lib/components/Social.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    const { wares, news, commits } = data;

    import github_logo from "$lib/assets/github.png";
    import discord_logo from "$lib/assets/discord.png";
    // import ZelosAntLite from "zelos.ant.lite";
    import News from "$lib/components/News.svelte";
    import Commit from "$lib/components/Commit.svelte";

    // TODO: Temporary until I can automate this on a server that updates the database
    // fetch("https://api.github.com/search/commits?q=author:Zolo101 sort:author-date")
    //     .then(res => res.json())
    //     .then(json => console.log(json))
</script>

<div class="mx-auto mt-5 flex max-w-full gap-8 px-5 max-sm:flex-col">
    <div class="sm:w-1/2">
        <h1 class="border-red-500">News</h1>
        <section class="mb-10">
            {#if news.length === 0}
                <h2 class="text-center opacity-50">No news yet!</h2>
            {:else}
                <section>
                    {#each news as newsArticle}
                        <News news={newsArticle} />
                    {/each}
                </section>
            {/if}
        </section>
        <h1 class="border-emerald-500 max-sm:hidden">Commits</h1>
        <div class="order-5 p-2 max-sm:hidden">
            {#each commits.data.items as item}
                <Commit {item} />
            {/each}
        </div>
    </div>
    <div class="flex flex-col gap-4 sm:w-1/2">
        <h1 class="border-amber-500">Projects</h1>
        <section class="*:ring-amber-500/50!">
            {#each wares as ware}
                <Ware {ware} />
            {/each}
        </section>
        <h1 class="border-blue-500">More</h1>
        <div class="flex flex-col gap-3">
            <div class="grid grid-cols-2 gap-3 *:hover:bg-blue-600/10">
                <Other href="/wares">wares</Other>
                <Other href="/backgrounds">backgrounds</Other>
                <!--                <Other href="/artifacts">artifacts</Other>-->
            </div>
            <div class="*:hover:bg-blue-600/10">
                <Other href="/qa">q&a</Other>
            </div>
        </div>
        <h1 class="border-purple-500">Socials</h1>
        <div
            class="mb-24 flex gap-2 *:rounded-xs *:p-2 *:ring *:ring-purple-600/50 *:transition-colors"
        >
            <Social name="Github" href="https://github.com/Zolo101" image={github_logo} />
            <Social name="Discord" image={discord_logo}>@zelo101</Social>
        </div>
        <!-- <h1 class="border-pink-500">Boredom Repellent</h1>
        <div class="flex justify-center">
           <ZelosAntLite/>
        </div> -->
    </div>
</div>
