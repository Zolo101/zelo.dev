<script lang="ts">
    import "../app.css";
    import { onNavigate } from "$app/navigation";

    onNavigate((navigation) => {
        // @ts-ignore
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            // @ts-ignore
            document.startViewTransition(async () => {
                resolve()
                await navigation.complete;
            })
        })
    })
</script>

<slot />