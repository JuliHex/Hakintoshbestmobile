const ComparisonPage = (() => {
    const esc = UI.escape;
    let chart = null;

    // [label, getter, verificationPath]
    const ROWS = [
        ['Score', l => `${l.score.toFixed(1)} / 10`],
        ['Best for', l => l.priority.map(p => PRIORITY_LABELS[p] || p).join(', ')],
        ['macOS', l => `${l.details.minMacosSupport} – ${l.details.maxMacosSupport}`, 'details.maxMacosSupport'],
        ['CPU', l => l.details.cpu, 'details.cpu'],
        ['iGPU', l => l.details.igpu, 'details.igpu'],
        ['dGPU', l => l.details.dgpu || 'None', 'details.dgpu'],
        ['RAM', l => l.details.ram, 'details.ram'],
        ['Storage', l => l.details.storage, 'details.storage'],
        ['Wi-Fi / BT', l => l.details.wifiBluetooth, 'details.wifiBluetooth'],
        ['Audio', l => l.details.audioCodec, 'details.audioCodec'],
        ['Trackpad', l => l.details.trackpad, 'details.trackpad'],
        ['Display', l => l.details.screenResolution, 'details.screenResolution'],
        ['Battery', l => l.details.batteryLife && l.details.batteryLife.average, 'details.batteryLife'],
        ['Weight', l => l.details.weight, 'details.weight'],
        ['Thunderbolt', l => l.details.ports && l.details.ports.thunderbolt, 'details.ports'],
        ['Known issues', l => (l.details.knownIssues || []).join('; ')],
        ['Community', l => l.details.communitySupport && l.details.communitySupport.rating]
    ];

    function selectedIds() {
        return CompareStore.ids();
    }

    function renderPickers() {
        const ids = selectedIds();
        const options = LaptopDB.all().sort((a, b) => a.name.localeCompare(b.name));
        document.getElementById('pickers').innerHTML = [0, 1, 2].map(slot => `
            <div>
                <label for="pick-${slot}" class="label">Laptop ${slot + 1}</label>
                <select id="pick-${slot}" class="input" data-slot="${slot}">
                    <option value="">— None —</option>
                    ${options.map(l => `<option value="${esc(l.id)}" ${ids[slot] === l.id ? 'selected' : ''} ${ids.includes(l.id) && ids[slot] !== l.id ? 'disabled' : ''}>${esc(l.name)}</option>`).join('')}
                </select>
            </div>`).join('');
    }

    function renderTable(laptops) {
        const head = `
            <thead class="bg-white/40 dark:bg-white/5">
                <tr>
                    <th scope="col" class="sticky left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur w-28 sm:w-40"><span class="sr-only">Spec</span></th>
                    ${laptops.map(l => `
                        <th scope="col" class="min-w-[12rem]">
                            <a href="laptop_detail.html?id=${encodeURIComponent(l.id)}" class="font-semibold text-blue-700 dark:text-blue-300 hover:underline">${esc(l.name)}</a>
                        </th>`).join('')}
                </tr>
            </thead>`;
        const body = ROWS.map(([label, get, path]) => `
            <tr class="border-t border-gray-900/5 dark:border-white/10">
                <th scope="row" class="sticky left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur font-medium text-gray-500 dark:text-gray-400">${esc(label)}</th>
                ${laptops.map(l => `<td>${esc(get(l) || '—')}${path ? UI.unverifiedBadge(l, path) : ''}</td>`).join('')}
            </tr>`).join('');
        document.getElementById('compare-table').innerHTML = head + `<tbody>${body}</tbody>`;
    }

    function renderChart(laptops) {
        if (chart) chart.destroy();
        chart = ChartManager.radar(document.getElementById('compare-chart'), laptops);
    }

    function render() {
        const laptops = selectedIds().map(id => LaptopDB.get(id));
        const enough = laptops.length >= 2;
        document.getElementById('compare-empty').hidden = enough;
        document.getElementById('compare-results').hidden = !enough;

        const params = laptops.length ? `?ids=${laptops.map(l => encodeURIComponent(l.id)).join(',')}` : location.pathname;
        history.replaceState(null, '', params);

        renderPickers();
        if (!enough) return;
        renderTable(laptops);
        if (typeof Chart !== 'undefined') renderChart(laptops);
    }

    function init() {
        // A shared link (?ids=a,b) takes precedence over this device's saved picks.
        const fromUrl = (new URLSearchParams(location.search).get('ids') || '').split(',').filter(id => LaptopDB.get(id));
        if (fromUrl.length) CompareStore.save([...new Set(fromUrl)]);

        document.getElementById('pickers').addEventListener('change', e => {
            const slot = Number(e.target.dataset.slot);
            const ids = selectedIds();
            ids[slot] = e.target.value;
            CompareStore.save(ids.filter(Boolean));
            render();
        });

        render();
        window.addEventListener('load', () => {
            const laptops = selectedIds().map(id => LaptopDB.get(id));
            if (laptops.length >= 2) renderChart(laptops);
        });
    }

    return { init };
})();

ComparisonPage.init();
