<script>
    export let qa;

    let date = new Date(qa.created).toLocaleString("DE", {dateStyle: "short"})
</script>

<div class="p-2 mb-4 flex gap-5 hover:bg-gray-50">
    <div class="grow w-full">
        <div class="flex justify-between">
            <p class="font-bold text-3xl bg-amber-300 p-2 max-w-full break-words">{qa.question}</p>
            <p class="text-lg text-right">{date}</p>
        </div>
        <p class="pt-4 pl-4 max-w-2xl text-xl">{qa.answer}</p>
    </div>
</div>
