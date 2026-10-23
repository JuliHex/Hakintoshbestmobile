// Dark mode lives on <html class="dark">. index.html applies the saved choice before first
// paint; this hook keeps React in sync and persists changes.
import { useSyncExternalStore } from 'react';

const listeners = new Set();

function isDark() {
    return document.documentElement.classList.contains('dark');
}

export function setDark(dark) {
    document.documentElement.classList.toggle('dark', dark);
    try {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) {
        // Not persisted; the theme still applies for this visit.
    }
    listeners.forEach(fn => fn());
}

export function useDarkMode() {
    return useSyncExternalStore(fn => {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }, isDark, () => false);
}
