<script lang="ts">
    export let qa: QAItem;

    let date = new Date(qa.created).toLocaleString("DE", { dateStyle: "short" });
</script>

<section
    class="mb-4 flex gap-5 p-2 transition-colors hover:bg-gray-100/50 hover:ring hover:ring-violet-300/50 dark:hover:bg-gray-900/50"
>
    <div class="w-full grow">
        <div class="flex justify-between gap-2">
            <p
                class="bg-violet-300 px-2 py-1 text-2xl font-bold break-words text-white dark:bg-violet-700/50"
            >
                {qa.question}
            </p>
            <p class="px-2 text-right text-lg">{date}</p>
        </div>
        <div class="answer max-w-2xl overflow-x-auto p-4 text-xl text-violet-400">
            {@html qa.answer}
        </div>
    </div>
</section>
