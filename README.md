# Hackintosh Laptop Guide

A React app to help you pick a laptop that runs macOS well with OpenCore. It has compatibility scores, a component checker, side-by-side comparison, favorites, and build and troubleshooting guides.

Live site: https://julihex.github.io/Hakintoshbestmobile/

## Development

```sh
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Built with Vite, React 19, React Router, Tailwind CSS 3, Chart.js and [liquid-glass-react](https://github.com/rdev/liquid-glass-react). The Inter font is self-hosted through `@fontsource-variable/inter`, so the site makes no requests to outside servers.

## Deployment

`.github/workflows/deploy.yml` builds the app and publishes `dist/` to GitHub Pages on every push to `main`. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions** once.

GitHub Pages has no server-side routing. The build copies `index.html` to `404.html` so deep links like `/Hakintoshbestmobile/explorer` still load the app. Old links from the earlier multi-page site (`explorer.html`, `laptop_detail.html?id=…` and so on) redirect to the new routes. If the repository is renamed, update `base` in `vite.config.js`.

## Structure

- `src/data/laptops.js`: laptop data plus `LaptopDB` helpers. Each laptop's `needsVerification` lists fields that haven't been confirmed yet; the UI flags those as "Unverified". Laptops with `source: "community"` came from a community list and carry estimated ratings.
- `src/data/components.js`: Component Checker data.
- `src/pages/`: one component per route. The detail and compare pages are lazy-loaded so Chart.js only downloads when needed.
- `src/components/`: layout (header, footer, toasts), laptop cards and building blocks, the radar chart, and `Glass` (liquid-glass-react with site defaults).
- `src/lib/`: SVG icons, saved lists in localStorage (compare, favorites, recently viewed) as React hooks, and the dark-mode hook.
- `src/styles/main.css`: the glass design tokens (`--glass-*`) and components. Surfaces fall back to solid when `backdrop-filter` is unsupported or reduced transparency is requested.

## Adding a laptop

Add an entry to `laptopData` in `src/data/laptops.js`, using an existing entry as a template. No image is needed, because cards draw a tile from `brand` and the name. `minMacosSupport` and `maxMacosSupport` must start with a release name from `MACOS_VERSIONS`. In development, the console logs validation errors if anything is missing.
