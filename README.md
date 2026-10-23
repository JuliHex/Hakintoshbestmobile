# Hackintosh Laptop Guide

A static site to help you pick a laptop that runs macOS well with OpenCore. It has compatibility scores, a component checker, side-by-side comparison, and build and troubleshooting guides.

## Development

```sh
npm install
npm run dev     # rebuild assets/css/styles.css on change
npm run build   # one-off CSS build
npx http-server .   # or any static server
```

`assets/css/styles.css` is generated from `src/css/main.css` by Tailwind. Commit the built file, because GitHub Pages serves it as-is.

## Structure

- `js/data.js`: laptop and component data, plus `LaptopDB` helpers. Each laptop's `needsVerification` lists fields that haven't been confirmed yet. The UI flags those as "Unverified".
- `js/layout.js`: shared header, footer, theme toggle, compare selection and card rendering.
- `js/*_page.js`: page-specific logic.

## Adding a laptop

Add an entry to `laptopData` in `js/data.js`, using an existing entry as a template, and add a 600×400 image to `assets/images/laptops/`. `minMacosSupport` and `maxMacosSupport` must start with a release name from `MACOS_VERSIONS`. The console logs validation errors if anything is missing.
