<script lang="ts">
    export let href: string;
</script>

<section class="w-full ring-1 rounded-xs text-2xl p-1 text-center no-underline cursor-pointer transition-colors">
<!--    <div class="bg-green-100 blur-xs"></div>-->
    <a {href} class="w-full h-full block"><slot></slot></a>
</section>