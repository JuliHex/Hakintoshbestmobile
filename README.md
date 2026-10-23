# Hackintosh Laptop Guide

A guide to picking a laptop that runs macOS well with [OpenCore](https://github.com/acidanthera/OpenCorePkg), and to getting it working once you have it.

**Live site: https://julihex.github.io/Hakintoshbestmobile/**

> Apple has said macOS 26 Tahoe is the last macOS release for Intel Macs, which makes it the last one for Hackintoshes too. Existing installs keep working, but there won't be newer versions to upgrade to.

## Features

- **95 laptops** with compatibility scores, macOS version ranges, hardware details and known issues, from 22 brands, with links to maintained OpenCore repositories where one exists.
- **Explorer**: search everything (model, CPU, Wi-Fi card…), and filter by priority, macOS version, brand, minimum score or favorites. Filters live in the URL, so a filtered view can be shared as a link.
- **Compare** up to three laptops side by side, with an overlaid ratings chart and a spec table. Comparison links can be shared too.
- **Favorites and recently viewed**, saved on your device.
- **Component Checker**: which CPUs, GPUs, Wi-Fi cards, RAM and SSDs work with macOS.
- **A build guide for every laptop**: the OpenCore config section, SMBIOS, iGPU framebuffer values, SSDTs and every kext it needs (with download links), plus BIOS settings, boot arguments and the AppleALC layout-ids for its audio codec. Pick your exact CPU, Wi-Fi card, trackpad and target macOS, and the guide adapts. A checklist tracks the kexts you've collected.
- **Guides**: a general build guide, a buying-used checklist, a searchable troubleshooting page, and the essential tools and kexts.
- **Works well on phones**, in light and dark mode, with a "liquid glass" look.
- **No tracking and no outside requests**: fonts and libraries are bundled with the site.

## About the data

Laptop information is a starting point, not a guarantee. Check everything against your exact model before you buy.

- **32 curated laptops** are the core of the guide. Hardware for the newer additions comes from each model's maintained OpenCore repository, which is linked from its page. Any field that hasn't been confirmed against a real build is marked **Unverified** on the site.
- **63 community laptops** were imported from a community-submitted list. Their pages say so, their ratings are estimated from that list's compatibility scores, and their macOS ranges are marked Unverified.

Every guide link points to a repository confirmed to exist. Corrections are welcome. See [Adding or correcting a laptop](#adding-or-correcting-a-laptop).

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: search, best pick per priority, favorites, macOS coverage, brands, FAQ |
| `/explorer` | Search and filter all laptops |
| `/laptop/:id` | One laptop's full details and ratings |
| `/laptop/:id/build` | Step-by-step OpenCore build guide for that laptop |
| `/compare` | Side-by-side comparison (`?ids=a,b,c`) |
| `/components` | Component Checker (`?tab=Wi-Fi` and so on) |
| `/build-guide` | Installing macOS with OpenCore, step by step |
| `/buy-used` | Where to buy used and what to check |
| `/troubleshooting` | Fixes for common problems |
| `/essentials` | Tools, kexts and community resources |

Links from the old multi-page site (`explorer.html`, `laptop_detail.html?id=…` and so on) redirect to these routes.

## Getting started

You need [Node.js](https://nodejs.org/) 20 or newer.

```sh
npm install
npm run dev
```

Then open the address it prints (http://localhost:5173/Hakintoshbestmobile/).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Builds the production site into the repo root (see [Deployment](#deployment)) |
| `npm run preview` | Serves the production build locally |

## Tech stack

- [React 19](https://react.dev/) with [React Router 7](https://reactrouter.com/), built with [Vite](https://vite.dev/)
- [Tailwind CSS 3](https://v3.tailwindcss.com/) plus a small set of glass design components
- [liquid-glass-react](https://github.com/rdev/liquid-glass-react) for the refracting glass on the home page button and Explorer's compare bar
- [Chart.js](https://www.chartjs.org/) for ratings charts. It's lazy-loaded, so it only downloads on the laptop and compare pages
- [Inter](https://rsms.me/inter/), self-hosted through [@fontsource-variable/inter](https://fontsource.org/fonts/inter)

## Project structure

```
src/
├── index.html            App shell (source; the root index.html is generated)
├── main.jsx              Entry point: router, font, styles
├── App.jsx               Routes and redirects from old URLs
├── data/
│   ├── laptops.js        Laptop data, macOS versions, LaptopDB helpers
│   ├── components.js     Component Checker data
│   ├── kexts.js          Kexts, SSDTs, drivers and tools used by build guides
│   └── appleAlcLayouts.js  AppleALC layout-ids per codec (from the AppleALC wiki)
├── pages/                One component per route
├── components/           Layout, laptop cards, radar chart, Glass, toasts
├── lib/                  Icons, saved lists, dark mode, formatting helpers,
│                         and buildPlan.js (the build-guide rules engine)
└── styles/main.css       Tailwind and the glass design system
scripts/
├── clean-build.js        Removes the previous build before building
└── spa-fallback.js       Creates 404.html and .nojekyll after building
```

## How the build guides work

`src/lib/buildPlan.js` turns a laptop's listed hardware into a plan, following [Dortania's OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/): the laptop config page for its CPU generation, the "Gathering files" kext list, the laptop SSDT table from Getting Started With ACPI, and the Ventura and Tahoe notes. Codec layout-ids come from the [AppleALC supported codecs list](https://github.com/acidanthera/AppleALC/wiki/Supported-codecs).

When the data can't pin a part down, for example "8th gen" could be Kaby Lake R or Whiskey Lake, or the Wi-Fi card isn't listed, the guide offers the options and asks the reader to check their unit. The guides apply general rules to listed hardware; they aren't tested EFIs for each model.

The rules engine is the place to update when Dortania's guidance changes, for example a new macOS release. Kext names and download links live in `src/data/kexts.js`.

## Adding or correcting a laptop

Laptops live in `laptopData` in `src/data/laptops.js`. Copy an existing entry and change it. A shortened example:

```js
thinkpad_t480: {
    name: "ThinkPad T480",
    brand: "Lenovo",
    priority: ["ease", "budget"],          // ease, performance, budget, portability, stability
    score: 9.2,                            // 0-10
    summary: "Excellent Hackintosh compatibility with great community support",
    details: {
        cpu: "Intel Core i5/i7 8th Gen",
        igpu: "Intel UHD 620",
        minMacosSupport: "Mojave",         // must start with a name from MACOS_VERSIONS
        maxMacosSupport: "Sonoma (with caveats)",
        chartData: { ease: 90, performance: 85, battery: 80, stability: 95 },  // 0-100
        knownIssues: ["Fingerprint reader not supported"]
        // ...plus optional ram, storage, wifiBluetooth, audioCodec, trackpad, ports,
        // displayFeatures, batteryLife, thermals, guides and more
    },
    needsVerification: ["details.maxMacosSupport"]
}
```

- The key (`thinkpad_t480`) becomes the page URL: `/laptop/thinkpad_t480`.
- No image is needed. Cards draw a tile from `brand` and `name`.
- List any field you haven't confirmed in `needsVerification`, and the site shows it as Unverified. Once you've checked a value, remove its path.
- In development, the browser console reports missing or invalid fields.

## Deployment

GitHub Pages serves the `main` branch from the repository root ("Deploy from a branch"). GitHub doesn't run a build, so the built site is committed with the source:

1. Make your changes and run `npm run build`. This replaces `index.html`, `404.html`, `.nojekyll` and `assets/` in the repo root.
2. Commit the source changes and the generated files together, then merge into `main`.

Notes:

- Don't edit the root `index.html` or anything in `assets/` by hand; they're overwritten on every build. Edit `src/` instead.
- GitHub Pages has no server-side routing, so `404.html` is a copy of the app. That's what makes deep links like `/Hakintoshbestmobile/explorer` work.
- The site is built for the `/Hakintoshbestmobile/` path. If the repository is renamed, update `base` in `vite.config.js`.

## Browser support

The site works in current versions of Chrome, Edge, Safari and Firefox. The liquid glass refraction effect only renders in Chromium-based browsers; Safari and Firefox show frosted glass without the distortion. If your system asks for reduced transparency or motion, or a browser can't blur backgrounds, the site uses solid surfaces and turns animations off.

## Disclaimer

This guide is for educational purposes. Apple's macOS licence only permits installing macOS on Apple-branded hardware. This project isn't affiliated with Apple. For in-depth, authoritative instructions, see the [Dortania OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/).

## License

[MIT](LICENSE)
