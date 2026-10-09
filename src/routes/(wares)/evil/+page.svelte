<script lang="ts">
    import evil from "$lib/assets/EA.png?enhanced";

    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>Evil Announcer - HTwins Central</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair:ital,opsz,wdth,wght@0,5..1200,87.5,300..900;1,5..1200,87.5,300..900&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<section>
    <div>
        <enhanced:img src={evil} alt="Evil announcer" width="128" />
        <div>
            <h1>E<span class="evil">v</span><span>·</span>il Announcer</h1>
        </div>
    </div>
    <p>
        Evil Announcer is a bot made by <a
            href="https://zelo.dev"
            target="_blank"
            rel="noopener noreferrer">zelo</a
        > to help users and moderators in HTwins Central.
    </p>
    <div>
        <a href="/evil/docs" data-sveltekit-reload>Docs</a>
        <a href="/evil/privacy" data-sveltekit-reload>Privacy Policy</a>
    </div>
</section>

<style>
    /* :global(body) {
        display: grid;
        place-items: center;
        height: 100vh;
    }

    :global(header, .back) {
        display: none !important;
    } */

    .evil {
        position: relative;
        color: #ff0000;
        top: -3rem;
        left: -0.45rem;
        font-weight: 400;
        font-size: 5rem;
        letter-spacing: -99rem;
    }

    section {
        display: flex;
        flex-direction: column;
        color: white;
        text-align: center;
        gap: 1rem;

        div {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;

            div {
                display: flex;
                flex-direction: column;
                gap: 0;
            }
        }

        p {
            a {
                font-weight: bold;
                color: #bf83ff;
                text-decoration: none;
            }
        }
    }

    h1 {
        font-size: 6rem;
        font-weight: bold;
    }

    h2 {
        font-size: 2rem;
        font-weight: bold;
    }

    p {
        font-size: 1.5rem;
        font-weight: 400;
    }
</style>
