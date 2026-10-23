const ComponentsPage = (() => {
    const esc = UI.escape;
    const STATUS_LABELS = { good: 'Recommended', mid: 'Works with effort', bad: 'Avoid' };
    const keys = Object.keys(componentData);

    function tabId(key) {
        return `tab-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    }

    function renderContent(key) {
        const component = componentData[key];
        const panel = document.getElementById('component-content');
        panel.setAttribute('aria-labelledby', tabId(key));
        panel.innerHTML = `
            <p class="mb-5 text-gray-700 dark:text-gray-300 max-w-3xl">${esc(component.intro)}</p>
            <ul class="grid gap-3 md:grid-cols-2">
                ${component.items.map(item => `
                    <li class="card p-4 flex gap-3 animate-in">
                        <span class="status-dot ${esc(item.status)}" role="img" aria-label="${STATUS_LABELS[item.status] || ''}"></span>
                        <div class="min-w-0">
                            <h3 class="font-semibold">${esc(item.name)}</h3>
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">${esc(item.desc)}</p>
                        </div>
                    </li>`).join('')}
            </ul>`;
    }

    function select(key, focus = false) {
        document.querySelectorAll('#component-tabs [role="tab"]').forEach(tab => {
            const active = tab.dataset.key === key;
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
            if (active && focus) tab.focus();
        });
        renderContent(key);
        history.replaceState(null, '', `#${encodeURIComponent(key)}`);
    }

    function init() {
        const tabs = document.getElementById('component-tabs');
        tabs.innerHTML = keys.map(key => `
            <button type="button" role="tab" id="${tabId(key)}" class="chip shrink-0" data-key="${esc(key)}" aria-controls="component-content" aria-selected="false">${esc(key)}</button>
        `).join('');

        tabs.addEventListener('click', e => {
            const tab = e.target.closest('[role="tab"]');
            if (tab) select(tab.dataset.key);
        });

        // Arrow keys move between tabs (WAI-ARIA tabs pattern).
        tabs.addEventListener('keydown', e => {
            const current = keys.indexOf(document.activeElement.dataset.key);
            if (current < 0) return;
            const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
            if (!step) return;
            e.preventDefault();
            select(keys[(current + step + keys.length) % keys.length], true);
        });

        const fromHash = decodeURIComponent(location.hash.slice(1));
        select(keys.includes(fromHash) ? fromHash : keys[0]);
    }

    return { init };
})();

ComponentsPage.init();
