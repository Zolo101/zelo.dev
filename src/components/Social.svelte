<script lang="ts">
    export let name: string;
    export let image: string;
    export let href: string = "";
</script>

<section class="flex flex-col gap-1 bg-purple-950/15 hover:bg-purple-950/40">
    <a {href} class="text-xs text-center"><img width="64" height="64" src={image}/><slot></slot></a>
</section>
