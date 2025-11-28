<script lang="ts">
    import { page } from "$app/state";
</script>

<div class="flex items-end gap-8 italic">
    <h1 class="text-8xl font-black">{page.status}</h1>
    <p class="text-3xl">{page.error?.message}</p>
</div>

<style>
</style>
