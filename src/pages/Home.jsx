import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LaptopDB, MACOS_VERSIONS, PRIORITY_LABELS } from '../data/laptops.js';
import { Icon } from '../lib/icons.jsx';
import { brandHue, laptopPath, macosClass } from '../lib/format.js';
import { favoriteList, recentList, useList } from '../lib/stores.js';
import { useTitle } from '../components/Layout.jsx';
import LaptopCard from '../components/LaptopCard.jsx';
import { DeviceTile, ScoreBar } from '../components/LaptopBits.jsx';
import Accordion from '../components/Accordion.jsx';
import Glass from '../components/Glass.jsx';
import { cpuFamily } from '../lib/buildPlan.js';

const LAPTOPS = LaptopDB.all().sort((a, b) => b.score - a.score);

const PRIORITY_ICONS = { ease: 'shield', performance: 'bolt', budget: 'wallet', portability: 'feather', stability: 'star' };

const STATS = [
    [LAPTOPS.length, 'laptops rated'],
    [LaptopDB.brands().length, 'brands covered'],
    [LAPTOPS.filter(l => l.score >= 8.5).length, 'scored 8.5 or higher'],
    [LAPTOPS.filter(l => LaptopDB.supportsMacos(l, 'Sonoma')).length, 'reported to run Sonoma']
];

const STEPS = [
    ['cpu', 'Pick compatible hardware', 'Intel 8th–10th gen, Intel graphics, and a Wi-Fi card macOS can drive.', '/components'],
    ['wrench', 'Set up BIOS and USB', 'Turn off Secure Boot and CSM, then make an OpenCore installer stick.', '/build-guide#bios'],
    ['laptop', 'Install macOS', 'Boot the stick with verbose logging on and install to an APFS drive.', '/build-guide#install'],
    ['star', 'Tune it', 'Map USB ports and fix audio, sleep, brightness and battery reporting.', '/build-guide#post-install']
];

const GUIDES = [
    ['book', 'Guides', 'Every stage of a build, plus a tailored guide with every kext for each laptop.', '/guides'],
    ['cpu', 'Component Checker', 'Which CPUs, GPUs, Wi-Fi cards and SSDs work.', '/components'],
    ['tag', 'Buying Used', 'Where to look and what to check before paying.', '/buy-used'],
    ['lifebuoy', 'Troubleshooting', 'Fixes for boot hangs, sleep, Wi-Fi, audio and more.', '/troubleshooting']
];

// Highest-scoring laptop for each priority, without repeating a laptop.
const BEST_PICKS = (() => {
    const used = new Set();
    return ['ease', 'performance', 'budget', 'portability'].map(priority => {
        const pick = LAPTOPS.find(l => l.priority.includes(priority) && !used.has(l.id));
        if (pick) used.add(pick.id);
        return [priority, pick];
    }).filter(([, pick]) => pick);
})();

const COVERAGE = (() => {
    const versions = MACOS_VERSIONS.slice(MACOS_VERSIONS.indexOf('Catalina'));
    const counts = versions.map(v => [v, LAPTOPS.filter(l => LaptopDB.supportsMacos(l, v)).length]);
    const max = Math.max(1, ...counts.map(([, n]) => n));
    return counts.map(([v, n]) => [v, n, (n / max) * 100]);
})();

