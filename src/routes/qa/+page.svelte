<script>
    import Boilerplate from "../../components/Boilerplate.svelte";
    import PocketBase from "pocketbase";
    import QA from "../../components/QA.svelte";
    import Linebreak from "../../components/Linebreak.svelte";
    import {writable} from "svelte/store";
    import {onMount} from "svelte";

    const pb = new PocketBase("https://cdn.zelo.dev")

    onMount(() => {
        createQAId()
        $data.questioner = localStorage.getItem("qa_id")
    })

    const createQAId = async () => {
        let t = navigator.userAgent
        let d = new Date().toLocaleTimeString()
        let te = new TextEncoder().encode(t + d)
        let c = new Uint8Array(await crypto.subtle.digest("SHA-256", te))
        let f = Array.from(c).map(b => b.toString(16).padStart(2, "0")).join("");
        if (!localStorage.getItem("qa_id")) localStorage.setItem("qa_id", f)
        // localStorage.setItem("qa_id", f)
    }

    let data = writable({
        question: "",
        questioner: "",
        hidden: false
    });

    let settings = writable({
        filter: "latest"
    });

    let text = writable("q&a")
    let submitText = writable("Ask")

    const requestQuestions = (filter) => {
        switch (filter) {
            case "yours":
                return pb.collection("qa").getFullList(-1, {
                    sort: "-created",
                    filter: `questioner = "${$data.questioner}"`
                })

            case "latest":
            default:
                return pb.collection("qa").getFullList(-1, {
                    sort: "-created"
                })
        }
    }

    const askQuestion = () => {
        pb
            .collection("qa")
            .create($data)
            .then(() => {
                $data.question = ""
                setText("Sent!")
            })
            .catch((err) => {
                console.error(JSON.stringify(err, 0, 2))
                setText("Error sending...")
            })
    }

    const changeMode = (text) => {
        $settings.filter = text
    }

    const setText = (content) => {
        $text = content.toLowerCase()
        $submitText = content
        setTimeout(() => $text = "q&a", 5000)
        setTimeout(() => $submitText = "Ask", 5000)
    }
</script>

<p class="text-7xl font-bold z-10 fixed right-4 bottom-6 text-gray-400 opacity-40">{$text}</p>
<Boilerplate>
    <form class="flex flex-col" on:submit|preventDefault={askQuestion}>
        <textarea class="outline outline-1 w-4/5 h-24 m-auto p-1 dark:bg-black dark:focus-visible:outline-gray-500" minlength="5" maxlength="1000" bind:value={$data.question}></textarea>
        <input type="submit" class="outline outline-1 cursor-pointer float-right bg-gray-200 hover:bg-gray-300 dark:bg-black dark:hover:bg-gray-800 text-2xl p-2 m-5" value={$submitText}/>
    </form>

    <div class="flex w-full text-center text-xl">
        <div class="outline outline-1 outline-gray-200 flex-grow pt-1 pb-1 mr-1 cursor-pointer bg-gray-50 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" on:click={() => changeMode("latest")}>Latest</div>
        <div class="outline outline-1 outline-gray-200 flex-grow pt-1 pb-1 ml-1 cursor-pointer bg-gray-50 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" on:click={() => changeMode("yours")}>Your Questions</div>
    </div>

    <br>
    <Linebreak/>
    <br>

    {#await requestQuestions($settings.filter) then result}
        {#each result as qa}
            <QA {qa}/>
        {/each}
    {/await}
</Boilerplate>