import { useTitle } from '../components/Layout.jsx';
import { Icon } from '../lib/icons.jsx';
import { useLayoutEffect, useRef, useState } from 'react';

// One collapsible issue. It hides itself when its text doesn't contain every word of the
// filter query, and opens when the query matches so the answer is visible straight away.
function Issue({ title, query, children }) {
    const ref = useRef(null);
    const [match, setMatch] = useState(true);
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

    useLayoutEffect(() => {
        const text = ref.current.textContent.toLowerCase();
        const matches = terms.every(t => text.includes(t));
        setMatch(matches);
        if (matches && terms.length) ref.current.open = true;
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <details ref={ref} className="card accordion" hidden={!match}>
            <summary><Icon name="chevron" className="chevron w-4 h-4" />{title}</summary>
            <div className="prose-guide px-4 pb-4 text-sm">{children}</div>
        </details>
    );
}

export default function Troubleshooting() {
    useTitle('Troubleshooting');
    const [query, setQuery] = useState('');
    return (
        <div className="page">
            <h1 className="page-title">Troubleshooting</h1>
            <p className="page-lead">The most common laptop problems and where to start fixing them. Always boot with <code className="px-1 rounded bg-gray-100 dark:bg-gray-700 text-base">-v</code> so you can see where things stop.</p>

            <div className="mt-6 max-w-3xl">
                <label htmlFor="issue-filter" className="sr-only">Filter issues</label>
                <input type="search" id="issue-filter" className="input" placeholder="Filter issues, e.g. “sleep” or “EXITBS”"
                       value={query} onChange={e => setQuery(e.target.value)} />
            </div>

            <div id="issues" className="mt-6 max-w-3xl space-y-8">
                <section className="[&:not(:has(details:not([hidden])))]:hidden">
                    <h2 className="text-xl font-bold mb-3">Booting the installer</h2>
                    <div className="space-y-3">
                        <Issue query={query} title={<>Stuck at <code>EndRandomSeed</code> or “Security Violation”</>}>
                                <ul>
                                    <li>Make sure <code>HfsPlus.efi</code> (or <code>OpenHfsPlus.efi</code>) and <code>OpenRuntime.efi</code> are in <code>EFI/OC/Drivers</code> and listed in <code>UEFI &gt; Drivers</code>.</li>
                                    <li>For a recovery-based installer, set <code>Misc &gt; Security &gt; DmgLoading</code> to <code>Signed</code> and <code>SecureBootModel</code> to <code>Disabled</code> while installing.</li>
                                    <li>Run your config through OpenCore's <code>ocvalidate</code> tool to catch typos and missing keys.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>Stuck at <code>[EB|#LOG:EXITBS:START]</code></>}>
                                <ul>
                                    <li>This is almost always a <strong>Booter quirks</strong> problem. Recheck every quirk against the Dortania page for your exact CPU generation.</li>
                                    <li>Confirm the BIOS settings: CSM off, Secure Boot off, VT-d off (or <code>DisableIoMapper</code> on).</li>
                                    <li>Check you're using the correct SSDTs. A missing or wrong SSDT-EC or SSDT-PLUG can also stall here.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>Prohibited sign or “Waiting for Root Device”</>}>
                                <ul>
                                    <li>Usually USB: macOS can't see the installer. Try a USB&nbsp;2.0 port, and map your ports with USBToolBox.</li>
                                    <li>Set SATA to <strong>AHCI</strong> (not RAID/Intel RST) in the BIOS.</li>
                                    <li>Make sure XHCI hand-off is enabled in the BIOS.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>Kernel panic mentioning CPU power management or CFG Lock</>}>
                                <p>Your firmware has CFG Lock enabled. Disable it in the BIOS (sometimes only possible by editing a hidden BIOS variable), or enable <code>Kernel &gt; Quirks &gt; AppleXcpmCfgLock</code>.</p>
                            </Issue>
                    </div>
                </section>

                <section className="[&:not(:has(details:not([hidden])))]:hidden">
                    <h2 className="text-xl font-bold mb-3">Graphics &amp; display</h2>
                    <div className="space-y-3">
                        <Issue query={query} title={<>Black screen after the verbose text ends</>}>
                                <ul>
                                    <li>Check <code>AAPL,ig-platform-id</code> and <code>device-id</code> under <code>DeviceProperties</code> match the recommended laptop values for your iGPU.</li>
                                    <li>If your BIOS has only 32&nbsp;MB DVMT, add the <code>framebuffer-stolenmem</code> and <code>framebuffer-fbmem</code> patches.</li>
                                    <li>On some 8th gen and newer laptops the backlight stays off. Try the <code>-igfxblr</code> boot argument.</li>
                                    <li>Disable any NVIDIA dGPU with an SSDT (SSDT-dGPU-Off) so macOS doesn't try to use it.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>No brightness slider or brightness keys</>}>
                                <p>Add <strong>SSDT-PNLF</strong> (generate it with SSDTTime) for the slider, and <strong>BrightnessKeys.kext</strong> for the function keys.</p>
                            </Issue>
                    </div>
                </section>

                <section className="[&:not(:has(details:not([hidden])))]:hidden">
                    <h2 className="text-xl font-bold mb-3">Wireless, audio &amp; input</h2>
                    <div className="space-y-3">
                        <Issue query={query} title={<>Wi-Fi doesn't work</>}>
                                <ul>
                                    <li><strong>Intel cards:</strong> use <code>AirportItlwm</code> for the version of macOS you're running (each macOS version has its own build), or <code>itlwm</code> with the HeliPort app.</li>
                                    <li><strong>Broadcom cards:</strong> on macOS 14 Sonoma and later, Apple removed the drivers for older Broadcom chips. You'll need OpenCore Legacy Patcher root patches.</li>
                                    <li><strong>Realtek / Qualcomm / MediaTek:</strong> unsupported. Replace the card if it's an M.2 module.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>Bluetooth doesn't turn on</>}>
                                <p>For Intel Bluetooth on Monterey and later, use <code>IntelBluetoothFirmware</code> together with <code>BlueToolFixup</code> (from BrcmPatchRAM). For Broadcom, use BrcmPatchRAM3, BrcmFirmwareData and BlueToolFixup.</p>
                            </Issue>
                        <Issue query={query} title={<>No sound</>}>
                                <ul>
                                    <li>Find your codec's supported layout-ids in the AppleALC documentation.</li>
                                    <li>Test quickly with the <code>alcid=XX</code> boot argument, then make the working value permanent in <code>DeviceProperties</code>.</li>
                                    <li>If speakers work but headphones don't (or vice versa), try other layout-ids before anything else.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>Trackpad doesn't work or has no gestures</>}>
                                <ul>
                                    <li><strong>PS/2:</strong> VoodooPS2Controller.</li>
                                    <li><strong>I2C:</strong> VoodooI2C + VoodooI2CHID, usually with an SSDT-GPI0 or SSDT-XOSI patch so the controller is enabled.</li>
                                    <li><strong>Synaptics SMBus (many ThinkPads):</strong> VoodooRMI on top of VoodooPS2 for full gestures.</li>
                                </ul>
                            </Issue>
                    </div>
                </section>

                <section className="[&:not(:has(details:not([hidden])))]:hidden">
                    <h2 className="text-xl font-bold mb-3">Power, sleep &amp; battery</h2>
                    <div className="space-y-3">
                        <Issue query={query} title={<>Wakes immediately after sleep, or won't wake</>}>
                                <ul>
                                    <li>Finish USB mapping first: unmapped ports are the #1 cause of instant wake.</li>
                                    <li>Disable hibernation: <code>sudo pmset -a hibernatemode 0</code>, plus Power Nap and “Wake for network access”.</li>
                                    <li>Run <code>pmset -g log | grep -i wake</code> to see what's waking the machine.</li>
                                    <li>Some laptops (e.g. later ThinkPads) default to S0 Modern Standby. Switch the BIOS sleep state to “Linux”/S3 if it's offered.</li>
                                </ul>
                            </Issue>
                        <Issue query={query} title={<>Battery percentage missing or stuck</>}>
                                <p>Add <strong>SMCBatteryManager</strong> (part of VirtualSMC). If it still doesn't update, your embedded controller probably uses multi-byte fields; add <strong>ECEnabler.kext</strong> instead of hand-patching ACPI.</p>
                            </Issue>
                    </div>
                </section>

                <section className="[&:not(:has(details:not([hidden])))]:hidden">
                    <h2 className="text-xl font-bold mb-3">Apple services</h2>
                    <div className="space-y-3">
                        <Issue query={query} title={<>iMessage, FaceTime or iCloud won't sign in</>}>
                                <ul>
                                    <li>Generate a unique serial with GenSMBIOS and check on Apple's coverage site that it's <em>not</em> already in use.</li>
                                    <li>Make sure your network interface is <code>en0</code> and marked as built-in.</li>
                                    <li>Set <code>ROM</code> under <code>PlatformInfo &gt; Generic</code> to your network card's MAC address.</li>
                                </ul>
                            </Issue>
                    </div>
                </section>
            </div>
            <p id="issue-empty" className="hidden mt-6 max-w-3xl text-sm text-gray-600 dark:text-gray-400 [#issues:not(:has(details:not([hidden])))+&]:block">No matching issues. Try the <a className="text-blue-700 dark:text-blue-300 hover:underline" href="https://dortania.github.io/OpenCore-Install-Guide/troubleshooting/troubleshooting.html" target="_blank" rel="noopener noreferrer">Dortania troubleshooting guide</a>.</p>

            <p className="mt-10 max-w-3xl text-sm text-gray-600 dark:text-gray-400">Still stuck? The <a className="text-blue-700 dark:text-blue-300 hover:underline" href="https://dortania.github.io/OpenCore-Install-Guide/troubleshooting/troubleshooting.html" target="_blank" rel="noopener noreferrer">Dortania troubleshooting guide</a> goes much deeper. When you ask for help on r/hackintosh, include your EFI, your hardware list and a photo of where verbose boot stops.</p>
        </div>
    );
}
