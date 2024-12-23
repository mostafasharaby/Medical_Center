/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Scan all component templates and TypeScript files for Tailwind classes
    //  "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
      }
    },
  },
  plugins: [require('flowbite/plugin')],
};
