const HomePage = (() => {
    const esc = UI.escape;
    const laptops = LaptopDB.all().sort((a, b) => b.score - a.score);
    const el = id => document.getElementById(id);

    const PRIORITY_ICONS = { ease: 'shield', performance: 'bolt', budget: 'wallet', portability: 'feather', stability: 'star' };

    const STEPS = [
        ['cpu', 'Pick compatible hardware', 'Intel 8th–10th gen, Intel graphics, and a Wi-Fi card macOS can drive.', 'components.html'],
        ['wrench', 'Set up BIOS and USB', 'Turn off Secure Boot and CSM, then make an OpenCore installer stick.', 'build_guide.html#bios'],
        ['laptop', 'Install macOS', 'Boot the stick with verbose logging on and install to an APFS drive.', 'build_guide.html#install'],
        ['star', 'Tune it', 'Map USB ports and fix audio, sleep, brightness and battery reporting.', 'build_guide.html#post-install']
    ];

    const GUIDES = [
        ['book', 'Build Guide', 'From BIOS settings to a working EFI, step by step.', 'build_guide.html'],
        ['cpu', 'Component Checker', 'Which CPUs, GPUs, Wi-Fi cards and SSDs work.', 'components.html'],
        ['tag', 'Buying Used', 'Where to look and what to check before paying.', 'buy_used.html'],
        ['lifebuoy', 'Troubleshooting', 'Fixes for boot hangs, sleep, Wi-Fi, audio and more.', 'troubleshooting.html']
    ];

    function renderHero() {
        el('laptop-count').textContent = laptops.length;
        el('explore-cta').insertAdjacentHTML('beforeend', icon('arrowRight', 'w-5 h-5'));
        el('hero-search-icon').innerHTML = icon('search', 'w-5 h-5');
        el('hero-priorities').innerHTML = Object.entries(PRIORITY_LABELS)
            .map(([key, label]) => `<a href="explorer.html?priority=${key}" class="chip">${icon(PRIORITY_ICONS[key])}${esc(label)}</a>`)
            .join('');
    }

    function renderStats() {
        const brands = LaptopDB.brands().length;
        const recommended = laptops.filter(l => l.score >= 8.5).length;
        const sonoma = laptops.filter(l => LaptopDB.supportsMacos(l, 'Sonoma')).length;
        const stats = [
            [laptops.length, 'laptops rated'],
            [brands, 'brands covered'],
            [recommended, 'scored 8.5 or higher'],
            [sonoma, 'reported to run Sonoma']
        ];
        el('stats').innerHTML = stats.map(([value, label]) => `
            <div class="card p-4 sm:p-5">
                <p class="text-3xl sm:text-4xl font-bold tabular-nums bg-gradient-to-br from-blue-600 to-violet-600 dark:from-blue-300 dark:to-violet-300 bg-clip-text text-transparent">${value}</p>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">${label}</p>
            </div>`).join('');
    }

    function renderBestPicks() {
        const used = new Set();
        el('best-picks').innerHTML = ['ease', 'performance', 'budget', 'portability'].map(priority => {
            const pick = laptops.find(l => l.priority.includes(priority) && !used.has(l.id));
            if (!pick) return '';
            used.add(pick.id);
            return `
                <a href="laptop_detail.html?id=${encodeURIComponent(pick.id)}" class="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
                    <span class="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">${icon(PRIORITY_ICONS[priority], 'w-5 h-5')}Best for ${esc(PRIORITY_LABELS[priority].toLowerCase())}</span>
                    <span class="text-lg font-bold leading-snug">${esc(pick.name)}</span>
                    <span class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">${esc(pick.summary)}</span>
                    <span class="mt-auto">${UI.scoreBar(pick.score)}</span>
                </a>`;
        }).join('');
    }

    function renderSaved() {
        const favorites = FavoriteStore.ids().map(id => LaptopDB.get(id));
        el('favorites').hidden = favorites.length === 0;
        el('favorite-laptops').innerHTML = favorites.map(l => UI.laptopCard(l, { compare: true })).join('');

        const recent = RecentStore.ids().map(id => LaptopDB.get(id));
        el('recent').hidden = recent.length === 0;
        el('recent-laptops').innerHTML = recent.map(l => `
            <a href="laptop_detail.html?id=${encodeURIComponent(l.id)}" class="card overflow-hidden shrink-0 w-56 snap-start">
                ${UI.tile(l)}
                <span class="block px-4 py-3 text-sm font-semibold truncate">${esc(l.name)}</span>
            </a>`).join('');

        el('no-favorites').hidden = favorites.length > 0 || recent.length > 0;
    }

    function renderCoverage() {
        const versions = MACOS_VERSIONS.slice(MACOS_VERSIONS.indexOf('Catalina'));
        const counts = versions.map(v => [v, laptops.filter(l => LaptopDB.supportsMacos(l, v)).length]);
        const max = Math.max(1, ...counts.map(([, n]) => n));
        el('macos-coverage').innerHTML = counts.map(([version, n]) => `
            <li>
                <a href="explorer.html?macos=${encodeURIComponent(version)}" class="grid grid-cols-[6rem,1fr,2.5rem] items-center gap-3 group">
                    <span class="text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">${esc(version)}</span>
                    <span class="score-track !h-3"><span class="score-fill block ${UI.macosClass(version)}" style="width: ${(n / max) * 100}%"></span></span>
                    <span class="text-sm tabular-nums text-right text-gray-600 dark:text-gray-300">${n}</span>
                </a>
            </li>`).join('');
    }

    function renderBrands() {
        el('brand-list').innerHTML = LaptopDB.brands().map(brand => {
            const n = laptops.filter(l => l.brand === brand).length;
            return `<a href="explorer.html?brand=${encodeURIComponent(brand)}" class="chip">
                <span class="w-2.5 h-2.5 rounded-full" style="background: hsl(${UI.brandHue(brand)} 70% 52%)"></span>${esc(brand)}
                <span class="text-xs text-gray-500 dark:text-gray-400 tabular-nums">${n}</span></a>`;
        }).join('');
    }

    function renderStaticSections() {
        el('top-laptops').innerHTML = laptops.slice(0, 6).map(l => UI.laptopCard(l, { compare: true })).join('');
        el('see-all-link').insertAdjacentHTML('beforeend', icon('arrowRight'));
        el('favorites-link').insertAdjacentHTML('beforeend', icon('arrowRight'));

        el('steps').innerHTML = STEPS.map(([ic, title, text, href], i) => `
            <li class="card p-5">
                <a href="${href}" class="flex flex-col gap-3 h-full">
                    <span class="flex items-center justify-between">
                        <span class="w-10 h-10 rounded-2xl glass flex items-center justify-center text-blue-700 dark:text-blue-300">${icon(ic, 'w-5 h-5')}</span>
                        <span class="text-sm font-semibold text-gray-400 tabular-nums">0${i + 1}</span>
                    </span>
                    <span class="font-semibold">${title}</span>
                    <span class="text-sm text-gray-600 dark:text-gray-300">${text}</span>
                </a>
            </li>`).join('');

        el('guides').innerHTML = GUIDES.map(([ic, title, text, href]) => `
            <a href="${href}" class="card p-5 flex gap-4 items-start hover:-translate-y-0.5 transition-transform">
                <span class="w-10 h-10 shrink-0 rounded-2xl glass flex items-center justify-center text-blue-700 dark:text-blue-300">${icon(ic, 'w-5 h-5')}</span>
                <span>
                    <span class="block font-semibold">${title}</span>
                    <span class="block mt-1 text-sm text-gray-600 dark:text-gray-300">${text}</span>
                </span>
            </a>`).join('');

        document.querySelectorAll('[data-chevron]').forEach(span => { span.outerHTML = icon('chevron', 'chevron w-4 h-4'); });
    }

    function init() {
        renderHero();
        renderStats();
        renderBestPicks();
        renderSaved();
        renderStaticSections();
        renderCoverage();
        renderBrands();
        document.addEventListener('favorites:change', renderSaved);
    }

    return { init };
})();

HomePage.init();
