const LaptopDetailPage = (() => {
    const esc = UI.escape;

    // Renders a <dl> of [label, value, verificationPath] rows, skipping empty values.
    function specList(laptop, rows) {
        const items = rows
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([label, value, path]) => `
                <div class="spec-row">
                    <dt>${esc(label)}</dt>
                    <dd>${formatValue(value)}${path ? UI.unverifiedBadge(laptop, path) : ''}</dd>
                </div>`)
            .join('');
        return `<dl class="spec-list">${items}</dl>`;
    }

    function formatValue(value) {
        if (Array.isArray(value)) return value.map(esc).join(', ');
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        return esc(value);
    }

    function macosChip(label, value) {
        if (!value) return '';
        return `<span class="spec-chip"><span class="text-gray-600 dark:text-gray-300">${esc(label)}</span><span class="spec-chip-value ${UI.macosClass(value)}">${esc(value)}</span></span>`;
    }

    // Groups free-text port entries ("2x USB 3.1 Gen 1", "HDMI 1.4b") into type counts.
    function portType(entry) {
        const e = entry.toLowerCase();
        if (e.includes('thunderbolt')) return 'Thunderbolt';
        if (e.includes('usb-c') || e.includes('type-c') || e.includes('usb c')) return 'USB-C';
        if (e.includes('usb')) return 'USB-A';
        if (e.includes('hdmi')) return 'HDMI';
        if (e.includes('displayport') || e.includes('mini dp')) return 'DisplayPort';
        if (e.includes('ethernet') || e.includes('rj45')) return 'Ethernet';
        if (e.includes('microsd') || e.includes('micro sd')) return 'microSD';
        if (/\bsd\b/.test(e)) return 'SD card';
        if (e.includes('audio') || e.includes('headphone')) return 'Audio jack';
        return null;
    }

    function portSummary(ports) {
        const counts = {};
        Object.values(ports).flat().filter(Boolean).forEach(entry => {
            String(entry).split(/,\s*/).forEach(part => {
                const type = portType(part);
                if (!type || /^none/i.test(part)) return;
                const m = part.match(/(\d+)\s*x/i);
                counts[type] = (counts[type] || 0) + (m ? parseInt(m[1], 10) : 1);
            });
        });
        const entries = Object.entries(counts);
        if (!entries.length) return '';
        return `<div class="flex flex-wrap gap-2 mb-3">${entries.map(([type, n]) =>
            `<span class="spec-chip !pr-3">${esc(type)}${n > 1 ? `<span class="spec-chip-value !px-2">&times;${n}</span>` : ''}</span>`).join('')}</div>`;
    }

    function section(title, body, extraClass = '') {
        return `
            <section class="card p-5 ${extraClass}">
                <h2 class="section-title">${esc(title)}</h2>
                ${body}
            </section>`;
    }

    function linkLabel(url) {
        try {
            const u = new URL(url);
            return u.hostname === 'github.com' ? `GitHub: ${u.pathname.slice(1)}` : u.hostname + u.pathname.replace(/\/$/, '');
        } catch (e) {
            return url;
        }
    }

    function render(laptop) {
        const d = laptop.details;
        const ports = d.ports || {};
        const display = d.displayFeatures || {};
        const battery = d.batteryLife || {};
        const thermals = d.thermals || {};
        const keyboard = d.keyboard || {};
        const bios = d.biosVersion || {};
        const community = d.communitySupport || {};
        const guides = d.guides || {};
        const guideLinks = [guides.installation, ...(guides.additional || [])].filter(Boolean);
        const dims = d.dimensions ? `${d.dimensions.width} × ${d.dimensions.depth} × ${d.dimensions.height}` : '';

        document.title = `${laptop.name} - Hackintosh Laptop Guide`;

        return `
            <div class="card overflow-hidden md:grid md:grid-cols-2 animate-in">
                ${UI.tile(laptop, { large: true })}
                <div class="p-5 sm:p-8 flex flex-col gap-4">
                    <div>
                        <p class="eyebrow">${esc(laptop.brand)}</p>
                        <h1 class="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">${esc(laptop.name)}</h1>
                        <p class="mt-2 text-gray-600 dark:text-gray-300">${esc(laptop.summary)}</p>
                    </div>
                    <div class="max-w-xs">${UI.scoreBar(laptop.score)}</div>
                    <div class="flex flex-wrap gap-1.5">${UI.priorityTags(laptop)}</div>
                    <div class="flex flex-wrap gap-2">
                        ${macosChip('Oldest', d.minMacosSupport)}
                        ${macosChip('Newest', d.maxMacosSupport)}
                        ${UI.unverifiedBadge(laptop, 'details.maxMacosSupport')}
                    </div>
                    <div class="flex flex-wrap items-center gap-2 mt-auto pt-2">
                        <button type="button" class="chip" data-compare-id="${esc(laptop.id)}" aria-pressed="${CompareStore.has(laptop.id)}">${UI.compareButtonContent(CompareStore.has(laptop.id))}</button>
                        <button type="button" class="chip" id="copy-link">${icon('link')} Copy link</button>
                        ${UI.favoriteButton(laptop.id)}
                        <a href="comparison.html" id="compare-link" class="btn-primary" hidden>Open comparison ${icon('arrowRight')}</a>
                    </div>
                </div>
            </div>

            ${laptop.source === 'community' ? `
                <div class="callout callout-info mt-6">
                    <p><strong>Community data.</strong> This laptop comes from a community-submitted list. Its specs describe a typical configuration, and its ratings are estimated from that list's compatibility score. Double-check everything for your exact model.</p>
                </div>` : laptop.needsVerification && laptop.needsVerification.length ? `
                <div class="callout callout-warn mt-6">
                    <p>Fields marked <span class="badge-unverified !ml-0">Unverified</span> come from typical configurations and haven't been confirmed against a working build yet. Check them for your exact model before buying.</p>
                </div>` : ''}

            <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
                ${section('Ratings', '<div class="relative h-72"><canvas id="rating-chart" aria-label="Ratings radar chart" role="img"></canvas></div>')}

                ${section('Hardware', specList(laptop, [
                    ['CPU', d.cpu, 'details.cpu'],
                    ['iGPU', d.igpu, 'details.igpu'],
                    ['dGPU', d.dgpu, 'details.dgpu'],
                    ['RAM', d.ram, 'details.ram'],
                    ['Storage', d.storage, 'details.storage'],
                    ['Wi-Fi / Bluetooth', d.wifiBluetooth, 'details.wifiBluetooth'],
                    ['Audio codec', d.audioCodec, 'details.audioCodec'],
                    ['Trackpad', d.trackpad, 'details.trackpad']
                ]), 'lg:col-span-2')}

                ${section('macOS compatibility', specList(laptop, [
                    ['Oldest', d.minMacosSupport, 'details.minMacosSupport'],
                    ['Newest', d.maxMacosSupport, 'details.maxMacosSupport'],
                    ['Commonly run', d.macosSupport, 'details.macosSupport'],
                    ['BIOS', bios.recommended, 'details.biosVersion'],
                    ['BIOS notes', bios.notes, 'details.biosVersion']
                ]))}

                ${section('Known issues', `
                    <ul class="list-disc pl-5 space-y-1.5 text-sm">
                        ${(d.knownIssues || ['None documented']).map(i => `<li>${esc(i)}</li>`).join('')}
                    </ul>`)}

                ${section('Install guides', guideLinks.length ? `
                    <ul class="space-y-2 text-sm">
                        ${guideLinks.map(url => `<li><a href="${esc(url)}" target="_blank" rel="noopener" class="text-blue-700 dark:text-blue-300 hover:underline break-all">${esc(linkLabel(url))} ${icon('external', 'icon w-3.5 h-3.5')}</a></li>`).join('')}
                    </ul>
                    ${community.rating ? `<p class="mt-4 text-sm"><span class="text-gray-500 dark:text-gray-400">Community support:</span> <strong>${esc(community.rating)}</strong></p>` : ''}
                    ${community.resources ? `<ul class="mt-1 list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">${community.resources.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
                ` : '<p class="text-sm">No model-specific guide yet. Start with the <a class="text-blue-700 dark:text-blue-300 hover:underline" href="build_guide.html">Build Guide</a>.</p>')}

                ${section('Display', specList(laptop, [
                    ['Resolution', d.screenResolution, 'details.screenResolution'],
                    ['Panel type', display.type, 'details.displayFeatures'],
                    ['Brightness', display.brightness, 'details.displayFeatures'],
                    ['Color gamut', display.colorGamut, 'details.displayFeatures'],
                    ['Touchscreen', display.touchscreen, 'details.displayFeatures']
                ]))}

                ${section('Ports', portSummary(ports) + specList(laptop, [
                    ['USB', ports.usb, 'details.ports'],
                    ['Thunderbolt', ports.thunderbolt, 'details.ports'],
                    ['Video', ports.video, 'details.ports'],
                    ['Network', ports.network, 'details.ports'],
                    ['Other', ports.others, 'details.ports']
                ]))}

                ${section('Battery & build', specList(laptop, [
                    ['Battery life', battery.average, 'details.batteryLife'],
                    ['Capacity', battery.capacity, 'details.batteryLife'],
                    ['Weight', d.weight, 'details.weight'],
                    ['Dimensions', dims, 'details.dimensions'],
                    ['Keyboard', keyboard.type ? `${keyboard.type}${keyboard.backlit ? ', backlit' : ''}` : '', 'details.keyboard']
                ]))}

                ${section('Thermals', specList(laptop, [
                    ['Idle', thermals.idleTemp, 'details.thermals'],
                    ['Load', thermals.loadTemp, 'details.thermals'],
                    ['Cooling', thermals.coolingSystem, 'details.thermals'],
                    ['Undervolting', thermals.undervolting, 'details.thermals']
                ]))}
            </div>`;
    }

    function renderNotFound(id) {
        return `
            <div class="card p-8 text-center">
                <h1 class="text-2xl font-bold">Laptop not found</h1>
                <p class="mt-2 text-gray-600 dark:text-gray-300">${id ? `There's no laptop with the ID “${esc(id)}”.` : 'No laptop was specified.'}</p>
                <a href="explorer.html" class="btn-primary mt-6">Browse all laptops</a>
            </div>`;
    }

    function updateCompareLink() {
        document.getElementById('compare-link').hidden = CompareStore.ids().length < 2;
    }

    function init() {
        const id = new URLSearchParams(location.search).get('id');
        const laptop = id && LaptopDB.get(id);
        const container = document.getElementById('laptop-detail');

        if (!laptop) {
            container.innerHTML = renderNotFound(id);
            return;
        }

        container.innerHTML = render(laptop);
        RecentStore.add(id);
        updateCompareLink();
        document.addEventListener('compare:change', updateCompareLink);

        document.getElementById('copy-link').addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(location.href);
                UI.toast('Link copied');
            } catch (e) {
                UI.toast('Copy failed. Use your browser\'s share menu instead.');
            }
        });

        // Chart.js is deferred, so wait for it before drawing.
        window.addEventListener('load', () => ChartManager.radar(document.getElementById('rating-chart'), [laptop]));
    }

    return { init };
})();

LaptopDetailPage.init();
