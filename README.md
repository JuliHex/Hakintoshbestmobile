# Hackintosh Laptop Guide

A static site to help you pick a laptop that runs macOS well with OpenCore. It has compatibility scores, a component checker, side-by-side comparison, and build and troubleshooting guides.

## Development

```sh
npm install
npm run dev     # rebuild assets/css/styles.css on change
npm run build   # build the CSS and the liquid-glass JS bundle
npx http-server .   # or any static server
```

`assets/css/styles.css` is generated from `src/css/main.css` by Tailwind, and `assets/js/liquid-glass.js` is bundled from `src/islands/liquid-glass.jsx` by esbuild. Commit both built files, because GitHub Pages serves them as-is.

## Structure

- `js/data.js`: laptop and component data, plus `LaptopDB` helpers. Each laptop's `needsVerification` lists fields that haven't been confirmed yet. The UI flags those as "Unverified".
- `js/layout.js`: shared header, footer, theme toggle, SVG icons, saved lists (compare, favorites, recently viewed) and card rendering.
- `src/css/main.css`: the "liquid glass" design tokens (`--glass-*`) and components. Surfaces fall back to solid when `backdrop-filter` is unsupported or reduced transparency is requested.
- `js/*_page.js`: page-specific logic.

## Adding a laptop

Add an entry to `laptopData` in `js/data.js`, using an existing entry as a template. You don't need an image, because cards draw a tile from the `brand` and name. `minMacosSupport` and `maxMacosSupport` must start with a release name from `MACOS_VERSIONS`. The console logs validation errors if anything is missing.
