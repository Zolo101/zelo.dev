<script lang="ts">
    import { onMount } from "svelte";
    import * as publicEnv from "$env/static/public";
    import { getLiveQuestions } from "$lib/live-content";
    import { submitQuestion } from "$lib/submit-question";

    const env: Record<string, string> = { ...publicEnv };
    const baseURL = "https://cdn.zelo.dev";
    const endpoint = `${baseURL.replace(/\/$/, "")}/api/collections/qa/records`;
    let questions = $state<Awaited<ReturnType<typeof getLiveQuestions>>>([]);
    let loading = $state(true);
    let loadFailure = $state("");
    let controller: AbortController;

    async function loadQuestions() {
        controller?.abort();
        controller = new AbortController();
        const { signal } = controller;
        loading = true;
        loadFailure = "";
        try {
            const result = await getLiveQuestions(
                baseURL,
                AbortSignal.any([signal, AbortSignal.timeout(30_000)])
            );
            if (!signal.aborted) questions = result;
        } catch {
            if (!signal.aborted) loadFailure = "Couldn't load questions. Please try again.";
        } finally {
            if (!signal.aborted) loading = false;
        }
    }
    let question = $state("");
    let ready = $state(false);
    let sending = $state(false);
    let success = $state(false);
    let failure = $state("");

    onMount(() => {
        ready = true;
        void loadQuestions();
        return () => controller?.abort();
    });

    async function submit(event: SubmitEvent) {
        event.preventDefault();
        if (sending) return;
        sending = true;
        success = false;
        failure = "";
        try {
            await submitQuestion(endpoint, question);
            question = "";
            success = true;
            void loadQuestions();
        } catch (error) {
            failure = error instanceof Error ? error.message : "Your question couldn't be sent.";
        } finally {
            sending = false;
        }
    }
</script>

{#snippet QA(qa: (typeof questions)[number])}
    {@const date = new Date(qa.created).toLocaleString("DE", { dateStyle: "short" })}
    <section
        class="mb-4 flex gap-5 transition-colors hover:bg-gray-100/50 hover:ring hover:ring-violet-300/50 md:p-2 dark:hover:bg-gray-900/50"
    >
        <div class="w-full grow">
            <div class="flex justify-between gap-2">
                <p
                    class="bg-violet-600 px-1 text-2xl font-bold break-words text-violet-100 dark:bg-violet-700/50"
                >
                    {qa.question}
                </p>
                <p class="text-right text-lg">{date}</p>
            </div>
            <div class="answer max-w-2xl overflow-x-auto p-4 text-xl text-black dark:text-white">
                <!-- Answers contain publisher-authored rich text. -->
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html qa.answer}
            </div>
        </div>
    </section>
{/snippet}

<div class="flex gap-5 max-xl:flex-col">
    <form
        class="top-10 flex h-full min-w-96 flex-col gap-3 xl:sticky"
        method="POST"
        action={endpoint}
        onsubmit={submit}
    >
        <label for="question" class="text-center">Ask me a question</label>
        <textarea
            id="question"
            name="question"
            bind:value={question}
            class="h-24 w-full bg-white p-2 ring-1 dark:bg-neutral-900/50"
            required
            minlength="5"
            maxlength="1000"
            disabled={sending}
        ></textarea>
        <button
            type="submit"
            disabled={!ready || sending}
            class="cursor-pointer bg-violet-300 px-2 text-2xl transition-colors hover:bg-violet-400 disabled:cursor-wait disabled:opacity-50 dark:bg-violet-800 dark:hover:bg-violet-950"
        >
            {sending ? "Sending…" : "Ask!"}
        </button>
        <noscript>Enable JavaScript to submit a question.</noscript>
        {#if success}
            <p class="text-sm text-green-700 dark:text-green-300" role="status">
                Sent! I'll answer as soon as I can! (or not)
            </p>
        {/if}
        {#if failure}
            <p class="text-sm text-red-700 dark:text-red-300" role="alert">{failure}</p>
        {/if}
    </form>
    <div class="flex flex-col">
        <noscript>Enable JavaScript to load questions and answers.</noscript>
        {#if loading}
            <p role="status">Loading questions…</p>
        {:else if loadFailure}
            <p role="alert">{loadFailure}</p>
            <button type="button" class="underline" onclick={loadQuestions}>Try again</button>
        {:else if questions.length === 0}
            <p>No questions yet.</p>
        {:else}
            {#each questions as qa (qa.id)}
                {@render QA(qa)}
            {/each}
        {/if}
    </div>
</div>

<style>
    :global(.answer a) {
        color: var(--color-violet-300);
        text-decoration: underline;
    }
</style>
