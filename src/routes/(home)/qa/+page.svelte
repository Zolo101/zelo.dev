<script lang="ts">
    import type { PageProps } from "./$types";
    import QA from "$lib/components/QA.svelte";

    let { data }: PageProps = $props();
    const { questions, id } = data;
</script>

<div class="flex gap-5 max-md:flex-col">
    <form class="top-10 flex h-full min-w-48 flex-col gap-2 lg:sticky" method="POST">
        <input type="hidden" name="questioner" value={id} />
        <textarea
            name="question"
            class="h-24 w-full bg-white p-2 ring-1 dark:bg-black"
            minlength="5"
            maxlength="1000"
        ></textarea>
        <button
            class="cursor-pointer bg-violet-300 px-2 py-1 text-2xl transition-colors hover:bg-violet-950 dark:bg-violet-800"
            >Submit!</button
        >
    </form>
    <div class="flex flex-col">
        {#each questions as qa}
            <QA {qa} />
        {/each}
    </div>
</div>
