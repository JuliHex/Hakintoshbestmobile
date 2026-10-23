// Laptop ID lists saved in localStorage (comparison, favorites, recently viewed), exposed as
// React hooks. All components using a list re-render together when it changes, including
// across browser tabs.
import { useSyncExternalStore } from 'react';
import { LaptopDB } from '../data/laptops.js';

const listeners = new Set();
const cache = new Map();

function read(key) {
    if (!cache.has(key)) {
        let ids = [];
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || '[]');
            if (Array.isArray(parsed)) ids = parsed.filter(id => LaptopDB.get(id));
        } catch (e) {
            // Unavailable or corrupt storage just means an empty list.
        }
        cache.set(key, ids);
    }
    return cache.get(key);
}

function write(key, ids) {
    cache.set(key, ids);
    try {
        localStorage.setItem(key, JSON.stringify(ids));
    } catch (e) {
        // Storage can be unavailable (private mode, blocked cookies); the list still works for this visit.
    }
    listeners.forEach(fn => fn());
}

function subscribe(fn) {
    listeners.add(fn);
    const onStorage = e => {
        if (e.key) cache.delete(e.key);
        fn();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(fn);
        window.removeEventListener('storage', onStorage);
    };
}

function createList(key, max = Infinity) {
    const list = {
        key,
        max,
        ids: () => read(key),
        has: id => read(key).includes(id),
        save: ids => write(key, ids.slice(0, max)),
        // Returns false when the list is full and `id` couldn't be added.
        toggle(id) {
            const ids = read(key);
            if (ids.includes(id)) {
                list.save(ids.filter(x => x !== id));
                return true;
            }
            if (ids.length >= max) return false;
            list.save([...ids, id]);
            return true;
        },
        clear: () => write(key, [])
    };
    return list;
}

export const compareList = createList('compareLaptops', 3);
export const favoriteList = createList('favoriteLaptops');
export const recentList = {
    ...createList('recentLaptops', 6),
    // Most recent first; re-visiting moves a laptop to the front.
    add(id) {
        write('recentLaptops', [id, ...read('recentLaptops').filter(x => x !== id)].slice(0, 6));
    }
};

export function useList(list) {
    return useSyncExternalStore(subscribe, list.ids, () => []);
}
