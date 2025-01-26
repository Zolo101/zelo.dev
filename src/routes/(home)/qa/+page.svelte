<script lang="ts">
    import PocketBase from "pocketbase";
    import QA from "$lib/components/QA.svelte";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";

    let { data: serverData }: PageProps = $props();
    const {QAs: result} = serverData;

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
        hidden: false,
    });

    let settings = writable({
        filter: "latest",
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

<p class="text-8xl font-bold fixed left-4 bottom-6 text-gray-400/20">
    {text}
</p>

<section class="flex max-lg:flex-col gap-6 mt-10 max-w-[1600px] p-5">
    <form
        class="lg:sticky top-10 flex flex-col gap-2 min-w-96 h-full"
        onsubmit={askQuestion}
    >
        <textarea
            class="w-full p-2 h-24 ring-1 bg-black"
            minlength="5"
            maxlength="1000"
            bind:value={$data.question}
        ></textarea>
        <input
            type="submit"
            class="cursor-pointer font-bold bg-cyan-800 hover:bg-gray-800 text-2xl p-2"
            value={submitText}
        />
        <noscript>
            <span class="text-red-500 font-bold">Enable JavaScript to ask questions!</span>
        </noscript>
    </form>
    <div class="flex flex-col">
        {#each result as qa}
            <QA {qa} />
        {/each}
    </div>
</section>
