import adapter from '@sveltejs/adapter-netlify';
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// edge: false,
			// split: false
			// fallback: null,
			// precompress: true,
			// strict: true
		})
	},
};

export default config;
