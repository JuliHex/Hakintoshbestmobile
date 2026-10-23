import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repository's main branch from the root folder, so the build
// writes the finished site (index.html, 404.html, assets/) to the repo root and those
// files are committed. The app's source shell lives in src/index.html.
export default defineConfig({
    root: 'src',
    // The site is served from https://<user>.github.io/Hakintoshbestmobile/.
    base: '/Hakintoshbestmobile/',
    plugins: [react()],
    build: {
        outDir: '..',
        // Never empty the output dir: it's the repository root. scripts/clean-build.js
        // removes the previous build's files instead.
        emptyOutDir: false
    }
});
