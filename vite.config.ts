import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],

	optimizeDeps: {
		esbuildOptions: {
			loader: {
				".glsl": "text",
			},
		}
	},
};

export default config;
