<script lang="ts">
    import github_logo from "$lib/assets/github.png";

    export let item: any;

    const date = new Date(item.commit.author.date);
    // const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const dateText = date.toLocaleString("en-GB", {
        timeZone: "GMT",
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const repositoryName = item.repository.name;
    let imageSrc = github_logo;
    let defaultLogo = false;

    switch (repositoryName) {
        case "5beam":
            imageSrc =
                "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/jgrjryzogyi01q0/favicon_nzDgGw5T8X.png";
            break;
        case "zelos_ant":
            imageSrc =
                "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/0rss9kv6onow2pb/zelosant_dJmfhfuj0W.gif";
            break;
        case "NotEnoughServers":
            imageSrc =
                "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/gonr0um2p7gpnpv/icon_rD09PzNS0p.png";
            break;
        case "cell-workshop":
            imageSrc =
                "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/3z2xsrvdc9gzrco/favicon_rZsEFGy3be.png";
            break;
        case "RenderScale":
            imageSrc =
                "https://cdn.zelo.dev/api/files/fx39sxljxqc10s0/c40wminbrsrz7dy/renderscale_Crq0fLscCA.png";
            break;
        case "zelo.dev":
            imageSrc = "favicon.png";
            break;
        default:
            defaultLogo = true;
            break;
    }
</script>

<section>
    <div class="flex items-center justify-between pb-2">
        <div class="flex items-start">
            <a href={item.html_url} class="min-w-8">
                <img
                    width="32"
                    height="32"
                    src={imageSrc}
                    class="rounded-xs"
                    alt={defaultLogo ? "Github link" : repositoryName}
                />
            </a>
            <div class="px-2">
                <h2>{item.commit.message}</h2>
                <!--                                    TODO: Make it say something like "2 days ago" -->
                <span class="text-sm italic opacity-75">{dateText}</span>
                {#if imageSrc !== github_logo}
                    <span class="tracking-tighter text-green-500">::</span>
                    <span class="font-bold opacity-75">{repositoryName}</span>
                {/if}
            </div>
        </div>
    </div>
    <div class="mb-2 w-full ring-1 ring-emerald-300/20"></div>
</section>
