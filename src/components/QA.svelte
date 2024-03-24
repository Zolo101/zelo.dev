<script lang="ts">
    export let qa: QAItem;

    let date = new Date(qa.created).toLocaleString("DE", {dateStyle: "short"})
</script>

<section class="p-2 mb-4 flex gap-5 backdrop-blur-[2px] rounded hover:bg-gray-900/50 hover:ring-1 transition-all">
    <div class="grow w-full">
        <div class="flex justify-between gap-2">
            <p class="font-bold text-2xl bg-amber-200 bg-cyan-300/20 px-2 py-1 break-words">{qa.question}</p>
            <p class="text-lg text-right px-2">{date}</p>
        </div>
        <div class="answer p-4 max-w-2xl overflow-x-auto text-xl">
            {@html qa.answer}
        </div>
    </div>
</section>

<style>
    .answer > table {
        @apply outline outline-1;
    }

    :global(.answer a) {
        @apply text-blue-300;
    }

    :global(.answer a):hover {
        @apply underline;
    }
</style>