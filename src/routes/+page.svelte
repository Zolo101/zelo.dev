<script>
    // import IndexComponent from "../components/IndexComponent.svelte";
    import ZelosAntLite from "../../node_modules/zelos.ant.lite/src/lib/component/ZelosAntLite.svelte";
</script>

<div class="flex justify-center items-center" style="height: 100vh">
    <div class="grid grid-cols-1 text-center gap-10 text-4xl">
        <p class="text-center text-7xl">zelo.dev</p>
        <div class="font-sans">
            <ZelosAntLite/>
        </div>
        <div class="grid grid-cols-2 gap-10">
            <a href="https://corkboard.zelo.dev">corkboard</a>
            <a href="/wares">wares</a>
    <!--        <a href="/blender">blender</a>-->
            <a href="/qa">q&a</a>
            <!--<a href="/artifacts">artifacts</a>-->
        </div>
<!--        <IndexComponent-->
<!--                url="https://corkboard.zelo.dev"-->
<!--                colour="#ffb996"-->
<!--                bg="#896351"-->
<!--        >-->
<!--            <p slot="title">corkboard</p>-->
<!--            <p slot="description">community noticeboard</p>-->
<!--        </IndexComponent>-->
<!--        <IndexComponent-->
<!--                url="/wares"-->
<!--                colour="#ffffff55"-->
<!--                bg="#000000"-->
<!--        >-->
<!--            <p slot="title">wares</p>-->
<!--            <p slot="description">software ive done</p>-->
<!--        </IndexComponent>-->
<!--        <IndexComponent-->
<!--                url="/blender"-->
<!--                colour="#0e548b"-->
<!--                bg="#f4792b"-->
<!--        >-->
<!--            <p slot="title">blender</p>-->
<!--            <p slot="description">blender projects + files</p>-->
<!--        </IndexComponent>-->
<!--        <IndexComponent-->
<!--                url="/qa"-->
<!--                bg="#00000022"-->
<!--        >-->
<!--            <p slot="title">q&a</p>-->
<!--            <p slot="description">anonymously ask questions!</p>-->
<!--        </IndexComponent>-->
<!--            <a href="/blog">blog</a>-->
<!--            <a href="/artifacts">artifacts</a>-->
    </div>
</div>

<style>
    a {
        @apply no-underline;
    }

    a:hover {
        @apply underline underline-offset-4;
    }
</style>