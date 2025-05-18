<script lang="ts">
    import PocketBase from "pocketbase";
    import QA from "$lib/components/QA.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";

    let { data: serverData }: PageProps = $props();
    const { QAs: result } = serverData;

    const pb = new PocketBase("https://cdn.zelo.dev");

    onMount(() => {
        createQAId();
        $data.questioner = localStorage.getItem("qa_id");
    });

    const createQAId = async () => {
        let t = navigator.userAgent;
        let d = new Date().toLocaleTimeString();
        let te = new TextEncoder().encode(t + d);
        let c = new Uint8Array(await crypto.subtle.digest("SHA-256", te));
        let f = Array.from(c)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        if (!localStorage.getItem("qa_id")) localStorage.setItem("qa_id", f);
        // localStorage.setItem("qa_id", f)
    };

    let data = writable({
        question: "",
        questioner: "",
        hidden: false
    });

    let settings = writable({
        filter: "latest"
    });

    let text = $state("q&a");
    let submitText = $state("Ask");

    const askQuestion = (event: SubmitEvent) => {
        event.preventDefault();
        pb.collection("qa")
            .create($data)
            .then(() => {
                $data.question = "";
                setText("Sent!");
            })
            .catch((err) => {
                console.error(JSON.stringify(err, null, 2));
                setText("Error sending...");
            });
    };

    const changeMode = (text: string) => {
        $settings.filter = text;
    };

    const setText = (content: string) => {
        text = content.toLowerCase();
        submitText = content;
        setTimeout(() => (text = "q&a"), 5000);
        setTimeout(() => (submitText = "Ask"), 5000);
    };
</script>

<p class="fixed bottom-6 left-4 text-8xl font-bold text-gray-400/20">
    {text}
</p>

<section class="mt-10 flex max-w-[1600px] gap-6 p-5 max-lg:flex-col">
    <form class="top-10 flex h-full min-w-96 flex-col gap-2 lg:sticky" onsubmit={askQuestion}>
        <textarea
            class="h-24 w-full bg-black p-2 ring-1"
            minlength="5"
            maxlength="1000"
            bind:value={$data.question}
        ></textarea>
        <input
            type="submit"
            class="cursor-pointer bg-cyan-800 p-2 text-2xl font-bold hover:bg-gray-800"
            value={submitText}
        />
        <noscript>
            <span class="font-bold text-red-500">Enable JavaScript to ask questions!</span>
        </noscript>
    </form>
    <div class="flex flex-col">
        {#each result as qa}
            <QA {qa} />
        {/each}
    </div>
</section>
