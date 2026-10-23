import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { LaptopDB } from '../data/laptops.js';
import { Icon } from '../lib/icons.jsx';
import { compareList, recentList, useList } from '../lib/stores.js';
import { laptopPath } from '../lib/format.js';
import { useTitle } from '../components/Layout.jsx';
import { CompareButton, DeviceTile, FavoriteButton, MacosChip, PriorityTags, ScoreBar, Unverified } from '../components/LaptopBits.jsx';
import { useToast } from '../components/Toast.jsx';
import RadarChart from '../components/RadarChart.jsx';

function formatValue(value) {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
}

// A <dl> of [label, value, verificationPath] rows, skipping empty values.
function SpecList({ laptop, rows }) {
    return (
        <dl className="spec-list">
            {rows.filter(([, value]) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && !value.length))
                .map(([label, value, path]) => (
                    <div key={label} className="spec-row">
                        <dt>{label}</dt>
                        <dd>{formatValue(value)}{path && <Unverified laptop={laptop} path={path} />}</dd>
                    </div>
                ))}
        </dl>
    );
}

function Section({ title, className = '', children }) {
    return (
        <section className={`card p-5 ${className}`}>
            <h2 className="section-title">{title}</h2>
            {children}
        </section>
    );
}

// Groups free-text port entries ("2x USB 3.1 Gen 1", "HDMI 1.4b") into type counts.
function portType(entry) {
    const e = entry.toLowerCase();
    if (e.includes('thunderbolt')) return 'Thunderbolt';
    if (e.includes('usb-c') || e.includes('type-c') || e.includes('usb c')) return 'USB-C';
    if (e.includes('usb')) return 'USB-A';
    if (e.includes('hdmi')) return 'HDMI';
    if (e.includes('displayport') || e.includes('mini dp')) return 'DisplayPort';
    if (e.includes('ethernet') || e.includes('rj45')) return 'Ethernet';
    if (e.includes('microsd') || e.includes('micro sd')) return 'microSD';
    if (/\bsd\b/.test(e)) return 'SD card';
    if (e.includes('audio') || e.includes('headphone')) return 'Audio jack';
    return null;
}

function PortSummary({ ports }) {
    const counts = {};
    Object.values(ports).flat().filter(Boolean).forEach(entry => {
        String(entry).split(/,\s*/).forEach(part => {
            const type = portType(part);
            if (!type || /^none/i.test(part)) return;
            const m = part.match(/(\d+)\s*x/i);
            counts[type] = (counts[type] || 0) + (m ? parseInt(m[1], 10) : 1);
        });
    });
    const entries = Object.entries(counts);
    if (!entries.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mb-3">
            {entries.map(([type, n]) => (
                <span key={type} className="spec-chip !pr-3">{type}{n > 1 && <span className="spec-chip-value !px-2">&times;{n}</span>}</span>
            ))}
        </div>
    );
}

function linkLabel(url) {
    try {
        const u = new URL(url);
        return u.hostname === 'github.com' ? `GitHub: ${u.pathname.slice(1)}` : u.hostname + u.pathname.replace(/\/$/, '');
    } catch (e) {
        return url;
    }
}

function NotFound({ id }) {
    useTitle('Laptop not found');
    return (
        <div className="card p-8 text-center">
            <h1 className="text-2xl font-bold">Laptop not found</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">There's no laptop with the ID “{id}”.</p>
            <Link to="/explorer" className="btn-primary mt-6">Browse all laptops</Link>
        </div>
    );
}

