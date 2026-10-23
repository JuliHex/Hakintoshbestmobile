// Shared site chrome (header, footer, theme toggle), saved lists, and rendering helpers used by every page.
// Load after js/data.js and before the page-specific script.

const NAV_ITEMS = [
    { href: 'index.html', label: 'Home' },
    { href: 'explorer.html', label: 'Explorer' },
    { href: 'comparison.html', label: 'Compare' },
    { href: 'build_guide.html', label: 'Build Guide' },
    { href: 'components.html', label: 'Components' },
    { href: 'essentials.html', label: 'Essentials' },
    { href: 'buy_used.html', label: 'Buy Used' },
    { href: 'troubleshooting.html', label: 'Troubleshoot' }
];

// Inline SVG icons (stroke-based, inherit currentColor). The site deliberately uses no emoji.
const ICON_PATHS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    heart: '<path d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.5 6.6 4.5c2.1 0 3.5 1.2 5.4 3.2 1.9-2 3.3-3.2 5.4-3.2 3.6 0 5.4 3.7 3.8 6.9C19 15.6 12 20 12 20z"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/>',
    bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14.5h2"/>',
    feather: '<path d="M20 4c-7 0-13 5-13 13v3M7 17h7M10 13h7c1-2 2-5 3-9"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 015 5L9 22l-3-3L16.5 8.5zM4 4l4 4"/>',
    cpu: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.2"/>',
    lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};

function icon(name, cls = 'icon', { filled = false } = {}) {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}

const Storage = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Storage can be unavailable (private mode, blocked cookies); features degrade gracefully.
        }
    }
};

// A persisted list of laptop IDs. Changes fire `<event>` on document so pages can re-render.
function createIdList(key, event, max = Infinity) {
    return {
        KEY: key,
        MAX: max,
        ids() {
            const ids = Storage.get(key, []);
            return Array.isArray(ids) ? ids.filter(id => LaptopDB.get(id)) : [];
        },
        has(id) {
            return this.ids().includes(id);
        },
        // Returns false when the list is full and `id` couldn't be added.
        toggle(id) {
            let ids = this.ids();
            if (ids.includes(id)) {
                ids = ids.filter(x => x !== id);
            } else {
                if (ids.length >= max) return false;
                ids.push(id);
            }
            this.save(ids);
            return true;
        },
        save(ids) {
            Storage.set(key, ids.slice(0, max));
            document.dispatchEvent(new CustomEvent(event));
        },
        clear() {
            this.save([]);
        }
    };
}

const CompareStore = createIdList('compareLaptops', 'compare:change', 3);
const FavoriteStore = createIdList('favoriteLaptops', 'favorites:change');
const RecentStore = {
    ...createIdList('recentLaptops', 'recent:change', 6),
    // Most recent first; re-visiting moves a laptop to the front.
    add(id) {
        this.save([id, ...this.ids().filter(x => x !== id)]);
    }
};

