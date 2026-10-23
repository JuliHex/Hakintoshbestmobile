// Searchable laptop picker (WAI-ARIA combobox): type to filter by name, brand or CPU,
// use the arrow keys to move, Enter to choose, Escape to close.
import { useId, useMemo, useRef, useState } from 'react';
import { LaptopDB } from '../data/laptops.js';
import { Icon } from '../lib/icons.jsx';

const ALL = LaptopDB.all().sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
const MAX_RESULTS = 60;

export default function LaptopCombobox({ onSelect, placeholder = 'Search your laptop: name, brand or CPU…', label = 'Your laptop' }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const listRef = useRef(null);
    const id = useId();

    const results = useMemo(() => {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        return ALL.filter(l => {
            const text = `${l.name} ${l.brand} ${l.details.cpu}`.toLowerCase();
            return terms.every(t => text.includes(t));
        }).slice(0, MAX_RESULTS);
    }, [query]);

    const choose = laptop => {
        setQuery(laptop.name);
        setOpen(false);
        onSelect(laptop);
    };

    const move = step => {
        const next = Math.max(0, Math.min(results.length - 1, active + step));
        setActive(next);
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
    };

    const onKeyDown = e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter' && open && results[active]) { e.preventDefault(); choose(results[active]); }
        else if (e.key === 'Escape') setOpen(false);
    };

    return (
        <div className="relative">
            <label htmlFor={`${id}-input`} className="sr-only">{label}</label>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><Icon name="search" /></span>
            <input
                id={`${id}-input`}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-autocomplete="list"
                aria-activedescendant={open && results[active] ? `${id}-opt-${active}` : undefined}
                autoComplete="off"
                className="input pl-10"
                placeholder={placeholder}
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                onKeyDown={onKeyDown}
            />
            {open && (
                <ul id={`${id}-list`} ref={listRef} role="listbox"
                    className="absolute z-30 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl p-1.5 text-left bg-white dark:bg-[#121729] ring-1 ring-gray-900/10 dark:ring-white/10 shadow-2xl">
                    {results.length === 0 && <li className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">No laptops match “{query}”.</li>}
                    {results.map((l, i) => (
                        <li key={l.id} id={`${id}-opt-${i}`} role="option" aria-selected={i === active}
                            onMouseDown={e => e.preventDefault()} onClick={() => choose(l)} onMouseEnter={() => setActive(i)}
                            className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer ${i === active ? 'bg-blue-500/15 dark:bg-white/10' : ''}`}>
                            <span className="min-w-0">
                                <span className="block font-medium truncate">{l.name}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">{l.details.cpu}</span>
                            </span>
                            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400 shrink-0">{l.score.toFixed(1)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