const FAQ = [
    ['Is a Hackintosh legal?', "Apple's macOS licence only allows installing macOS on Apple-branded hardware, so running it on other machines breaks the licence terms. It's widely done for learning and hobby use, but it isn't something to rely on for commercial work."],
    ['Which macOS version should I install?', "The newest version your laptop is known to support, unless you depend on hardware it dropped. For example, macOS 14 Sonoma removed drivers for older Broadcom Wi-Fi cards, which then need extra patches. Check the laptop's page first."],
    ['Can I use an AMD Ryzen or 11th gen+ Intel laptop?', 'Not well. Intel 11th gen and newer use Iris Xe graphics, which has no macOS acceleration. AMD laptop graphics need experimental patches. Stick to Intel 8th–10th gen for a good experience.'],
    ['Will macOS updates break my install?', 'Minor updates usually install fine once your kexts are current. Major releases often need updated OpenCore and kexts. Back up your EFI and wait for community reports before upgrading.'],
    ['Do iMessage and iCloud work?', <>Yes, with a valid, unique SMBIOS serial and a correctly set-up network interface. See the Apple services section of the <Link className="text-blue-700 dark:text-blue-300 underline" to="/troubleshooting">Troubleshooting</Link> page.</>],
    ['What does “Unverified” mean on a laptop?', "Those values come from typical configurations or community lists and haven't been confirmed against a working build. Treat them as a starting point and check them for your exact model."]
];

const TRENDING = ['ThinkPad T480', 'Dell XPS 13', 'X1 Carbon', 'EliteBook', 'UHD 620'];

// "Can your laptop run macOS?" — a summary of Dortania's support rules per CPU family.
const ASSISTANT = [
    {
        key: 'modern', label: 'Intel 8th–10th gen', verdict: 'Recommended', tone: 'good',
        title: 'Intel 8th–10th gen (Kaby Lake R, Whiskey Lake, Coffee Lake, Comet Lake, Ice Lake)',
        points: [
            'Graphics: UHD 617/620/630 and Iris Plus G4/G7 get full acceleration with WhateverGreen.',
            'macOS: High Sierra or later (Comet Lake and Ice Lake from Catalina) up to Sequoia. 45W H-series and Ice Lake laptops can also run Tahoe, which loses built-in audio.',
            'The sweet spot: the best-documented laptops and the longest macOS support. Disable any NVIDIA dGPU.'
        ]
    },
    {
        key: 'mid', label: 'Intel 6th–7th gen', verdict: 'Good', tone: 'good',
        title: 'Intel 6th–7th gen (Skylake, Kaby Lake)',
        points: [
            'Graphics: HD 520/530/620/630 are supported.',
            'macOS: Skylake runs up to Monterey, or Ventura with its graphics presented as Kaby Lake. Kaby Lake runs up to Ventura, and Sonoma or Sequoia with a 2018 SMBIOS.',
            'Cheap and well understood, but with fewer macOS versions ahead.'
        ]
    },
    {
        key: 'legacy', label: 'Intel 4th–5th gen', verdict: 'Legacy', tone: 'mid',
        title: 'Intel 4th–5th gen (Haswell, Broadwell)',
        points: [
            'Graphics: HD 4400/4600/5500/6000 work up to Monterey.',
            'macOS Ventura and later dropped these GPUs. Getting them back needs OpenCore Legacy Patcher, which Dortania doesn\'t support on Hackintoshes.',
            'Fine for learning, but stuck on older macOS.'
        ]
    },
    {
        key: 'new', label: 'Intel 11th gen+', verdict: 'No iGPU support', tone: 'bad',
        title: 'Intel 11th gen and newer (Tiger Lake, Alder Lake and later)',
        points: [
            'Graphics: Iris Xe has no acceleration in macOS, so the system is too slow to use.',
            'Laptops can rarely switch the iGPU off in favour of a supported GPU, so these aren\'t practical Hackintoshes.'
        ]
    },
    {
        key: 'amd', label: 'AMD Ryzen', verdict: 'Experimental', tone: 'mid',
        title: 'AMD Ryzen laptops',
        points: [
            'Dortania\'s guide doesn\'t support AMD laptops. Graphics need experimental community patches.',
            'Power management, sleep and battery life are often unreliable. Expect a lot of tinkering.'
        ]
    }
];

const TONE_STYLE = {
    good: 'bg-emerald-500/15 text-emerald-800 ring-emerald-500/25 dark:text-emerald-200',
    mid: 'bg-amber-400/20 text-amber-900 ring-amber-500/30 dark:text-amber-200',
    bad: 'bg-rose-500/15 text-rose-800 ring-rose-500/25 dark:text-rose-200'
};

