<script lang="ts">
    const { href, children, icon = true } = $props();
</script>

{#if icon}
<img
    src="https://www.google.com/s2/favicons?domain={href}"
    alt="Site Icon"
    class="inline h-6 w-6 p-0.5"
/>{/if}<a {href} target="_blank" rel="noopener noreferrer">{@render children()}</a>

<!-- style="background-image: url('https://www.google.com/s2/favicons?domain={href}')" -->

<style>
    /* img {
        image-rendering: pixelated;
    } */

    a {
        transition:
            background-color 0.1s ease-out,
            color 0.1s ease-out;
        padding: 0.05rem 0.2rem;
        /* filter: saturate(1000%) brightness(200%);
        background-size: 1000px;
        background-repeat: no-repeat;
        background-position: center center;
        background-origin: border-box;
        background-clip: text; */
        /* color: transparent; */
        color: var(--color-blue-400);

        &:hover {
            color: white;
            background-color: var(--color-blue-600);
        }
    }
</style>
