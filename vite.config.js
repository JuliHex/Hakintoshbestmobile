import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site is served from https://<user>.github.io/Hakintoshbestmobile/, so every asset
// URL and route lives under that base path.
export default defineConfig({
    base: '/Hakintoshbestmobile/',
    plugins: [react()]
});
