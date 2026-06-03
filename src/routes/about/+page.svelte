<script lang="ts">
    import discord from "$lib/assets/logos/discord.svg";
    import bluesky from "$lib/assets/logos/bluesky.svg";
    import ExternalLink from "$lib/components/ExternalLink.svelte";
</script>

<p>
    I'm <em>Adam</em>, a 21 year old programmer from London, currently studying a Masters in
    Computer Science at <em>Royal Holloway</em>.
</p>
<p>
    I'm interested in computer graphics, <ExternalLink href="https://ant.zelo.dev"
        >cellular automata</ExternalLink
    >, and deep learning!
</p>
<br />
<p>
    Wanna talk? I don't have an email on this domain yet, so for now you can reach me on <span
        class="text-purple-400"
        ><img src={discord} alt="Discord Icon" class="inline h-6 w-6 bg-indigo-500 p-0.5" /> discord
        <em class="text-base">(@zelo101)</em></span
    >, <ExternalLink href="https://bsky.app/profile/zelo.dev">bluesky</ExternalLink> or on
    <ExternalLink href="https://github.com/Zolo101">github</ExternalLink>.
</p>
<!-- <br /> -->
<!-- <p>List of cool sites you should check out:</p> -->
<!-- <ul>
    <li>
        <ExternalLink href="https://cellpond.cool/">TodePond's "CellPond"</ExternalLink>
        (Check out <ExternalLink
            href="https://www.youtube.com/watch?v=gv40Z9tVjAI&list=PL9uRa69RF-7xcGDktLv0nX2jJ1VaZPxea&index=1" icon={false}
            >the video</ExternalLink
        > for a tutorial) -->
<!-- and <ExternalLink href="https://screenpond.cool/">"ScreenPond"</ExternalLink> -->
<!-- </li>
    <li>
        <ExternalLink href="https://paperclover.net/">paper clover</ExternalLink>
    </li>
    <li>
        <ExternalLink href="https://htwins.net/">HTwins.net</ExternalLink>
    </li>
    <li>
        <ExternalLink href="https://compute.toys/">compute.toys</ExternalLink>
    </li> -->
<!-- <li>
        <ExternalLink href="https://osk.sh/">osk</ExternalLink>
    </li> -->
<!-- <li>
        <ExternalLink href="https://tetr.io/">tetr.io (online multiplayer tetris)</ExternalLink>
    </li>
    <li>
        <ExternalLink href="https://github.com/mxgmn/MarkovJunior">MarkovJunior</ExternalLink>
    </li>
</ul> -->
<!-- <br />
<p>I have a button you can use to link my site if you want (make sure to hotlink!)</p> -->

<br />
<span
    >This site was made using
    <ExternalLink href="https://svelte.dev/">Svelte</ExternalLink> + <ExternalLink
        href="https://tailwindcss.com/">Tailwind</ExternalLink
    > + <ExternalLink href="https://pixijs.com/">PixiJS</ExternalLink>, in <ExternalLink
        href="https://code.visualstudio.com/">VS Code</ExternalLink
    >.
</span>

<style>
    p,
    span {
        font-size: var(--text-2xl);
    }
    a {
        transition:
            background-color 0.1s ease-out,
            color 0.1s ease-out;
        padding: 0.05rem 0.2rem;
        color: var(--color-blue-400);

        &:hover {
            color: white;
            background-color: var(--color-blue-600);
        }
    }

    a {
        transition: background-color 0.1s ease-out;
        color: white;
        background-color: var(--color-violet-800);

        padding: 0.05rem 0.2rem;

        &:hover {
            background-color: var(--color-violet-600);
        }
    }
</style>
