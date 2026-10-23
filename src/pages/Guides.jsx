import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LaptopDB } from '../data/laptops.js';
import { DIFFICULTIES, guideDifficulty, PLATFORMS, CPU_PLATFORM, detectOptions } from '../lib/buildPlan.js';
import { laptopPath } from '../lib/format.js';
import { Icon } from '../lib/icons.jsx';
import { useTitle } from '../components/Layout.jsx';
import { DifficultyBadge, ScoreBar } from '../components/LaptopBits.jsx';

const GENERAL = [
    { title: 'Getting started', to: '/essentials', icon: 'book', difficulty: 'Beginner', text: 'The tools, kexts and mindset every build needs, and where to get help.' },
    { title: 'Check your components', to: '/components', icon: 'cpu', difficulty: 'Beginner', text: 'Which CPUs, GPUs, Wi-Fi cards, RAM and SSDs work with macOS.' },
    { title: 'Buying a used laptop', to: '/buy-used', icon: 'tag', difficulty: 'Beginner', text: 'Where to look and what to check before you pay.' },
    { title: 'BIOS settings', to: '/build-guide#bios', icon: 'wrench', difficulty: 'Beginner', text: 'Firmware settings to change before macOS will boot.' },
    { title: 'Make the USB installer', to: '/build-guide#installer', icon: 'laptop', difficulty: 'Beginner', text: 'Create an OpenCore installer from Windows, Linux or a Mac.' },
    { title: 'Build the EFI', to: '/build-guide#efi', icon: 'cpu', difficulty: 'Intermediate', text: 'Firmware drivers, kexts, SSDTs, config.plist and SMBIOS.' },
    { title: 'Install macOS', to: '/build-guide#install', icon: 'laptop', difficulty: 'Intermediate', text: 'Format the drive and run the installer.' },
    { title: 'Post-install tuning', to: '/build-guide#post-install', icon: 'star', difficulty: 'Intermediate', text: 'USB mapping, audio, sleep, battery and brightness.' },
    { title: 'Troubleshooting', to: '/troubleshooting', icon: 'lifebuoy', difficulty: 'Intermediate', text: 'Fixes for boot hangs, black screens, Wi-Fi, audio and sleep.' }
].map(g => ({ ...g, kind: 'general', search: `${g.title} ${g.text}`.toLowerCase() }));

const LAPTOP_GUIDES = LaptopDB.all()
    .sort((a, b) => b.score - a.score)
    .map(laptop => {
        const [platform] = CPU_PLATFORM[detectOptions(laptop).cpu.default];
        return {
            kind: 'laptop',
            laptop,
            platform: PLATFORMS[platform].label,
            difficulty: guideDifficulty(laptop),
            search: `${laptop.name} ${laptop.brand} ${laptop.details.cpu} ${laptop.details.igpu}`.toLowerCase()
        };
    });

const TABS = [['all', 'All guides'], ['general', 'General'], ['laptop', 'Laptop guides']];

function KindTag({ kind }) {
    return (
        <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <Icon name={kind === 'laptop' ? 'laptop' : 'book'} className="w-3.5 h-3.5" /> {kind === 'laptop' ? 'Laptop' : 'General'}
        </span>
    );
}

export default function Guides() {
    useTitle('Guides');
    const [params, setParams] = useSearchParams();
    const query = params.get('q') || '';
    const tab = TABS.some(([k]) => k === params.get('type')) ? params.get('type') : 'all';
    const difficulty = DIFFICULTIES.includes(params.get('difficulty')) ? params.get('difficulty') : '';

    const update = changes => {
        const next = { q: query, type: tab, difficulty, ...changes };
        setParams(Object.fromEntries(Object.entries(next).filter(([k, v]) => v && !(k === 'type' && v === 'all'))), { replace: true });
    };

    const matches = useMemo(() => {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const ok = g => terms.every(t => g.search.includes(t)) && (!difficulty || g.difficulty === difficulty);
        return { general: GENERAL.filter(ok), laptop: LAPTOP_GUIDES.filter(ok) };
    }, [query, difficulty]);

    const counts = { all: matches.general.length + matches.laptop.length, general: matches.general.length, laptop: matches.laptop.length };
    const shown = [...(tab !== 'laptop' ? matches.general : []), ...(tab !== 'general' ? matches.laptop : [])];

    return (
        <div className="page">
            <section className="card px-5 py-8 sm:px-10 sm:py-12 animate-in">
                <p className="eyebrow">Guides</p>
                <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">Hackintosh installation guides</h1>
                <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">Step-by-step instructions for every stage of a build, plus a tailored OpenCore guide for each of the {LAPTOP_GUIDES.length} laptops in the guide.</p>
                <div className="mt-6 max-w-xl relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><Icon name="search" /></span>
                    <label htmlFor="guide-search" className="sr-only">Find guides</label>
                    <input id="guide-search" type="search" className="input !rounded-full pl-10" placeholder="Find guides by name, brand, model or CPU…"
                           value={query} onChange={e => update({ q: e.target.value })} />
                </div>
            </section>

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <div role="tablist" aria-label="Guide type" className="flex flex-wrap gap-2">
                    {TABS.map(([key, label]) => (
                        <button key={key} type="button" role="tab" className="chip" aria-selected={tab === key} onClick={() => update({ type: key })}>
                            {label} <span className="tabular-nums opacity-75">({counts[key]})</span>
                        </button>
                    ))}
                </div>
                <div className="ml-auto">
                    <label htmlFor="difficulty" className="sr-only">Difficulty</label>
                    <select id="difficulty" className="input !w-auto !rounded-full !py-2" value={difficulty} onChange={e => update({ difficulty: e.target.value })}>
                        <option value="">All difficulties</option>
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            {shown.length === 0 ? (
                <div className="card p-8 mt-5 text-center">
                    <p className="font-medium">No guides match these filters.</p>
                    <button type="button" className="btn-secondary mt-4" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {shown.map(g => g.kind === 'general' ? (
                        <Link key={g.to} to={g.to} className="card p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform">
                            <span className="flex items-center justify-between"><KindTag kind="general" /><DifficultyBadge level={g.difficulty} /></span>
                            <span className="mt-1 text-lg font-bold leading-snug">{g.title}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{g.text}</span>
                        </Link>
                    ) : (
                        <Link key={g.laptop.id} to={`${laptopPath(g.laptop.id)}/build`} className="card p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform">
                            <span className="flex items-center justify-between"><KindTag kind="laptop" /><DifficultyBadge level={g.difficulty} /></span>
                            <span className="mt-1 text-lg font-bold leading-snug">{g.laptop.name} guide</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{g.platform} · {g.laptop.details.minMacosSupport} – {g.laptop.details.maxMacosSupport}</span>
                            <span className="mt-auto pt-2"><ScoreBar score={g.laptop.score} /></span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
