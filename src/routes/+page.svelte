<script lang="ts">
    import PocketBase from "pocketbase";
    import Ware from "../components/Ware.svelte";

    import Other from "../components/Other.svelte";
    import Social from "../components/Social.svelte";

    const pb = new PocketBase("https://cdn.zelo.dev");
    const waresRequest = pb.collection("wares").getFullList(-1, {
        sort: "-date",
        filter: "featured = true",
    });
    const newsRequest = pb.collection("news").getFullList(-1, {
        sort: "-created",
    });
    const commitsRequest = pb.collection("json").getOne("sg7392pvrr7jxi9");

    import github_logo from "$lib/assets/github.png";
    import discord_logo from "$lib/assets/discord.png";
    // import ZelosAntLite from "zelos.ant.lite";
    import News from "../components/News.svelte";
    import Commit from "../components/Commit.svelte";

    // TODO: Temporary until I can automate this on a server that updates the database
    // fetch("https://api.github.com/search/commits?q=author:Zolo101 sort:author-date")
    //     .then(res => res.json())
    //     .then(json => console.log(json))
</script>

<div class="flex max-sm:flex-col gap-8 max-w-full mt-5 px-5 mx-auto">
    <div class="sm:w-1/2">
        <h1 class="border-red-500">News</h1>
        <section class="mb-10">
            <!--            TODO: News Section-->
            {#await newsRequest then res}
                {#if res.length === 0}
                    <h2 class="text-center opacity-50">No news yet!</h2>
                {:else}
                    <section>
                        {#each res as news}
                            <News {news} />
                        {/each}
                    </section>
                {/if}
            {/await}
        </section>
        <h1 class="border-emerald-500 max-sm:hidden">Commits</h1>
        <div class="p-2 order-5 max-sm:hidden">
            {#await commitsRequest then commits}
                {#each commits.data.items as item}
                    <Commit {item} />
                {/each}
            {/await}
        </div>
    </div>
    <div class="flex flex-col gap-4 sm:w-1/2">
        <h1 class="border-amber-500">Projects</h1>
        {#await waresRequest then result}
            <section class="*:ring-amber-500/50">
                {#each result as ware}
                    <Ware {ware} />
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
        <div
            class="flex gap-2 mb-24 *:ring-1 *:ring-purple-600/50 *:rounded *:p-2 *:transition-colors"
        >
            <Social
                name="Github"
                href="https://github.com/Zolo101"
                image={github_logo}
            />
            <Social name="Discord" image={discord_logo}>@zelo101</Social>
        </div>
        <!-- <h1 class="border-pink-500">Boredom Repellent</h1>
        <div class="flex justify-center">
           <ZelosAntLite/>
        </div> -->
    </div>
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