const BY_FAMILY = LAPTOPS.reduce((acc, l) => {
    (acc[cpuFamily(l)] ||= []).push(l);
    return acc;
}, {});

function Assistant() {
    const [active, setActive] = useState('modern');
    const item = ASSISTANT.find(a => a.key === active);
    const examples = (BY_FAMILY[active] || []).slice(0, 4);
    return (
        <section className="mt-14" aria-labelledby="assistant-heading">
            <div className="text-center">
                <p className="eyebrow">Interactive check</p>
                <h2 id="assistant-heading" className="mt-1 text-2xl md:text-3xl font-bold">Can your laptop run macOS?</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Pick your processor family for a quick verdict and the macOS versions to expect.</p>
            </div>
            <div role="tablist" aria-label="Processor family" className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-w-4xl mx-auto">
                {ASSISTANT.map(a => (
                    <button key={a.key} type="button" role="tab" id={`tab-${a.key}`} aria-selected={active === a.key} aria-controls="assistant-panel"
                            onClick={() => setActive(a.key)}
                            className={`card !rounded-2xl px-3 py-3 text-center transition ${active === a.key ? 'ring-2 !ring-blue-500' : 'hover:-translate-y-0.5'}`}>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ring-1 ${TONE_STYLE[a.tone]}`}>{a.verdict}</span>
                        <span className="block mt-1.5 text-sm font-semibold">{a.label}</span>
                    </button>
                ))}
            </div>
            <div id="assistant-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="card p-5 sm:p-7 mt-4 max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${TONE_STYLE[item.tone]}`}>{item.verdict}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
                    {item.points.map(p => <li key={p}>{p}</li>)}
                </ul>
                {examples.length > 0 ? (
                    <div className="mt-5">
                        <p className="text-sm font-semibold">Top picks in this family</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {examples.map(l => (
                                <Link key={l.id} to={laptopPath(l.id)} className="chip">{l.name} <span className="text-xs tabular-nums opacity-70">{l.score.toFixed(1)}</span></Link>
                            ))}
                        </div>
                        <Link to={`/explorer?gen=${active}`} className="btn-primary mt-4">See all {BY_FAMILY[active].length} laptops <Icon name="arrowRight" /></Link>
                    </div>
                ) : (
                    <p className="mt-5 text-sm text-gray-600 dark:text-gray-300">The guide doesn't list any laptops in this family, because they don't make good Hackintoshes. <Link to="/components" className="text-blue-700 dark:text-blue-300 hover:underline">Check the Component Checker</Link> for details.</p>
                )}
            </div>
        </section>
    );
}

function SectionHeading({ eyebrow, title, id, action }) {
    return (
        <div className="flex items-end justify-between gap-4 mb-5">
            <div>
                <p className="eyebrow">{eyebrow}</p>
                <h2 id={id} className="mt-1 text-2xl md:text-3xl font-bold">{title}</h2>
            </div>
            {action}
        </div>
    );
}

function SeeAll({ to, children }) {
    return (
        <Link to={to} className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline shrink-0 inline-flex items-center gap-1">
            {children} <Icon name="arrowRight" />
        </Link>
    );
}

function Hero() {
    const navigate = useNavigate();
    return (
        <section className="card mt-6 md:mt-10 px-5 py-10 sm:px-10 md:py-16 text-center animate-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500" aria-hidden="true" />
                The laptop Hackintosh hub
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-800 dark:text-blue-200">OpenCore</span>
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
                Turn your PC laptop into<br className="hidden sm:block" />{' '}
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 dark:from-blue-300 dark:via-violet-300 dark:to-pink-300 bg-clip-text text-transparent">a macOS machine</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Pick a laptop that's known to work, check its parts, and follow a proven setup.
            </p>
            <form className="mt-8 max-w-xl mx-auto relative" role="search" onSubmit={e => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get('q').trim();
                navigate(q ? `/explorer?search=${encodeURIComponent(q)}` : '/explorer');
            }}>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"><Icon name="search" className="w-5 h-5" /></span>
                <label htmlFor="hero-search" className="sr-only">Search laptops</label>
                <input type="search" id="hero-search" name="q" className="input !rounded-full !py-3.5 !text-base pl-12 pr-28"
                       placeholder="Search laptops, CPUs, Wi-Fi…" />
                <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2">Search</button>
            </form>
            <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Trending:</span>
                {TRENDING.map(t => (
                    <Link key={t} to={`/explorer?search=${encodeURIComponent(t)}`} className="px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 ring-1 ring-gray-900/10 dark:ring-white/10 hover:ring-blue-500/50 transition">{t}</Link>
                ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                    <Link key={key} to={`/explorer?priority=${key}`} className="chip"><Icon name={PRIORITY_ICONS[key]} />{label}</Link>
                ))}
            </div>
            <Glass className="h-20 mt-6">
                <Link to="/explorer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-lg font-semibold whitespace-nowrap">
                    <span>Explore all {LAPTOPS.length} laptops</span> <Icon name="arrowRight" className="w-5 h-5" />
                </Link>
            </Glass>
        </section>
    );
}

function Saved() {
    const favorites = useList(favoriteList).map(id => LaptopDB.get(id));
    const recent = useList(recentList).map(id => LaptopDB.get(id));

    if (!favorites.length && !recent.length) {
        return (
            <section id="favorites" className="mt-12 card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 scroll-mt-28">
                <div className="flex-1">
                    <h2 className="text-xl font-bold">Build a shortlist</h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">Tap the heart on any laptop to save it here. Favorites stay on this device.</p>
                </div>
                <Link to="/explorer" className="btn-secondary">Browse laptops</Link>
            </section>
        );
    }

    return (
        <>
            {favorites.length > 0 && (
                <section id="favorites" className="mt-12 scroll-mt-28" aria-labelledby="favorites-heading">
                    <SectionHeading eyebrow="Saved on this device" title="Your favorites" id="favorites-heading"
                                    action={<SeeAll to="/explorer?fav=1">Open in Explorer</SeeAll>} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {favorites.map(l => <LaptopCard key={l.id} laptop={l} />)}
                    </div>
                </section>
            )}
            {recent.length > 0 && (
                <section id={favorites.length ? undefined : 'favorites'} className="mt-12 scroll-mt-28" aria-labelledby="recent-heading">
                    <SectionHeading eyebrow="Pick up where you left off" title="Recently viewed" id="recent-heading" />
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
                        {recent.map(l => (
                            <Link key={l.id} to={laptopPath(l.id)} className="card overflow-hidden shrink-0 w-56 snap-start">
                                <DeviceTile laptop={l} />
                                <span className="block px-4 py-3 text-sm font-semibold truncate">{l.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

export default function Home() {
    useTitle();
    return (
        <div className="container mx-auto px-4 sm:px-6">
            <Hero />

            <section className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" aria-label="Guide at a glance">
                {STATS.map(([value, label]) => (
                    <div key={label} className="card p-4 sm:p-5">
                        <p className="text-3xl sm:text-4xl font-bold tabular-nums bg-gradient-to-br from-blue-600 to-violet-600 dark:from-blue-300 dark:to-violet-300 bg-clip-text text-transparent">{value}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{label}</p>
                    </div>
                ))}
            </section>

            <div className="callout callout-warn mt-6">
                <p><strong>Heads-up:</strong> Apple has said macOS 26 Tahoe is the last macOS release for Intel Macs. Hackintoshes will keep working on Tahoe and earlier, but there won't be newer versions to upgrade to. Plan for that before you buy.</p>
            </div>

            <Assistant />

            <section className="mt-12" aria-labelledby="picks-heading">
                <SectionHeading eyebrow="Editor's shortlist" title="Best pick for every priority" id="picks-heading" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {BEST_PICKS.map(([priority, pick]) => (
                        <Link key={priority} to={laptopPath(pick.id)} className="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                                <Icon name={PRIORITY_ICONS[priority]} className="w-5 h-5" />Best for {PRIORITY_LABELS[priority].toLowerCase()}
                            </span>
                            <span className="text-lg font-bold leading-snug">{pick.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{pick.summary}</span>
                            <span className="mt-auto"><ScoreBar score={pick.score} /></span>
                        </Link>
                    ))}
                </div>
            </section>

            <Saved />

            <section className="mt-12" aria-labelledby="top-heading">
                <SectionHeading eyebrow="Highest compatibility" title="Top-rated laptops" id="top-heading" action={<SeeAll to="/explorer">See all</SeeAll>} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {LAPTOPS.slice(0, 6).map(l => <LaptopCard key={l.id} laptop={l} />)}
                </div>
            </section>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section className="card p-5 sm:p-7" aria-labelledby="macos-heading">
                    <p className="eyebrow">Version support</p>
                    <h2 id="macos-heading" className="mt-1 text-xl font-bold">Laptops by newest macOS</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">How many laptops in the guide are reported to reach each release. Tap one to filter.</p>
                    <ul className="mt-5 space-y-2.5">
                        {COVERAGE.map(([version, n, pct]) => (
                            <li key={version}>
                                <Link to={`/explorer?macos=${encodeURIComponent(version)}`} className="grid grid-cols-[6rem,1fr,2.5rem] items-center gap-3 group">
                                    <span className="text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">{version}</span>
                                    <span className="score-track !h-3"><span className={`score-fill block ${macosClass(version)}`} style={{ width: `${pct}%` }} /></span>
                                    <span className="text-sm tabular-nums text-right text-gray-600 dark:text-gray-300">{n}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="card p-5 sm:p-7" aria-labelledby="brands-heading">
                    <p className="eyebrow">Browse</p>
                    <h2 id="brands-heading" className="mt-1 text-xl font-bold">Laptops by brand</h2>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {LaptopDB.brands().map(brand => (
                            <Link key={brand} to={`/explorer?brand=${encodeURIComponent(brand)}`} className="chip">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${brandHue(brand)} 70% 52%)` }} />
                                {brand}
                                <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{LAPTOPS.filter(l => l.brand === brand).length}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <section className="mt-12" aria-labelledby="how-heading">
                <SectionHeading eyebrow="The process" title="How a Hackintosh build goes" id="how-heading" />
                <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STEPS.map(([icon, title, text, to], i) => (
                        <li key={title} className="card p-5">
                            <Link to={to} className="flex flex-col gap-3 h-full">
                                <span className="flex items-center justify-between">
                                    <span className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-blue-700 dark:text-blue-300"><Icon name={icon} className="w-5 h-5" /></span>
                                    <span className="text-sm font-semibold text-gray-400 tabular-nums">0{i + 1}</span>
                                </span>
                                <span className="font-semibold">{title}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{text}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="mt-12" aria-labelledby="guides-heading">
                <SectionHeading eyebrow="Learn" title="Guides" id="guides-heading" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {GUIDES.map(([icon, title, text, to]) => (
                        <Link key={title} to={to} className="card p-5 flex gap-4 items-start hover:-translate-y-0.5 transition-transform">
                            <span className="w-10 h-10 shrink-0 rounded-2xl glass flex items-center justify-center text-blue-700 dark:text-blue-300"><Icon name={icon} className="w-5 h-5" /></span>
                            <span>
                                <span className="block font-semibold">{title}</span>
                                <span className="block mt-1 text-sm text-gray-600 dark:text-gray-300">{text}</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mt-12" aria-labelledby="faq-heading">
                <SectionHeading eyebrow="Questions" title="Frequently asked" id="faq-heading" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                    {FAQ.map(([q, a]) => (
                        <Accordion key={q} title={q}>
                            <p className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">{a}</p>
                        </Accordion>
                    ))}
                </div>
            </section>
        </div>
    );
}
