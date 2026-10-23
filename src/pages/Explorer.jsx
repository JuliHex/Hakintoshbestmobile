import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LaptopDB, PRIORITY_LABELS } from '../data/laptops.js';
import { CPU_FAMILIES, cpuFamily } from '../lib/buildPlan.js';
import { Icon } from '../lib/icons.jsx';
import { compareList, favoriteList, useList } from '../lib/stores.js';
import { useTitle } from '../components/Layout.jsx';
import LaptopCard from '../components/LaptopCard.jsx';
import Glass from '../components/Glass.jsx';

const ALL = LaptopDB.all();
const BRANDS = LaptopDB.brands();
const FAMILY = new Map(ALL.map(l => [l.id, cpuFamily(l)]));
const MACOS_FILTERS = ['Monterey', 'Ventura', 'Sonoma', 'Sequoia', 'Tahoe'];
const SORTS = {
    'score-desc': ['Score (high to low)', (a, b) => b.score - a.score],
    'score-asc': ['Score (low to high)', (a, b) => a.score - b.score],
    'name-asc': ['Name (A to Z)', (a, b) => a.name.localeCompare(b.name)],
    'name-desc': ['Name (Z to A)', (a, b) => b.name.localeCompare(a.name)]
};
const MIN_SCORES = [[0, 'Any'], [7, '7.0+'], [8, '8.0+'], [8.5, '8.5+'], [9, '9.0+']];

// Flattens a laptop's details into one lowercase string for free-text search.
const SEARCH_TEXT = new Map(ALL.map(laptop => {
    const parts = [laptop.name, laptop.brand, laptop.summary];
    (function collect(value) {
        if (typeof value === 'string') parts.push(value);
        else if (Array.isArray(value)) value.forEach(collect);
        else if (value && typeof value === 'object') Object.values(value).forEach(collect);
    })(laptop.details);
    return [laptop.id, parts.join(' ').toLowerCase()];
}));

// Reads filter state from the URL, ignoring values that aren't valid options.
function readFilters(params) {
    const macos = params.get('macos');
    const brand = params.get('brand');
    const sort = params.get('sort');
    return {
        search: params.get('search') || '',
        priorities: (params.get('priority') || '').split(',').filter(p => p in PRIORITY_LABELS),
        macos: MACOS_FILTERS.includes(macos) ? macos : '',
        brand: BRANDS.includes(brand) ? brand : '',
        gen: params.get('gen') in CPU_FAMILIES ? params.get('gen') : '',
        favorites: params.get('fav') === '1',
        minScore: parseFloat(params.get('min')) || 0,
        sort: sort in SORTS ? sort : 'score-desc'
    };
}

function toParams(f) {
    const params = new URLSearchParams();
    if (f.search) params.set('search', f.search);
    if (f.priorities.length) params.set('priority', f.priorities.join(','));
    if (f.macos) params.set('macos', f.macos);
    if (f.brand) params.set('brand', f.brand);
    if (f.gen) params.set('gen', f.gen);
    if (f.favorites) params.set('fav', '1');
    if (f.minScore) params.set('min', f.minScore);
    if (f.sort !== 'score-desc') params.set('sort', f.sort);
    return params;
}

function CompareBar() {
    const ids = useList(compareList);
    if (!ids.length) return null;
    const ready = ids.length >= 2;
    return (
        <Glass className="!fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 h-16 pointer-events-none" glassStyle={{ pointerEvents: 'auto' }}>
            <div className="flex rounded-full pl-5 pr-2 py-2 items-center gap-2 text-left" style={{ width: 'min(42rem, calc(100vw - 1.5rem))' }}>
                <p className="flex-1 min-w-0 text-sm truncate">
                    <strong>{ids.length}/{compareList.max} selected</strong>
                    <span className="hidden sm:inline text-gray-700 dark:text-gray-300"> · {ids.map(id => LaptopDB.get(id).name).join(', ')}</span>
                </p>
                <button type="button" className="btn-secondary" onClick={compareList.clear}>Clear</button>
                {ready
                    ? <Link to={`/compare?ids=${ids.join(',')}`} className="btn-primary">Compare <Icon name="arrowRight" /></Link>
                    : <span className="btn-primary opacity-50" aria-disabled="true">Pick 1 more</span>}
            </div>
        </Glass>
    );
}

