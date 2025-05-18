<script lang="ts">
    export let href: string;
</script>

<section
    class="w-full cursor-pointer rounded-xs p-1 text-center text-2xl no-underline ring ring-blue-500 transition-colors"
>
    <!--    <div class="bg-green-100 blur-xs"></div>-->
    <a {href} class="block h-full w-full"><slot></slot></a>
</section>
