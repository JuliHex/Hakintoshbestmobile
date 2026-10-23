/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    // liquid-glass-react styles its overlay layers with Tailwind classes.
    "./node_modules/liquid-glass-react/dist/index.esm.js"
  ],
  // Classes built at runtime (e.g. 'macos-' + version) that the scanner can't see.
  safelist: [{ pattern: /^macos-/ }],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        secondary: '#f0f4f8'
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
}