export default function Explorer() {
    useTitle('Laptop Explorer');
    const [params, setParams] = useSearchParams();
    const filters = readFilters(params);
    const favorites = useList(favoriteList);
    const [searchDraft, setSearchDraft] = useState(filters.search);
    const [panelOpen, setPanelOpen] = useState(false);

    const update = changes => setParams(toParams({ ...filters, ...changes }), { replace: true });

    // Debounce typing into the URL; also pick up searches from the header box.
    useEffect(() => setSearchDraft(filters.search), [filters.search]);
    useEffect(() => {
        if (searchDraft.trim() === filters.search) return;
        const t = setTimeout(() => update({ search: searchDraft.trim() }), 150);
        return () => clearTimeout(t);
    });

    const results = useMemo(() => {
        const terms = filters.search.toLowerCase().split(/\s+/).filter(Boolean);
        return ALL.filter(l =>
            filters.priorities.every(p => l.priority.includes(p)) &&
            (!filters.macos || LaptopDB.supportsMacos(l, filters.macos)) &&
            (!filters.brand || l.brand === filters.brand) &&
            (!filters.gen || FAMILY.get(l.id) === filters.gen) &&
            (!filters.favorites || favorites.includes(l.id)) &&
            l.score >= filters.minScore &&
            terms.every(t => SEARCH_TEXT.get(l.id).includes(t))
        ).sort(SORTS[filters.sort][1]);
    }, [params, favorites]); // eslint-disable-line react-hooks/exhaustive-deps

    const activeCount = (filters.search ? 1 : 0) + filters.priorities.length + (filters.macos ? 1 : 0) +
        (filters.brand ? 1 : 0) + (filters.gen ? 1 : 0) + (filters.favorites ? 1 : 0) + (filters.minScore ? 1 : 0);
    const reset = () => setParams({}, { replace: true });

    const searchInput = id => (
        <input type="search" id={id} className="input" placeholder="Search name, CPU, Wi-Fi…"
               value={searchDraft} onChange={e => setSearchDraft(e.target.value)} />
    );

    return (
        <div className="page pb-28">
            <h1 className="page-title">Laptop Explorer</h1>
            <p className="page-lead">Filter by what matters to you, then tap <strong>Compare</strong> on up to three laptops to see them side by side.</p>

            <div className="mt-6 lg:grid lg:grid-cols-[17rem,1fr] lg:gap-8 lg:items-start">
                <aside className="lg:sticky lg:top-24">
                    <div className="flex gap-2 lg:hidden">
                        <label htmlFor="search-mobile" className="sr-only">Search laptops</label>
                        <div className="flex-1">{searchInput('search-mobile')}</div>
                        <button type="button" className="btn-secondary shrink-0" aria-expanded={panelOpen} aria-controls="filters-panel"
                                onClick={() => setPanelOpen(!panelOpen)}>
                            Filters {activeCount > 0 && <span className="tag">{activeCount}</span>}
                        </button>
                    </div>

                    <div id="filters-panel" className={`card p-4 mt-3 lg:mt-0 space-y-5 ${panelOpen ? '' : 'hidden'} lg:block`}>
                        <div className="hidden lg:block">
                            <label htmlFor="search-desktop" className="label">Search</label>
                            {searchInput('search-desktop')}
                        </div>

                        <div>
                            <label htmlFor="sort" className="label">Sort by</label>
                            <select id="sort" className="input" value={filters.sort} onChange={e => update({ sort: e.target.value })}>
                                {Object.entries(SORTS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </div>

                        <fieldset>
                            <legend className="label">Priorities</legend>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(PRIORITY_LABELS).map(([value, label]) => {
                                    const on = filters.priorities.includes(value);
                                    return (
                                        <button key={value} type="button" className="chip" aria-pressed={on}
                                                onClick={() => update({ priorities: on ? filters.priorities.filter(p => p !== value) : [...filters.priorities, value] })}>
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="label">Runs macOS</legend>
                            <div className="flex flex-wrap gap-2">
                                {MACOS_FILTERS.map(v => (
                                    <button key={v} type="button" className="chip" aria-pressed={filters.macos === v}
                                            onClick={() => update({ macos: filters.macos === v ? '' : v })}>{v}</button>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="label">CPU generation</legend>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(CPU_FAMILIES).map(([value, label]) => (
                                    <button key={value} type="button" className="chip" aria-pressed={filters.gen === value}
                                            onClick={() => update({ gen: filters.gen === value ? '' : value })}>{label.replace('Intel ', '')}</button>
                                ))}
                            </div>
                        </fieldset>

                        <div>
                            <label htmlFor="brand" className="label">Brand</label>
                            <select id="brand" className="input" value={filters.brand} onChange={e => update({ brand: e.target.value })}>
                                <option value="">All brands</option>
                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <button type="button" className="chip w-full justify-center" aria-pressed={filters.favorites}
                                onClick={() => update({ favorites: !filters.favorites })}>
                            <Icon name="heart" /> Favorites only
                        </button>

                        <div>
                            <label htmlFor="min-score" className="label">Minimum score</label>
                            <select id="min-score" className="input" value={filters.minScore} onChange={e => update({ minScore: parseFloat(e.target.value) || 0 })}>
                                {MIN_SCORES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </div>

                        <button type="button" className="btn-secondary w-full" onClick={reset}>Reset filters</button>
                    </div>
                </aside>

                <section aria-labelledby="results-heading" className="mt-6 lg:mt-0">
                    <h2 id="results-heading" className="sr-only">Results</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" aria-live="polite">{results.length} of {ALL.length} laptops</p>
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {results.map(l => <LaptopCard key={l.id} laptop={l} />)}
                        </div>
                    ) : (
                        <div className="card p-8 text-center">
                            <p className="font-medium">No laptops match these filters.</p>
                            <button type="button" className="btn-secondary mt-4" onClick={reset}>Reset filters</button>
                        </div>
                    )}
                </section>
            </div>

            <CompareBar />
        </div>
    );
}
