<script lang="ts">
    export let qa: QAItem;

    let date = new Date(qa.created).toLocaleString("DE", {dateStyle: "short"})
</script>

<div class="p-2 mb-4 flex gap-5 hover:bg-gray-50 dark:hover:bg-gray-900">
    <div class="grow w-full">
        <div class="flex justify-between gap-2">
            <p class="font-bold text-2xl bg-amber-200 dark:bg-yellow-300 dark:bg-opacity-20 px-2 py-1 max-w-full break-words">{qa.question}</p>
            <p class="text-lg text-right px-2">{date}</p>
        </div>
        <div class="answer pt-4 pl-4 max-w-2xl text-xl">
            {@html qa.answer}
        </div>
    </div>
</div>

<style>
    .answer > table {
        @apply outline outline-1;
    }

    :global(.answer a) {
        @apply text-blue-300;
    }
</style>