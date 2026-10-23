// Shared site chrome (header, footer, theme toggle) and rendering helpers used by every page.
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

const ICONS = {
    menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>',
    close: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
    sun: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>',
    search: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M20 20l-3.5-3.5"/></svg>'
};

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

// Laptops picked for side-by-side comparison, persisted across pages.
const CompareStore = {
    KEY: 'compareLaptops',
    MAX: 3,
    ids() {
        const ids = Storage.get(this.KEY, []);
        return Array.isArray(ids) ? ids.filter(id => typeof LaptopDB === 'undefined' || LaptopDB.get(id)) : [];
    },
    has(id) {
        return this.ids().includes(id);
    },
    toggle(id) {
        let ids = this.ids();
        if (ids.includes(id)) {
            ids = ids.filter(x => x !== id);
        } else {
            if (ids.length >= this.MAX) return false;
            ids.push(id);
        }
        this.save(ids);
        return true;
    },
    save(ids) {
        Storage.set(this.KEY, ids.slice(0, this.MAX));
        document.dispatchEvent(new CustomEvent('compare:change'));
    },
    clear() {
        this.save([]);
    }
};

const UI = {
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

    laptopCard(laptop, { compare = false } = {}) {
        const selected = compare && CompareStore.has(laptop.id);
        return `
            <article class="card overflow-hidden flex flex-col animate-in">
                <a href="laptop_detail.html?id=${encodeURIComponent(laptop.id)}" class="block group">
                    <img src="${UI.escape(laptop.image)}" alt="" loading="lazy" width="600" height="400"
                         class="w-full aspect-[3/2] object-cover bg-gray-100 dark:bg-gray-700 group-hover:opacity-90 transition-opacity">
                </a>
                <div class="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                    <div>
                        <h3 class="text-lg font-bold leading-snug">
                            <a href="laptop_detail.html?id=${encodeURIComponent(laptop.id)}" class="hover:text-primary">${UI.escape(laptop.name)}</a>
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">${UI.escape(laptop.summary)}</p>
                    </div>
                    ${UI.scoreBar(laptop.score)}
                    <dl class="text-sm grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
                        <dt class="text-gray-500 dark:text-gray-400">CPU</dt><dd class="truncate" title="${UI.escape(laptop.details.cpu)}">${UI.escape(laptop.details.cpu)}</dd>
                        <dt class="text-gray-500 dark:text-gray-400">GPU</dt><dd class="truncate">${UI.escape(laptop.details.igpu)}</dd>
                        <dt class="text-gray-500 dark:text-gray-400">macOS</dt><dd>${UI.macosRange(laptop)}${UI.unverifiedBadge(laptop, 'details.maxMacosSupport')}</dd>
                    </dl>
                    <div class="flex flex-wrap gap-1.5">${UI.priorityTags(laptop)}</div>
                    <div class="mt-auto pt-2 flex items-center gap-2">
                        <a href="laptop_detail.html?id=${encodeURIComponent(laptop.id)}" class="btn-primary flex-1">Details</a>
                        ${compare ? `
                            <button type="button" class="chip" data-compare-id="${UI.escape(laptop.id)}" aria-pressed="${selected}">
                                ${selected ? '✓ Comparing' : '+ Compare'}
                            </button>` : ''}
                    </div>
                </div>
            </article>`;
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
            <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 btn-primary">Skip to content</a>
            <header class="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
                <nav class="container mx-auto px-4 sm:px-6 h-16 flex items-center gap-3" aria-label="Main">
                    <a href="index.html" class="flex items-center gap-2 font-bold text-primary dark:text-blue-300 shrink-0">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1.5"/><path stroke-linecap="round" d="M2 19h20"/></svg>
                        <span class="text-lg">Hackintosh<span class="hidden sm:inline"> Laptop</span> Guide</span>
                    </a>
                    <div class="hidden xl:flex items-center ml-2 2xl:ml-4 2xl:gap-1">
                        ${NAV_ITEMS.map(i => `<a href="${i.href}" class="nav-link${active(i.href)}">${i.label}</a>`).join('')}
                    </div>
                    <div class="ml-auto flex items-center gap-1">
                        <form class="hidden md:block relative" role="search" data-site-search>
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${ICONS.search}</span>
                            <input type="search" name="q" class="input !w-44 2xl:!w-56 !py-2 pl-9" placeholder="Find a laptop…" aria-label="Find a laptop">
                        </form>
                        <button type="button" id="theme-toggle" class="icon-btn" aria-label="Toggle dark mode"></button>
                        <button type="button" id="menu-toggle" class="icon-btn xl:hidden" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">${ICONS.menu}</button>
                    </div>
                </nav>
                <div id="mobile-menu" class="xl:hidden border-t border-gray-200 dark:border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto" hidden>
                    <div class="container mx-auto px-4 sm:px-6 py-4 space-y-1">
                        <form class="md:hidden relative mb-3" role="search" data-site-search>
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${ICONS.search}</span>
                            <input type="search" name="q" class="input pl-9" placeholder="Find a laptop…" aria-label="Find a laptop">
                        </form>
                        ${NAV_ITEMS.map(i => `<a href="${i.href}" class="mobile-nav-link${active(i.href)}">${i.label}</a>`).join('')}
                    </div>
                </div>
            </header>`;
    }

    function footerHtml() {
        return `
            <footer class="mt-16 border-t border-gray-200 dark:border-gray-700">
                <div class="container mx-auto px-4 sm:px-6 py-8 text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <p>&copy; ${new Date().getFullYear()} Hackintosh Laptop Guide. For educational purposes only. Not affiliated with Apple.</p>
                    <nav class="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
                        ${NAV_ITEMS.slice(1).map(i => `<a href="${i.href}" class="hover:text-primary">${i.label}</a>`).join('')}
                    </nav>
                </div>
            </footer>`;
    }

    function initTheme() {
        const button = document.getElementById('theme-toggle');
        const render = () => {
            const dark = UI.isDark();
            button.innerHTML = dark ? ICONS.sun : ICONS.moon;
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
            toggle.innerHTML = open ? ICONS.close : ICONS.menu;
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
    }

    return { init };
})();

Layout.init();
