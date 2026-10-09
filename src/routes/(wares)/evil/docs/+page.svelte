<svelte:head>
    <title>Evil Announcer Docs - HTwins Central</title>
</svelte:head>

<!-- e.g. /mod -->
{#snippet command()}
    <section id="name">
        <h2></h2>
    </section>
{/snippet}

<!-- e.g. Report message -->
{#snippet interaction()}{/snippet}

<h1>Commands</h1>
<h2>/mod</h2>
<p>
    Pings a random moderator with a message. Due to discord requirements, I no longer ping based on
    mod activity. Zelo's working on this!
</p>
<h1>App Interactions</h1>
<h2>Report Message</h2>
<p>Functions the same as /mod, but lets you target a message.</p>

<style>
    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 1rem 0;
        color: var(--color-primary);
    }

    h2 {
        font-size: 2rem;
        font-weight: bold;
    }

    p {
        font-size: 1rem;
    }
</style>