const UI = {
    icon,

    escape(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },

    scoreClass(score) {
        if (score >= 9) return 'score-excellent';
        if (score >= 8) return 'score-good';
        if (score >= 7) return 'score-average';
        return 'score-poor';
    },

    scoreBar(score) {
        return `
            <div class="flex items-center gap-3">
                <div class="score-track" role="img" aria-label="Score ${score.toFixed(1)} out of 10">
                    <div class="score-fill ${this.scoreClass(score)}" style="width: ${score * 10}%"></div>
                </div>
                <span class="text-sm font-semibold tabular-nums">${score.toFixed(1)}</span>
            </div>`;
    },

    priorityTags(laptop) {
        return laptop.priority
            .map(p => `<span class="tag">${UI.escape(PRIORITY_LABELS[p] || p)}</span>`)
            .join('');
    },

    unverifiedBadge(laptop, path) {
        return LaptopDB.isUnverified(laptop, path)
            ? '<span class="badge-unverified" title="Not yet confirmed against a real build">Unverified</span>'
            : '';
    },

    macosRange(laptop) {
        const d = laptop.details;
        return `${UI.escape(d.minMacosSupport)} – ${UI.escape(d.maxMacosSupport)}`;
    },

    macosClass(text) {
        const index = LaptopDB.macosIndex(text);
        return index < 0 ? '' : 'macos-' + MACOS_VERSIONS[index].toLowerCase().replace(/\s+/g, '-');
    },

    // Stable hue per brand so every laptop from one maker shares a colour.
    // Major brands get hand-picked hues so they stay distinct; the rest are hashed.
    BRAND_HUES: { Lenovo: 352, Dell: 212, HP: 192, ASUS: 255, Acer: 145, MSI: 18, Huawei: 325, Xiaomi: 32, Samsung: 232, LG: 295, Razer: 115, Microsoft: 172, Gigabyte: 48, Toshiba: 275 },

    brandHue(brand) {
        if (brand in this.BRAND_HUES) return this.BRAND_HUES[brand];
        let h = 0;
        for (const c of String(brand)) h = (h * 31 + c.charCodeAt(0)) % 360;
        return (h + 200) % 360;
    },

    // Generated artwork for a laptop: brand-coloured gradient, outline icon, and model name.
    tile(laptop, { large = false } = {}) {
        const model = laptop.name.startsWith(laptop.brand) ? laptop.name.slice(laptop.brand.length).trim() : laptop.name;
        return `
            <div class="device-tile ${large ? 'aspect-[16/10] md:aspect-auto md:h-full' : 'aspect-[16/9]'}" style="--h: ${UI.brandHue(laptop.brand)}" aria-hidden="true">
                ${icon('laptop', large ? 'w-16 h-16 opacity-90' : 'w-10 h-10 opacity-90')}
                <span class="text-[0.7rem] font-semibold uppercase tracking-[0.2em] opacity-80">${UI.escape(laptop.brand)}</span>
                <span class="${large ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold leading-tight drop-shadow-sm">${UI.escape(model || laptop.name)}</span>
            </div>`;
    },

    favoriteButton(id, extra = '') {
        const on = FavoriteStore.has(id);
        return `
            <button type="button" class="icon-btn glass !w-9 !h-9 ${on ? 'text-pink-500' : 'text-gray-700 dark:text-gray-200'} ${extra}"
                    data-favorite-id="${UI.escape(id)}" aria-pressed="${on}" aria-label="${on ? 'Remove from favorites' : 'Add to favorites'}">
                ${icon('heart', 'w-4 h-4', { filled: on })}
            </button>`;
    },

    compareButtonContent(selected) {
        return selected ? `${icon('check')} Comparing` : `${icon('plus')} Compare`;
    },

    laptopCard(laptop, { compare = false } = {}) {
        const href = `laptop_detail.html?id=${encodeURIComponent(laptop.id)}`;
        const selected = compare && CompareStore.has(laptop.id);
        return `
            <article class="card overflow-hidden flex flex-col animate-in">
                <div class="relative">
                    <a href="${href}" class="block hover:opacity-95 transition-opacity" tabindex="-1">${UI.tile(laptop)}</a>
                    ${UI.favoriteButton(laptop.id, 'absolute top-3 right-3')}
                </div>
                <div class="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                    <div>
                        <h3 class="text-lg font-bold leading-snug">
                            <a href="${href}" class="hover:text-blue-600 dark:hover:text-blue-300">${UI.escape(laptop.name)}</a>
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">${UI.escape(laptop.summary)}</p>
                    </div>
                    ${UI.scoreBar(laptop.score)}
                    <dl class="text-sm grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
                        <dt class="text-gray-500 dark:text-gray-400">CPU</dt><dd class="truncate" title="${UI.escape(laptop.details.cpu)}">${UI.escape(laptop.details.cpu)}</dd>
                        <dt class="text-gray-500 dark:text-gray-400">GPU</dt><dd class="truncate">${UI.escape(laptop.details.igpu)}</dd>
                        <dt class="text-gray-500 dark:text-gray-400">macOS</dt><dd>${UI.macosRange(laptop)}${UI.unverifiedBadge(laptop, 'details.maxMacosSupport')}</dd>
                    </dl>
                    <div class="flex flex-wrap gap-1.5">${UI.priorityTags(laptop)}</div>
                    <div class="mt-auto pt-2 flex items-center gap-2">
                        <a href="${href}" class="btn-primary flex-1">Details</a>
                        ${compare ? `
                            <button type="button" class="chip" data-compare-id="${UI.escape(laptop.id)}" aria-pressed="${selected}">
                                ${UI.compareButtonContent(selected)}
                            </button>` : ''}
                    </div>
                </div>
            </article>`;
    },

    toast(message) {
        let el = document.getElementById('toast');
        if (!el) {
            el = Object.assign(document.createElement('div'), { id: 'toast', className: 'toast' });
            el.setAttribute('role', 'status');
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.hidden = false;
        clearTimeout(UI._toastTimer);
        UI._toastTimer = setTimeout(() => { el.hidden = true; }, 1800);
    },

    // Re-applies chart colours when the theme changes; pages register a callback.
    onThemeChange(callback) {
        document.addEventListener('theme:change', e => callback(e.detail.dark));
    },

    isDark() {
        return document.documentElement.classList.contains('dark');
    }
};

const Layout = (() => {
    function currentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    function headerHtml() {
        const page = currentPage();
        const active = href => (href === page ? ' active" aria-current="page' : '');
        return `
            <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-3 focus:left-3 btn-primary">Skip to content</a>
            <header class="sticky top-0 z-40 px-3 pt-3">
                <div class="glass rounded-[1.75rem] container mx-auto">
                    <nav class="px-3 sm:px-4 h-14 flex items-center gap-2" aria-label="Main">
                        <a href="index.html" class="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 shrink-0 pl-1">
                            ${icon('laptop', 'w-6 h-6')}
                            <span>Hackintosh<span class="hidden sm:inline"> Laptop</span> Guide</span>
                        </a>
                        <div class="hidden xl:flex items-center ml-2 2xl:ml-4 gap-0.5">
                            ${NAV_ITEMS.map(i => `<a href="${i.href}" class="nav-link${active(i.href)}">${i.label}</a>`).join('')}
                        </div>
                        <div class="ml-auto flex items-center gap-1">
                            <form class="hidden md:block xl:hidden 2xl:block relative" role="search" data-site-search>
                                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">${icon('search')}</span>
                                <input type="search" name="q" class="input !w-44 2xl:!w-56 !py-2 !rounded-full pl-10" placeholder="Find a laptop…" aria-label="Find a laptop">
                            </form>
                            <a href="index.html#favorites" class="icon-btn" aria-label="Favorites" title="Favorites">${icon('heart', 'w-5 h-5')}</a>
                            <button type="button" id="theme-toggle" class="icon-btn" aria-label="Toggle dark mode"></button>
                            <button type="button" id="menu-toggle" class="icon-btn xl:hidden" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">${icon('menu', 'w-6 h-6')}</button>
                        </div>
                    </nav>
                    <div id="mobile-menu" class="xl:hidden border-t border-white/40 dark:border-white/10 max-h-[calc(100vh-6rem)] overflow-y-auto" hidden>
                        <div class="px-3 sm:px-4 py-3 space-y-1">
                            <form class="md:hidden relative mb-3" role="search" data-site-search>
                                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">${icon('search')}</span>
                                <input type="search" name="q" class="input pl-10" placeholder="Find a laptop…" aria-label="Find a laptop">
                            </form>
                            ${NAV_ITEMS.map(i => `<a href="${i.href}" class="mobile-nav-link${active(i.href)}">${i.label}</a>`).join('')}
                        </div>
                    </div>
                </div>
            </header>`;
    }

    function footerHtml() {
        return `
            <footer class="mt-16 px-3 pb-3">
                <div class="glass rounded-[1.75rem] container mx-auto px-5 sm:px-8 py-8 text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <p>&copy; ${new Date().getFullYear()} Hackintosh Laptop Guide. For educational purposes only. Not affiliated with Apple.</p>
                    <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
                        ${NAV_ITEMS.slice(1).map(i => `<a href="${i.href}" class="hover:text-blue-600 dark:hover:text-blue-300">${i.label}</a>`).join('')}
                    </nav>
                </div>
            </footer>`;
    }

    function initTheme() {
        const button = document.getElementById('theme-toggle');
        const render = () => {
            const dark = UI.isDark();
            button.innerHTML = icon(dark ? 'sun' : 'moon', 'w-5 h-5');
            button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        };
        button.addEventListener('click', () => {
            const dark = document.documentElement.classList.toggle('dark');
            try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
            render();
            document.dispatchEvent(new CustomEvent('theme:change', { detail: { dark } }));
        });
        render();
    }

    function initMenu() {
        const toggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('mobile-menu');
        const setOpen = open => {
            menu.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            toggle.innerHTML = icon(open ? 'close' : 'menu', 'w-6 h-6');
        };
        toggle.addEventListener('click', () => setOpen(menu.hidden));
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !menu.hidden) {
                setOpen(false);
                toggle.focus();
            }
        });
        window.matchMedia('(min-width: 1280px)').addEventListener('change', e => {
            if (e.matches) setOpen(false);
        });
    }

    function initSearch() {
        document.querySelectorAll('[data-site-search]').forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const q = form.q.value.trim();
                window.location.href = q ? `explorer.html?search=${encodeURIComponent(q)}` : 'explorer.html';
            });
        });

        // "/" focuses the visible search box, like many docs sites.
        document.addEventListener('keydown', e => {
            if (e.key !== '/' || e.target.closest('input, textarea, select, [contenteditable]')) return;
            const input = [...document.querySelectorAll('input[type="search"]')].find(el => el.offsetParent !== null);
            if (input) {
                e.preventDefault();
                input.focus();
            }
        });
    }

    // Favorite and compare buttons work the same on every page, so handle them once here.
    function initListButtons() {
        document.addEventListener('click', e => {
            const fav = e.target.closest('[data-favorite-id]');
            if (fav) {
                const id = fav.dataset.favoriteId;
                FavoriteStore.toggle(id);
                const on = FavoriteStore.has(id);
                fav.setAttribute('aria-pressed', String(on));
                fav.setAttribute('aria-label', on ? 'Remove from favorites' : 'Add to favorites');
                fav.classList.toggle('text-pink-500', on);
                fav.classList.toggle('text-gray-700', !on);
                fav.classList.toggle('dark:text-gray-200', !on);
                fav.innerHTML = icon('heart', 'w-4 h-4', { filled: on });
                UI.toast(on ? 'Added to favorites' : 'Removed from favorites');
                return;
            }

            const cmp = e.target.closest('[data-compare-id]');
            if (cmp) {
                const id = cmp.dataset.compareId;
                if (!CompareStore.toggle(id)) {
                    UI.toast(`You can compare up to ${CompareStore.MAX} laptops`);
                    return;
                }
                const on = CompareStore.has(id);
                cmp.setAttribute('aria-pressed', String(on));
                cmp.innerHTML = UI.compareButtonContent(on);
                UI.toast(on ? 'Added to comparison' : 'Removed from comparison');
            }
        });
    }

    function init() {
        const header = document.getElementById('site-header');
        const footer = document.getElementById('site-footer');
        if (header) header.outerHTML = headerHtml();
        if (footer) footer.outerHTML = footerHtml();
        if (document.getElementById('theme-toggle')) {
            initTheme();
            initMenu();
            initSearch();
        }
        initListButtons();
    }

    return { init };
})();

Layout.init();
