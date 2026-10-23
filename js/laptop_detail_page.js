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
                <img src="${esc(laptop.image)}" alt="" width="600" height="400" class="w-full h-full aspect-[3/2] object-cover bg-gray-100 dark:bg-gray-700">
                <div class="p-5 sm:p-8 flex flex-col gap-4">
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">${esc(laptop.name)}</h1>
                        <p class="mt-2 text-gray-600 dark:text-gray-300">${esc(laptop.summary)}</p>
                    </div>
                    <div class="max-w-xs">${UI.scoreBar(laptop.score)}</div>
                    <div class="flex flex-wrap gap-1.5">${UI.priorityTags(laptop)}</div>
                    <p class="text-sm"><span class="text-gray-500 dark:text-gray-400">macOS:</span> <strong>${UI.macosRange(laptop)}</strong>${UI.unverifiedBadge(laptop, 'details.maxMacosSupport')}</p>
                    <div class="flex flex-wrap gap-2 mt-auto">
                        <button type="button" id="compare-toggle" class="chip" aria-pressed="false"></button>
                        <a href="comparison.html" id="compare-link" class="btn-secondary" hidden>Open comparison &rarr;</a>
                    </div>
                </div>
            </div>

            ${laptop.needsVerification && laptop.needsVerification.length ? `
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
                        ${guideLinks.map(url => `<li><a href="${esc(url)}" target="_blank" rel="noopener" class="text-primary dark:text-blue-300 hover:underline break-all">${esc(linkLabel(url))} ↗</a></li>`).join('')}
                    </ul>
                    ${community.rating ? `<p class="mt-4 text-sm"><span class="text-gray-500 dark:text-gray-400">Community support:</span> <strong>${esc(community.rating)}</strong></p>` : ''}
                    ${community.resources ? `<ul class="mt-1 list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">${community.resources.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
                ` : '<p class="text-sm">No model-specific guide yet. Start with the <a class="text-primary hover:underline" href="build_guide.html">Build Guide</a>.</p>')}

                ${section('Display', specList(laptop, [
                    ['Resolution', d.screenResolution, 'details.screenResolution'],
                    ['Panel type', display.type, 'details.displayFeatures'],
                    ['Brightness', display.brightness, 'details.displayFeatures'],
                    ['Color gamut', display.colorGamut, 'details.displayFeatures'],
                    ['Touchscreen', display.touchscreen, 'details.displayFeatures']
                ]))}

                ${section('Ports', specList(laptop, [
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

    function updateCompareButton(id) {
        const button = document.getElementById('compare-toggle');
        const selected = CompareStore.has(id);
        button.setAttribute('aria-pressed', String(selected));
        button.textContent = selected ? '✓ In comparison' : '+ Add to comparison';
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
        updateCompareButton(id);
        document.getElementById('compare-toggle').addEventListener('click', () => {
            if (!CompareStore.toggle(id)) {
                alert(`You can compare up to ${CompareStore.MAX} laptops. Remove one on the Compare page first.`);
            }
            updateCompareButton(id);
        });

        // Chart.js is deferred, so wait for it before drawing.
        window.addEventListener('load', () => ChartManager.radar(document.getElementById('rating-chart'), [laptop]));
    }

    return { init };
})();

LaptopDetailPage.init();
