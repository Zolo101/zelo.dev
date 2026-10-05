import tailwindcss from "@tailwindcss/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
    // Initialize the core entry before extras to keep Pixi's lighting shaders valid.
    optimizeDeps: {
        include: ["@pixi/3d", "@pixi/3d/extras"]
    },
    plugins: [tailwindcss(), enhancedImages(), sveltekit()]
};

export default config;