function Detail({ laptop }) {
    useTitle(laptop.name);
    const toast = useToast();
    const compared = useList(compareList);
    const chartLaptops = useMemo(() => [laptop], [laptop]);

    useEffect(() => recentList.add(laptop.id), [laptop.id]);

    const d = laptop.details;
    const ports = d.ports || {};
    const display = d.displayFeatures || {};
    const battery = d.batteryLife || {};
    const thermals = d.thermals || {};
    const keyboard = d.keyboard || {};
    const bios = d.biosVersion || {};
    const community = d.communitySupport || {};
    const guides = d.guides || {};
    const guideLinks = [guides.installation, ...(guides.additional || [])].filter(Boolean);
    const dims = d.dimensions ? `${d.dimensions.width} × ${d.dimensions.depth} × ${d.dimensions.height}` : '';

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast('Link copied');
        } catch (e) {
            toast("Copy failed. Use your browser's share menu instead.");
        }
    };

    return (
        <>
            <div className="card overflow-hidden md:grid md:grid-cols-2 animate-in">
                <DeviceTile laptop={laptop} large />
                <div className="p-5 sm:p-8 flex flex-col gap-4">
                    <div>
                        <p className="eyebrow">{laptop.brand}</p>
                        <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">{laptop.name}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{laptop.summary}</p>
                    </div>
                    <div className="max-w-xs"><ScoreBar score={laptop.score} /></div>
                    <div className="flex flex-wrap gap-1.5"><PriorityTags laptop={laptop} /></div>
                    <div className="flex flex-wrap items-center gap-2">
                        <MacosChip label="Oldest" value={d.minMacosSupport} />
                        <MacosChip label="Newest" value={d.maxMacosSupport} />
                        <Unverified laptop={laptop} path="details.maxMacosSupport" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
                        <Link to={`${laptopPath(laptop.id)}/build`} className="btn-primary"><Icon name="wrench" /> Build guide</Link>
                        <CompareButton id={laptop.id} labels={['Add to comparison', 'In comparison']} />
                        <button type="button" className="chip" onClick={copyLink}><Icon name="link" /> Copy link</button>
                        <FavoriteButton id={laptop.id} />
                        {compared.length >= 2 && (
                            <Link to={`/compare?ids=${compared.join(',')}`} className="btn-primary">Open comparison <Icon name="arrowRight" /></Link>
                        )}
                    </div>
                </div>
            </div>

            {laptop.source === 'community' ? (
                <div className="callout callout-info mt-6">
                    <p><strong>Community data.</strong> This laptop comes from a community-submitted list. Its specs describe a typical configuration, and its ratings are estimated from that list's compatibility score. Double-check everything for your exact model.</p>
                </div>
            ) : laptop.needsVerification?.length > 0 && (
                <div className="callout callout-warn mt-6">
                    <p>Fields marked <span className="badge-unverified !ml-0">Unverified</span> come from typical configurations and haven't been confirmed against a working build yet. Check them for your exact model before buying.</p>
                </div>
            )}

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Section title="Ratings"><RadarChart laptops={chartLaptops} /></Section>

                <Section title="Hardware" className="lg:col-span-2">
                    <SpecList laptop={laptop} rows={[
                        ['CPU', d.cpu, 'details.cpu'],
                        ['iGPU', d.igpu, 'details.igpu'],
                        ['dGPU', d.dgpu, 'details.dgpu'],
                        ['RAM', d.ram, 'details.ram'],
                        ['Storage', d.storage, 'details.storage'],
                        ['Wi-Fi / Bluetooth', d.wifiBluetooth, 'details.wifiBluetooth'],
                        ['Audio codec', d.audioCodec, 'details.audioCodec'],
                        ['Trackpad', d.trackpad, 'details.trackpad']
                    ]} />
                </Section>

                <Section title="macOS compatibility">
                    <SpecList laptop={laptop} rows={[
                        ['Oldest', d.minMacosSupport, 'details.minMacosSupport'],
                        ['Newest', d.maxMacosSupport, 'details.maxMacosSupport'],
                        ['Commonly run', d.macosSupport, 'details.macosSupport'],
                        ['BIOS', bios.recommended, 'details.biosVersion'],
                        ['BIOS notes', bios.notes, 'details.biosVersion']
                    ]} />
                </Section>

                <Section title="Known issues">
                    <ul className="list-disc pl-5 space-y-1.5 text-sm">
                        {(d.knownIssues?.length ? d.knownIssues : ['None documented']).map(i => <li key={i}>{i}</li>)}
                    </ul>
                </Section>

                <Section title="Install guides">
                    <Link to={`${laptopPath(laptop.id)}/build`} className="block mb-4 rounded-2xl p-3 bg-blue-500/10 ring-1 ring-blue-500/25 hover:bg-blue-500/15 transition-colors">
                        <span className="font-semibold text-blue-800 dark:text-blue-200">Step-by-step build guide for this laptop</span>
                        <span className="block text-sm text-gray-600 dark:text-gray-300">Every kext, SSDT and config.plist value it needs.</span>
                    </Link>
                    {guideLinks.length ? (
                        <>
                            <ul className="space-y-2 text-sm">
                                {guideLinks.map(url => (
                                    <li key={url}>
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 hover:underline break-all">
                                            {linkLabel(url)} <Icon name="external" className="icon w-3.5 h-3.5" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {community.rating && <p className="mt-4 text-sm"><span className="text-gray-500 dark:text-gray-400">Community support:</span> <strong>{community.rating}</strong></p>}
                            {community.resources && (
                                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                                    {community.resources.map(r => <li key={r}>{r}</li>)}
                                </ul>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-300">No model-specific repository yet. The build guide above covers what this laptop needs.</p>
                    )}
                </Section>

                <Section title="Display">
                    <SpecList laptop={laptop} rows={[
                        ['Resolution', d.screenResolution, 'details.screenResolution'],
                        ['Panel type', display.type, 'details.displayFeatures'],
                        ['Brightness', display.brightness, 'details.displayFeatures'],
                        ['Color gamut', display.colorGamut, 'details.displayFeatures'],
                        ['Touchscreen', display.touchscreen, 'details.displayFeatures']
                    ]} />
                </Section>

                <Section title="Ports">
                    <PortSummary ports={ports} />
                    <SpecList laptop={laptop} rows={[
                        ['USB', ports.usb, 'details.ports'],
                        ['Thunderbolt', ports.thunderbolt, 'details.ports'],
                        ['Video', ports.video, 'details.ports'],
                        ['Network', ports.network, 'details.ports'],
                        ['Other', ports.others, 'details.ports']
                    ]} />
                </Section>

                <Section title="Battery & build">
                    <SpecList laptop={laptop} rows={[
                        ['Battery life', battery.average, 'details.batteryLife'],
                        ['Capacity', battery.capacity, 'details.batteryLife'],
                        ['Weight', d.weight, 'details.weight'],
                        ['Dimensions', dims, 'details.dimensions'],
                        ['Keyboard', keyboard.type ? `${keyboard.type}${keyboard.backlit ? ', backlit' : ''}` : '', 'details.keyboard']
                    ]} />
                </Section>

                <Section title="Thermals">
                    <SpecList laptop={laptop} rows={[
                        ['Idle', thermals.idleTemp, 'details.thermals'],
                        ['Load', thermals.loadTemp, 'details.thermals'],
                        ['Cooling', thermals.coolingSystem, 'details.thermals'],
                        ['Undervolting', thermals.undervolting, 'details.thermals']
                    ]} />
                </Section>
            </div>
        </>
    );
}

export default function LaptopDetail() {
    const { id } = useParams();
    const laptop = LaptopDB.get(id);
    return (
        <div className="page">
            <Link to="/explorer" className="chip"><Icon name="arrowLeft" /> Back to Explorer</Link>
            <div className="mt-4">{laptop ? <Detail laptop={laptop} /> : <NotFound id={id} />}</div>
        </div>
    );
}
