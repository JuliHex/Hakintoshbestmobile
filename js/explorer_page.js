const ExplorerPage = (() => {
    const MACOS_FILTERS = ['Monterey', 'Ventura', 'Sonoma', 'Sequoia', 'Tahoe'];
    const DEFAULTS = { search: '', priorities: [], macos: '', minScore: 0, sort: 'score-desc' };
    const state = { ...DEFAULTS, priorities: [] };

    const el = id => document.getElementById(id);
    const searchInputs = () => document.querySelectorAll('[data-search]');

    // Flattens a laptop's details into one lowercase string for free-text search.
    function searchText(laptop) {
        const parts = [laptop.name, laptop.summary];
        (function collect(value) {
            if (typeof value === 'string') parts.push(value);
            else if (Array.isArray(value)) value.forEach(collect);
            else if (value && typeof value === 'object') Object.values(value).forEach(collect);
        })(laptop.details);
        return parts.join(' ').toLowerCase();
    }

    function matches(laptop) {
        if (state.priorities.some(p => !laptop.priority.includes(p))) return false;
        if (state.macos && !LaptopDB.supportsMacos(laptop, state.macos)) return false;
        if (laptop.score < state.minScore) return false;
        if (state.search) {
            const text = searchText(laptop);
            return state.search.toLowerCase().split(/\s+/).every(term => text.includes(term));
        }
        return true;
    }

    function sort(laptops) {
        const [key, dir] = state.sort.split('-');
        const sign = dir === 'asc' ? 1 : -1;
        return laptops.sort((a, b) => sign * (key === 'name' ? a.name.localeCompare(b.name) : a.score - b.score));
    }

    function activeFilterCount() {
        return (state.search ? 1 : 0) + state.priorities.length + (state.macos ? 1 : 0) + (state.minScore ? 1 : 0);
    }

    function render() {
        const results = sort(LaptopDB.all().filter(matches));
        el('laptop-grid').innerHTML = results.map(l => UI.laptopCard(l, { compare: true })).join('');
        el('no-results').hidden = results.length > 0;
        el('result-count').textContent = `${results.length} of ${Object.keys(laptopData).length} laptops`;

        const count = activeFilterCount();
        el('active-filter-count').hidden = count === 0;
        el('active-filter-count').textContent = count;

        el('priority-filters').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', state.priorities.includes(b.dataset.value)));
        el('macos-filters').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.value === state.macos));
        searchInputs().forEach(input => { if (input.value !== state.search) input.value = state.search; });
        el('sort-select').value = state.sort;
        el('min-score').value = String(state.minScore);

        renderCompareBar();
        syncUrl();
    }

    function renderCompareBar() {
        const ids = CompareStore.ids();
        el('compare-bar').hidden = ids.length === 0;
        el('compare-count').textContent = `${ids.length}/${CompareStore.MAX} selected`;
        el('compare-names').textContent = ' · ' + ids.map(id => LaptopDB.get(id).name).join(', ');
        el('compare-go').classList.toggle('pointer-events-none', ids.length < 2);
        el('compare-go').classList.toggle('opacity-50', ids.length < 2);
        el('compare-go').setAttribute('aria-disabled', String(ids.length < 2));
        el('compare-go').textContent = ids.length < 2 ? 'Pick 1 more' : 'Compare';
    }

    function syncUrl() {
        const params = new URLSearchParams();
        if (state.search) params.set('search', state.search);
        if (state.priorities.length) params.set('priority', state.priorities.join(','));
        if (state.macos) params.set('macos', state.macos);
        if (state.minScore) params.set('min', state.minScore);
        if (state.sort !== DEFAULTS.sort) params.set('sort', state.sort);
        const query = params.toString();
        history.replaceState(null, '', query ? `?${query}` : location.pathname);
    }

    function readUrl() {
        const params = new URLSearchParams(location.search);
        state.search = params.get('search') || '';
        state.priorities = (params.get('priority') || '').split(',').filter(p => p in PRIORITY_LABELS);
        state.macos = MACOS_FILTERS.includes(params.get('macos')) ? params.get('macos') : '';
        state.minScore = parseFloat(params.get('min')) || 0;
        const sortValue = params.get('sort');
        state.sort = [...el('sort-select').options].some(o => o.value === sortValue) ? sortValue : DEFAULTS.sort;
    }

    function reset() {
        Object.assign(state, DEFAULTS, { priorities: [] });
        render();
    }

    function buildChips() {
        el('priority-filters').innerHTML = Object.entries(PRIORITY_LABELS)
            .map(([value, label]) => `<button type="button" class="chip" data-value="${value}" aria-pressed="false">${label}</button>`)
            .join('');
        el('macos-filters').innerHTML = MACOS_FILTERS
            .map(v => `<button type="button" class="chip" data-value="${v}" aria-pressed="false">${v}</button>`)
            .join('');
    }

    function init() {
        buildChips();
        readUrl();

        let debounce;
        searchInputs().forEach(input => input.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                state.search = input.value.trim();
                render();
            }, 150);
        }));

        el('priority-filters').addEventListener('click', e => {
            const value = e.target.closest('button')?.dataset.value;
            if (!value) return;
            state.priorities = state.priorities.includes(value)
                ? state.priorities.filter(p => p !== value)
                : [...state.priorities, value];
            render();
        });

        el('macos-filters').addEventListener('click', e => {
            const value = e.target.closest('button')?.dataset.value;
            if (!value) return;
            state.macos = state.macos === value ? '' : value;
            render();
        });

        el('sort-select').addEventListener('change', e => { state.sort = e.target.value; render(); });
        el('min-score').addEventListener('change', e => { state.minScore = parseFloat(e.target.value) || 0; render(); });
        el('reset-filters').addEventListener('click', reset);
        document.querySelector('[data-reset]').addEventListener('click', reset);

        el('filters-toggle').addEventListener('click', () => {
            const panel = el('filters-panel');
            const open = panel.classList.toggle('hidden') === false;
            el('filters-toggle').setAttribute('aria-expanded', String(open));
        });

        el('laptop-grid').addEventListener('click', e => {
            const button = e.target.closest('[data-compare-id]');
            if (!button) return;
            if (!CompareStore.toggle(button.dataset.compareId)) {
                alert(`You can compare up to ${CompareStore.MAX} laptops. Remove one first.`);
                return;
            }
            const selected = CompareStore.has(button.dataset.compareId);
            button.setAttribute('aria-pressed', String(selected));
            button.textContent = selected ? '✓ Comparing' : '+ Compare';
            renderCompareBar();
        });

        el('compare-clear').addEventListener('click', () => {
            CompareStore.clear();
            render();
        });

        render();
    }

    return { init };
})();

ExplorerPage.init();
