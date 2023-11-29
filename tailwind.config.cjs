/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        "./node_modules/zelos.ant.lite/**/*.{svelte,html,js,ts}",
    ],
    theme: {
        extend: {}
    },
    plugins: [],
    // darkMode: "class"
};