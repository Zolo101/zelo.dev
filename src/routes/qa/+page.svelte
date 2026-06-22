<script lang="ts">
    import type { PageProps } from "./$types";
    import QA from "$lib/components/QA.svelte";
    import { enhance } from "$app/forms";

    let { data, form }: PageProps = $props();
</script>

<div class="flex gap-5 max-lg:flex-col">
    <form class="top-10 flex h-full min-w-48 flex-col gap-3 lg:sticky" method="POST" use:enhance>
        <input type="hidden" name="questioner" value={data.id} />
        <textarea
            name="question"
            class="h-24 w-full bg-white p-2 ring-1 dark:bg-black"
            minlength="5"
            maxlength="1000"
        ></textarea>
        <button
            class="cursor-pointer bg-violet-300 px-2 text-2xl transition-colors hover:bg-violet-400 dark:bg-violet-800 dark:hover:bg-violet-950"
            >Ask!</button
        >
        {#if form?.success}
            <p class="text-sm text-green-700 dark:text-green-300" role="status">
                Sent! I'll answer as soon as I can! (or not)
            </p>
        {/if}
    </form>
    <div class="flex flex-col">
        {#each data.questions as qa (qa.id)}
            <QA {qa} />
        {/each}
    </div>
</div>
