<script lang="ts">
    export let qa: QAItem;

    let date = new Date(qa.created).toLocaleString("DE", { dateStyle: "short" });
</script>

<section
    class="mb-4 flex gap-5 rounded-xs p-2 backdrop-blur-[2px] transition-all hover:bg-gray-900/50 hover:ring hover:ring-cyan-300/50"
>
    <div class="w-full grow">
        <div class="flex justify-between gap-2">
            <p class="bg-amber-200 bg-cyan-300/20 px-2 py-1 text-2xl font-bold break-words">
                {qa.question}
            </p>
            <p class="px-2 text-right text-lg">{date}</p>
        </div>
        <div class="answer max-w-2xl overflow-x-auto p-4 text-xl">
            {@html qa.answer}
        </div>
    </div>
</section>
