<script lang="ts">
    import github_logo from "$lib/assets/github.png";

    export let item: any;

    const date = new Date(item.commit.author.date)

    const repositoryName = item.repository.name;
    let imageSrc = github_logo;

    switch (repositoryName) {
        case "5beam":
            imageSrc = "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/jgrjryzogyi01q0/favicon_nzDgGw5T8X.png";
            break;
        case "zelos_ant":
            imageSrc = "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/0rss9kv6onow2pb/zelosant_dJmfhfuj0W.gif";
            break;
        case "zelo.dev":
            imageSrc = "favicon.png";
            break;
    }
</script>

<section>
    <div class="flex justify-between items-center pb-2">
        <div class="flex items-start">
            <a href={item.html_url} class="min-w-8">
                <img width="32" height="32" src={imageSrc}/>
            </a>
            <div class="px-2">
                <h2>{item.commit.message}</h2>
                <!--                                    TODO: Make it say something like "2 days ago" -->
                <span class="text-sm opacity-75 italic">{date.toLocaleString("en-GB", {timeZone: "GMT", hour: "numeric", minute: "numeric" , year: "numeric", month: "long", day: "numeric"})}</span>
                {#if imageSrc != github_logo}
                    <span class="text-green-500 tracking-tighter">::</span>
                    <span class="opacity-75">{repositoryName}</span>
                {/if}
            </div>
        </div>
        <a href={item.committer.html_url} class="min-w-8">
            <img class="opacity-50 hover:opacity-100 transition-opacity rounded" width="32" height="32" src={item.author.avatar_url}/>
        </a>
    </div>
    <div class="w-full ring-1 ring-emerald-300/20 mb-2"></div>
</section>