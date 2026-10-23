import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Icon } from '../lib/icons.jsx';
import { setDark, useDarkMode } from '../lib/theme.js';
import { ToastProvider } from './Toast.jsx';

export const NAV_ITEMS = [
    { to: '/', label: 'Home' },
    { to: '/explorer', label: 'Explorer' },
    { to: '/compare', label: 'Compare' },
    { to: '/guides', label: 'Guides' },
    { to: '/components', label: 'Components' },
    { to: '/essentials', label: 'Essentials' },
    { to: '/buy-used', label: 'Buy Used' },
    { to: '/troubleshooting', label: 'Troubleshoot' }
];

function SearchForm({ className = '', inputClassName = '' }) {
    const navigate = useNavigate();
    return (
        <form className={`relative ${className}`} role="search" onSubmit={e => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get('q').trim();
            navigate(q ? `/explorer?search=${encodeURIComponent(q)}` : '/explorer');
        }}>
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Icon name="search" /></span>
            <input type="search" name="q" className={`input pl-10 ${inputClassName}`} placeholder="Find a laptop…" aria-label="Find a laptop" />
        </form>
    );
}

function Header() {
    const dark = useDarkMode();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => setMenuOpen(false), [location.pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = e => e.key === 'Escape' && setMenuOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const navClass = base => ({ isActive }) => `${base}${isActive ? ' active' : ''}`;

    return (
        <header className="sticky top-0 z-40 px-3 pt-3">
            <div className="glass rounded-[1.75rem] container mx-auto">
                <nav className="px-3 sm:px-4 h-14 flex items-center gap-2" aria-label="Main">
                    <Link to="/" className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 shrink-0 pl-1">
                        <Icon name="laptop" className="w-6 h-6" />
                        <span>Hackintosh<span className="hidden sm:inline"> Laptop</span> Guide</span>
                    </Link>
                    <div className="hidden xl:flex items-center ml-2 2xl:ml-4 gap-0.5">
                        {NAV_ITEMS.map(i => <NavLink key={i.to} to={i.to} end className={navClass('nav-link')}>{i.label}</NavLink>)}
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <SearchForm className="hidden md:block xl:hidden 2xl:block" inputClassName="!w-44 2xl:!w-56 !py-2 !rounded-full" />
                        <Link to="/#favorites" className="icon-btn" aria-label="Favorites" title="Favorites"><Icon name="heart" className="w-5 h-5" /></Link>
                        <button type="button" className="icon-btn" onClick={() => setDark(!dark)}
                                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <Icon name={dark ? 'sun' : 'moon'} className="w-5 h-5" />
                        </button>
                        <button type="button" className="icon-btn xl:hidden" onClick={() => setMenuOpen(!menuOpen)}
                                aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">
                            <Icon name={menuOpen ? 'close' : 'menu'} className="w-6 h-6" />
                        </button>
                    </div>
                </nav>
                <div id="mobile-menu" className="xl:hidden border-t border-white/40 dark:border-white/10 max-h-[calc(100vh-6rem)] overflow-y-auto" hidden={!menuOpen}>
                    <div className="px-3 sm:px-4 py-3 space-y-1">
                        <SearchForm className="md:hidden mb-3" />
                        {NAV_ITEMS.map(i => <NavLink key={i.to} to={i.to} end className={navClass('mobile-nav-link')}>{i.label}</NavLink>)}
                    </div>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="mt-16 px-3 pb-3">
            <div className="glass rounded-[1.75rem] container mx-auto px-5 sm:px-8 py-8 text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <p>&copy; {new Date().getFullYear()} Hackintosh Laptop Guide. For educational purposes only. Not affiliated with Apple.</p>
                <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer">
                    {NAV_ITEMS.slice(1).map(i => <Link key={i.to} to={i.to} className="hover:text-blue-600 dark:hover:text-blue-300">{i.label}</Link>)}
                </nav>
            </div>
        </footer>
    );
}

// Scroll to the top on navigation, or to #anchor targets (React Router doesn't do either itself).
function ScrollManager() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (target) {
                target.scrollIntoView();
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
    return null;
}

// "/" focuses the visible search box, like many docs sites.
function useSlashToSearch() {
    useEffect(() => {
        const onKey = e => {
            if (e.key !== '/' || e.target.closest('input, textarea, select, [contenteditable]')) return;
            const input = [...document.querySelectorAll('input[type="search"]')].find(el => el.offsetParent !== null);
            if (input) {
                e.preventDefault();
                input.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);
}

export default function Layout() {
    useSlashToSearch();
    return (
        <ToastProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-3 focus:left-3 btn-primary">Skip to content</a>
            <ScrollManager />
            <Header />
            <main id="main"><Outlet /></main>
            <Footer />
        </ToastProvider>
    );
}

// Sets the browser tab title for the current page.
export function useTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} - Hackintosh Laptop Guide` : 'Hackintosh Laptop Guide';
    }, [title]);
}
