import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { LaptopDB } from '../data/laptops.js';
import { DRIVERS, KEXTS, LINKS, SSDTS, TOOLS } from '../data/kexts.js';
import { buildPlan, defaultTarget, detectOptions, targetVersions } from '../lib/buildPlan.js';
import { laptopPath } from '../lib/format.js';
import { Icon } from '../lib/icons.jsx';
import { useTitle } from '../components/Layout.jsx';
import { useToast } from '../components/Toast.jsx';

function External({ href, children, className = 'text-blue-700 dark:text-blue-300 hover:underline' }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {children} <Icon name="external" className="icon w-3.5 h-3.5" />
        </a>
    );
}

function Step({ n, title, children, id }) {
    return (
        <section id={id} className="card p-5 sm:p-6 scroll-mt-28">
            <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center tabular-nums">{n}</span>
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function Choice({ id, label, value, options, onChange, detected }) {
    return (
        <div>
            <label htmlFor={id} className="label flex items-center gap-2">
                {label}
                {detected && <span className="tag !text-[0.65rem]">From specs</span>}
            </label>
            <select id={id} className="input" value={value} onChange={e => onChange(e.target.value)}>
                {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
            </select>
        </div>
    );
}

function PropsTable({ path, rows }) {
    return (
        <div className="table-scroll !mx-0 rounded-2xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <table>
                <thead className="bg-white/40 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                    <tr><th scope="col" colSpan={3} className="font-mono text-xs">{path}</th></tr>
                    <tr><th scope="col">Key</th><th scope="col">Type</th><th scope="col">Value</th></tr>
                </thead>
                <tbody>
                    {rows.map(([key, type, value]) => (
                        <tr key={key} className="border-t border-gray-900/5 dark:border-white/10">
                            <td className="font-mono">{key}</td><td>{type}</td><td className="font-mono font-semibold">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Remembers which kexts the reader has collected, per laptop, on this device.
function useChecklist(id) {
    const key = `buildChecklist:${id}`;
    const [done, setDone] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
        } catch (e) {
            return new Set();
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify([...done]));
        } catch (e) {
            // Not persisted; the checklist still works for this visit.
        }
    }, [key, done]);
    const toggle = name => setDone(prev => {
        const next = new Set(prev);
        next.has(name) ? next.delete(name) : next.add(name);
        return next;
    });
    return [done, toggle];
}

function Guide({ laptop }) {
    useTitle(`Build guide: ${laptop.name}`);
    const toast = useToast();
    const detected = useMemo(() => detectOptions(laptop), [laptop]);
    const [cpu, setCpu] = useState(detected.cpu.default);
    const versions = targetVersions(laptop, cpu);
    const [target, setTarget] = useState(() => defaultTarget(laptop, detected.cpu.default));
    const [wifi, setWifi] = useState(detected.wifi.default);
    const [trackpad, setTrackpad] = useState(detected.trackpad.default);
    const [ethernet, setEthernet] = useState(detected.ethernet.default);
    const [done, toggleDone] = useChecklist(laptop.id);

    // Changing the CPU can change which macOS versions are available.
    const safeTarget = versions.includes(target) ? target : defaultTarget(laptop, cpu);

    const plan = buildPlan(laptop, {
        cpu, target: safeTarget, wifi, trackpad, ethernet,
        cpuCertain: detected.cpu.certain, trackpadCertain: detected.trackpad.certain, ethernetCertain: detected.ethernet.certain
    });

    const groups = plan.kexts.reduce((acc, k) => {
        (acc[k.group] ||= []).push(k);
        return acc;
    }, {});
    const required = plan.kexts.filter(k => k.required);
    const collected = required.filter(k => done.has(k.name)).length;

    const copy = async (text, message) => {
        try {
            await navigator.clipboard.writeText(text);
            toast(message);
        } catch (e) {
            toast('Copy failed');
        }
    };

    const kextText = [
        `EFI/OC/Kexts for ${laptop.name} (macOS ${plan.target})`,
        ...plan.kexts.map(k => `- ${k.name}${k.required ? '' : ' (if needed)'}: ${KEXTS[k.name].url}`),
        '',
        'EFI/OC/ACPI:',
        ...plan.ssdts.map(s => `- ${s}`),
        '',
        `SMBIOS: ${plan.smbios.model}`,
        `iGPU PciRoot(0x0)/Pci(0x2,0x0): ${plan.igpu.props.map(([k, , val]) => `${k}=${val}`).join(', ')}`
    ].join('\n');

    return (
        <>
            <header className="card p-5 sm:p-8 animate-in">
                <p className="eyebrow">OpenCore build guide</p>
                <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">{laptop.name}</h1>
                <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-3xl">
                    Every kext, SSDT and config.plist value this laptop needs, worked out from its hardware using the rules in Dortania's OpenCore guide. Adjust the choices below to match your exact unit, and the guide updates.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <Choice id="cpu" label="CPU" value={cpu} onChange={setCpu} options={detected.cpu.options} detected={detected.cpu.certain} />
                    <Choice id="target" label="macOS to install" value={safeTarget} onChange={setTarget} options={versions.map(x => [x, x])} />
                    <Choice id="wifi" label="Wi-Fi card" value={wifi} onChange={setWifi} options={detected.wifi.options} detected={detected.wifi.info.intel || detected.wifi.info.broadcom} />
                    <Choice id="trackpad" label="Trackpad" value={trackpad} onChange={setTrackpad} options={detected.trackpad.options} detected={detected.trackpad.certain} />
                    <Choice id="ethernet" label="Ethernet" value={ethernet} onChange={setEthernet} options={detected.ethernet.options} detected={detected.ethernet.certain} />
                </div>
            </header>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="card p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Platform</p>
                    <p className="mt-1 font-bold leading-snug">{plan.platform.label}</p>
                    <External href={plan.platform.configUrl} className="mt-1 inline-block text-sm text-blue-700 dark:text-blue-300 hover:underline">Dortania config</External>
                </div>
                <div className="card p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">SMBIOS</p>
                    <p className="mt-1 font-bold font-mono">{plan.smbios.model}</p>
                </div>
                <div className="card p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">iGPU platform-id</p>
                    <p className="mt-1 font-bold font-mono">{plan.igpu.props[0][2]}</p>
                </div>
                <div className="card p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Required kexts collected</p>
                    <p className="mt-1 font-bold tabular-nums">{collected} / {required.length}</p>
                    <div className="score-track mt-2"><div className="score-fill score-excellent" style={{ width: `${(collected / required.length) * 100}%` }} /></div>
                </div>
            </div>

            {plan.warnings.length > 0 && (
                <div className="callout callout-warn mt-5 !mb-0">
                    <p className="font-semibold mb-1">Before you start</p>
                    <ul className="list-disc pl-5 space-y-1">{plan.warnings.map(w => <li key={w}>{w}</li>)}</ul>
                </div>
            )}
            {plan.checks.length > 0 && (
                <div className="callout callout-info mt-4 !mb-0">
                    <p className="font-semibold mb-1">Check on your laptop</p>
                    <ul className="list-disc pl-5 space-y-1">{plan.checks.map(c => <li key={c}>{c}</li>)}</ul>
                </div>
            )}

            <div className="mt-6 space-y-5">
                <Step n={1} title="BIOS settings" id="bios">
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                        {plan.bios.map(b => <li key={b}>{b}</li>)}
                    </ul>
                </Step>

                <Step n={2} title="Download the tools and OpenCore" id="tools">
                    <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                        {TOOLS.map(t => (
                            <li key={t.name}><External href={t.url}><strong>{t.name}</strong></External><br /><span className="text-gray-600 dark:text-gray-300">{t.why}</span></li>
                        ))}
                    </ul>
                    <h3 className="mt-5 font-semibold">Firmware drivers <span className="font-normal text-sm text-gray-500 dark:text-gray-400">EFI/OC/Drivers</span></h3>
                    <ul className="mt-2 space-y-2 text-sm">
                        {DRIVERS.map(dr => (
                            <li key={dr.name}><External href={dr.url}><span className="font-mono">{dr.name}</span></External> <span className="text-gray-600 dark:text-gray-300">: {dr.why}</span></li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Make the installer USB with <External href={LINKS.usbInstaller}>Dortania's USB guide</External>: <code className="px-1 rounded bg-gray-900/5 dark:bg-white/10">macrecovery.py</code> from Windows or Linux, or <code className="px-1 rounded bg-gray-900/5 dark:bg-white/10">createinstallmedia</code> from a Mac.</p>
                </Step>

                <Step n={3} title="Kexts" id="kexts">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Put these in <code className="px-1 rounded bg-gray-900/5 dark:bg-white/10">EFI/OC/Kexts</code>, then run ProperTree's OC Snapshot so they load in the right order. Tick them off as you go.</p>
                        <button type="button" className="chip" onClick={() => copy(kextText, 'Kext list copied')}><Icon name="link" /> Copy list</button>
                    </div>
                    <div className="mt-4 space-y-5">
                        {Object.entries(groups).map(([group, items]) => (
                            <div key={group}>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{group}</h3>
                                <ul className="mt-2 divide-y divide-gray-900/5 dark:divide-white/10">
                                    {items.map(k => (
                                        <li key={k.name} className="py-3 flex gap-3">
                                            <input type="checkbox" id={`k-${k.name}`} className="mt-1 w-4 h-4 accent-blue-600 shrink-0"
                                                   checked={done.has(k.name)} onChange={() => toggleDone(k.name)} />
                                            <div className="min-w-0">
                                                <label htmlFor={`k-${k.name}`} className="font-mono font-semibold cursor-pointer">{k.name}.kext</label>
                                                {k.required ? <span className="tag ml-2">Required</span> : <span className="badge-unverified !normal-case !tracking-normal">If needed</span>}
                                                <External href={KEXTS[k.name].url} className="ml-2 text-xs text-blue-700 dark:text-blue-300 hover:underline">Download</External>
                                                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{KEXTS[k.name].why}</p>
                                                {k.when && <p className="mt-0.5 text-sm text-gray-800 dark:text-gray-200">{k.when}</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Step>

                <Step n={4} title="ACPI patches (SSDTs)" id="ssdts">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Generate them from your own laptop's ACPI tables with SSDTTime where it can, and follow the linked Dortania page for the rest. Put the .aml files in <code className="px-1 rounded bg-gray-900/5 dark:bg-white/10">EFI/OC/ACPI</code>.</p>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                        {plan.ssdts.map(s => (
                            <li key={s} className="rounded-2xl p-3 bg-white/40 dark:bg-white/5 ring-1 ring-gray-900/5 dark:ring-white/10">
                                <External href={SSDTS[s].url}><span className="font-mono font-semibold">{s}</span></External>
                                <p className="mt-0.5 text-gray-600 dark:text-gray-300">{SSDTS[s].why}</p>
                            </li>
                        ))}
                    </ul>
                </Step>

                <Step n={5} title="config.plist" id="config">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Start from OpenCore's Sample.plist and work through <External href={plan.platform.configUrl}>Dortania's {plan.platform.label} laptop guide</External> section by section. These are the values specific to this laptop:
                    </p>

                    <h3 className="mt-5 font-semibold">PlatformInfo &gt; Generic</h3>
                    <p className="mt-1 text-sm"><span className="font-mono font-semibold">SystemProductName = {plan.smbios.model}</span></p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{plan.smbios.note} Generate the serial, MLB and SystemUUID with GenSMBIOS. <External href={LINKS.smbiosSupport}>SMBIOS support table</External></p>

                    <h3 className="mt-5 font-semibold">DeviceProperties &gt; Add (iGPU)</h3>
                    <div className="mt-2"><PropsTable path="PciRoot(0x0)/Pci(0x2,0x0)" rows={plan.igpu.props} /></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {plan.igpu.note}
                        {plan.igpu.altPlatformIds.length > 0 && <> If you get no acceleration (7MB VRAM), try <span className="font-mono">{plan.igpu.altPlatformIds.join(' or ')}</span>.</>}
                    </p>
                    <details className="mt-3 text-sm">
                        <summary className="cursor-pointer font-medium">Kernel panic on boot? Add the DVMT patch</summary>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">If your BIOS can't raise DVMT pre-allocated memory, add these to the same iGPU entry:</p>
                        <div className="mt-2"><PropsTable path="PciRoot(0x0)/Pci(0x2,0x0)" rows={plan.igpu.dvmtProps} /></div>
                    </details>

                    <h3 className="mt-5 font-semibold">Audio</h3>
                    {plan.target === 'Tahoe' ? (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">AppleALC doesn't work on Tahoe. For speakers and headphones, set <span className="font-mono">csr-active-config</span> to <span className="font-mono">03000000</span> and install <External href={KEXTS.VoodooHDA.url}>VoodooHDA</External> to /Library/Extensions after installing macOS. See <External href={LINKS.tahoe}>Dortania's Tahoe notes</External>.</p>
                    ) : plan.audio.layouts.length ? (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Codec <strong>{plan.audio.codec}</strong>. Try these layout-ids one at a time with the <span className="font-mono">alcid=</span> boot argument: <span className="font-mono">{plan.audio.layouts.join(', ')}</span>.
                            Once speakers, headphones and the mic all work, run <span className="font-mono">gfxutil -f HDEF</span> and add <span className="font-mono">layout-id</span> (Number) under that path. <External href={LINKS.audio}>Audio guide</External>
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Look up your codec's layout-ids on the <External href={LINKS.appleAlcCodecs}>AppleALC supported codecs list</External> and test them with <span className="font-mono">alcid=</span>.</p>
                    )}

                    <h3 className="mt-5 font-semibold">NVRAM &gt; boot-args</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                        {plan.bootArgs.map(([arg, why]) => (
                            <li key={arg}><span className="font-mono font-semibold">{arg}</span> <span className="text-gray-600 dark:text-gray-300">: {why}</span></li>
                        ))}
                    </ul>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Check the finished config with OpenCore's <span className="font-mono">ocvalidate</span> before booting.</p>
                </Step>

                <Step n={6} title="Install macOS" id="install">
                    <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <li>Boot the USB from the firmware boot menu and pick the installer in OpenCore.</li>
                        <li>In Disk Utility, choose View &gt; Show All Devices and erase the drive as APFS with a GUID Partition Map.</li>
                        <li>Install, choosing the macOS Installer entry after each reboot until it disappears.</li>
                    </ol>
                    <p className="mt-3 text-sm">Stuck? Note the last lines of verbose text and check <Link to="/troubleshooting" className="text-blue-700 dark:text-blue-300 hover:underline">Troubleshooting</Link>.</p>
                </Step>

                <Step n={7} title="After installing" id="post-install">
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <li>Copy your EFI folder to the internal drive's EFI partition so you can boot without the USB.</li>
                        <li>Map USB ports with USBToolBox, add USBToolBox.kext and the generated UTBMap.kext. <External href={LINKS.usbMapping}>USB mapping guide</External></li>
                        <li>Make the working audio layout-id permanent (step 5).</li>
                        <li>Check sleep, wake, battery percentage and brightness keys. Disable hibernation with <span className="font-mono">sudo pmset -a hibernatemode 0</span>. <External href={LINKS.sleep}>Sleep guide</External></li>
                        <li>For iMessage and FaceTime, make sure your serial is unique and en0 is built-in. <External href={LINKS.iservices}>iServices guide</External></li>
                        <li>Remove <span className="font-mono">-v keepsyms=1 debug=0x100</span> once everything works.</li>
                    </ul>
                </Step>
            </div>

            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                This guide applies Dortania's general rules to this laptop's listed hardware. It isn't a tested EFI for this exact model, so read the linked Dortania pages as you go. The <External href={LINKS.installGuide}>Dortania OpenCore Install Guide</External> is the authoritative source.
            </p>
        </>
    );
}

function NotFound() {
    useTitle('Laptop not found');
    return (
        <div className="card p-8 text-center">
            <h1 className="text-2xl font-bold">Laptop not found</h1>
            <Link to="/explorer" className="btn-primary mt-6">Browse all laptops</Link>
        </div>
    );
}

export default function BuildPlan() {
    const { id } = useParams();
    const laptop = LaptopDB.get(id);
    return (
        <div className="page">
            <div className="flex flex-wrap gap-2">
                <Link to={laptop ? laptopPath(id) : '/explorer'} className="chip"><Icon name="arrowLeft" /> {laptop ? laptop.name : 'Explorer'}</Link>
                <Link to="/build-guide" className="chip"><Icon name="book" /> General build guide</Link>
            </div>
            <div className="mt-4">
                {laptop ? <Guide key={laptop.id} laptop={laptop} /> : <NotFound />}
            </div>
        </div>
    );
}
