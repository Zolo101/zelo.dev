import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { prepareProductionRoutes } from "./scripts/production-routes.mjs";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        files: {
            routes:
                process.env.NODE_ENV === "production"
                    ? prepareProductionRoutes(fileURLToPath(new URL(".", import.meta.url)))
                    : "src/routes"
        },
        prerender: {
            handleUnseenRoutes: ({ routes, message }) => {
                // An empty blog collection has no article URLs to generate.
                const { news } = JSON.parse(readFileSync(".generated/content.json", "utf8"));
                if (news.length === 0 && routes.every((route) => route === "/blog/[id]")) return;
                throw new Error(message);
            }
        }
    }
};

export default config;
