import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LaptopDB, PRIORITY_LABELS } from '../data/laptops.js';
import { compareList, useList } from '../lib/stores.js';
import { laptopPath } from '../lib/format.js';
import { useTitle } from '../components/Layout.jsx';
import { Unverified } from '../components/LaptopBits.jsx';
import RadarChart from '../components/RadarChart.jsx';

const OPTIONS = LaptopDB.all().sort((a, b) => a.name.localeCompare(b.name));

// [label, getter, verificationPath]
const ROWS = [
    ['Score', l => `${l.score.toFixed(1)} / 10`],
    ['Best for', l => l.priority.map(p => PRIORITY_LABELS[p] || p).join(', ')],
    ['macOS', l => `${l.details.minMacosSupport} – ${l.details.maxMacosSupport}`, 'details.maxMacosSupport'],
    ['CPU', l => l.details.cpu, 'details.cpu'],
    ['iGPU', l => l.details.igpu, 'details.igpu'],
    ['dGPU', l => l.details.dgpu || 'None', 'details.dgpu'],
    ['RAM', l => l.details.ram, 'details.ram'],
    ['Storage', l => l.details.storage, 'details.storage'],
    ['Wi-Fi / BT', l => l.details.wifiBluetooth, 'details.wifiBluetooth'],
    ['Audio', l => l.details.audioCodec, 'details.audioCodec'],
    ['Trackpad', l => l.details.trackpad, 'details.trackpad'],
    ['Display', l => l.details.screenResolution, 'details.screenResolution'],
    ['Battery', l => l.details.batteryLife?.average || l.details.batteryLife?.capacity, 'details.batteryLife'],
    ['Weight', l => l.details.weight, 'details.weight'],
    ['Thunderbolt', l => l.details.ports?.thunderbolt, 'details.ports'],
    ['Known issues', l => (l.details.knownIssues || []).join('; ')],
    ['Community', l => l.details.communitySupport?.rating]
];

export default function Compare() {
    useTitle('Compare laptops');
    const [params, setParams] = useSearchParams();
    const ids = useList(compareList);

    // A shared link (?ids=a,b) replaces this device's saved picks; afterwards the URL mirrors them.
    useEffect(() => {
        const fromUrl = [...new Set((params.get('ids') || '').split(',').filter(id => LaptopDB.get(id)))];
        if (fromUrl.length && fromUrl.join(',') !== ids.join(',')) compareList.save(fromUrl);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setParams(ids.length ? { ids: ids.join(',') } : {}, { replace: true });
    }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

    const laptops = useMemo(() => ids.map(id => LaptopDB.get(id)), [ids]);

    const pick = (slot, id) => {
        const next = [...ids];
        next[slot] = id;
        compareList.save(next.filter(Boolean));
    };

    return (
        <div className="page">
            <h1 className="page-title">Compare laptops</h1>
            <p className="page-lead">Choose up to three laptops. Your picks are saved on this device, and the page link can be shared.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[0, 1, 2].map(slot => (
                    <div key={slot}>
                        <label htmlFor={`pick-${slot}`} className="label">Laptop {slot + 1}</label>
                        <select id={`pick-${slot}`} className="input" value={ids[slot] || ''} onChange={e => pick(slot, e.target.value)}>
                            <option value="">None</option>
                            {OPTIONS.map(l => (
                                <option key={l.id} value={l.id} disabled={ids.includes(l.id) && ids[slot] !== l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {laptops.length < 2 ? (
                <div className="card p-8 mt-6 text-center">
                    <p className="font-medium">Pick at least two laptops to compare.</p>
                    <Link to="/explorer" className="btn-primary mt-4">Browse the Explorer</Link>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    <section className="card p-5">
                        <h2 className="section-title">Ratings</h2>
                        <RadarChart laptops={laptops} className="relative h-80 max-w-xl mx-auto" />
                    </section>

                    <section className="card overflow-hidden">
                        <h2 className="section-title px-5 pt-5">Specifications</h2>
                        <div className="table-scroll !mx-0">
                            <table>
                                <thead className="bg-white/40 dark:bg-white/5">
                                    <tr>
                                        <th scope="col" className="sticky left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur w-28 sm:w-40"><span className="sr-only">Spec</span></th>
                                        {laptops.map(l => (
                                            <th key={l.id} scope="col" className="min-w-[12rem]">
                                                <Link to={laptopPath(l.id)} className="font-semibold text-blue-700 dark:text-blue-300 hover:underline">{l.name}</Link>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ROWS.map(([label, get, path]) => (
                                        <tr key={label} className="border-t border-gray-900/5 dark:border-white/10">
                                            <th scope="row" className="sticky left-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur font-medium text-gray-500 dark:text-gray-400">{label}</th>
                                            {laptops.map(l => (
                                                <td key={l.id}>{get(l) || '—'}{path && <Unverified laptop={l} path={path} />}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
