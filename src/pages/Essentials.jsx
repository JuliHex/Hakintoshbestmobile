import { Link } from 'react-router';
import { Icon } from '../lib/icons.jsx';
import { useTitle } from '../components/Layout.jsx';

export default function Essentials() {
    useTitle('The Essentials');
    return (
        <div className="page">
            <h1 className="page-title">The Essentials</h1>
            <p className="page-lead">Beyond hardware, a successful build needs the right software, a bit of patience, and good sources. Here's the short list.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="card p-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-5">The build at a glance</h2>
                    <ol className="relative border-l-2 border-dashed border-gray-300 dark:border-gray-600 ml-3 space-y-6">
                        <li className="pl-6 relative">
                            <span className="absolute -left-[0.95rem] top-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center ring-4 ring-white/70 dark:ring-white/10">1</span>
                            <h3 className="font-semibold">Research &amp; planning</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Identify your exact CPU, Wi-Fi card, audio codec and trackpad. Read the Dortania guide for your CPU generation.</p>
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute -left-[0.95rem] top-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center ring-4 ring-white/70 dark:ring-white/10">2</span>
                            <h3 className="font-semibold">BIOS &amp; USB installer</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Configure the BIOS, download macOS, and build an OpenCore EFI on a USB stick.</p>
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute -left-[0.95rem] top-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center ring-4 ring-white/70 dark:ring-white/10">3</span>
                            <h3 className="font-semibold">Installation</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Boot the USB and install macOS. Expect to troubleshoot a hang or two.</p>
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute -left-[0.95rem] top-0 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center ring-4 ring-white/70 dark:ring-white/10">4</span>
                            <h3 className="font-semibold">Post-install tuning</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Copy the EFI to the internal drive, then fix Wi-Fi, audio, USB mapping, sleep and battery reporting.</p>
                        </li>
                    </ol>
                    <Link to="/build-guide" className="btn-primary mt-6">Read the full Build Guide <Icon name="arrowRight" /></Link>
                </section>

                <section className="card p-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">Mindset</h2>
                    <p className="text-gray-700 dark:text-gray-300">Hackintoshing is a rewarding hobby, not a replacement for a real Mac if you need everything to work flawlessly out of the box. Budget a weekend for the first build.</p>
                    <div className="callout callout-warn mt-4 mb-0">
                        <p><strong>Back up before every update.</strong> macOS updates can break kexts or patches. Keep a copy of your working EFI on a spare USB stick, and wait a week or two after a release for the community to report problems.</p>
                    </div>
                    <div className="callout callout-info mt-4 mb-0">
                        <p>macOS 26 Tahoe is the last macOS release for Intel Macs, which means it's the last one for Hackintoshes too.</p>
                    </div>
                </section>

                <section className="card p-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Toolbox</h2>
                    <ul className="space-y-3 text-sm">
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/acidanthera/OpenCorePkg" target="_blank" rel="noopener noreferrer">OpenCore <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">The bootloader that makes it all work.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/corpnewt/ProperTree" target="_blank" rel="noopener noreferrer">ProperTree <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Cross-platform editor for <code className="text-xs">config.plist</code>, with OC Snapshot.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/corpnewt/SSDTTime" target="_blank" rel="noopener noreferrer">SSDTTime <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Generates the ACPI patches (SSDTs) your laptop needs.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/USBToolBox/tool" target="_blank" rel="noopener noreferrer">USBToolBox <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Maps USB ports from Windows so you stay under macOS's 15-port limit.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/corpnewt/GenSMBIOS" target="_blank" rel="noopener noreferrer">GenSMBIOS <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Creates serial numbers for your SMBIOS.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/dortania/OpenCore-Legacy-Patcher" target="_blank" rel="noopener noreferrer">OpenCore Legacy Patcher <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Root patches for hardware newer macOS dropped, such as Broadcom Wi-Fi on Sonoma and later.</span></li>
                    </ul>
                </section>

                <section className="card p-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Core kexts for laptops</h2>
                    <dl className="text-sm space-y-2.5">
                        <div><dt className="inline font-semibold">Lilu:</dt> <dd className="inline text-gray-600 dark:text-gray-300">patching framework most other kexts depend on.</dd></div>
                        <div><dt className="inline font-semibold">VirtualSMC:</dt> <dd className="inline text-gray-600 dark:text-gray-300">emulates the Mac SMC; add SMCBatteryManager for battery status.</dd></div>
                        <div><dt className="inline font-semibold">WhateverGreen:</dt> <dd className="inline text-gray-600 dark:text-gray-300">Intel iGPU and display fixes.</dd></div>
                        <div><dt className="inline font-semibold">AppleALC:</dt> <dd className="inline text-gray-600 dark:text-gray-300">onboard audio, configured with a layout-id.</dd></div>
                        <div><dt className="inline font-semibold">VoodooPS2Controller:</dt> <dd className="inline text-gray-600 dark:text-gray-300">PS/2 keyboards and trackpads.</dd></div>
                        <div><dt className="inline font-semibold">VoodooI2C / VoodooRMI:</dt> <dd className="inline text-gray-600 dark:text-gray-300">I2C and Synaptics SMBus trackpads with gestures.</dd></div>
                        <div><dt className="inline font-semibold">itlwm / AirportItlwm:</dt> <dd className="inline text-gray-600 dark:text-gray-300">Intel Wi-Fi support from OpenIntelWireless.</dd></div>
                        <div><dt className="inline font-semibold">NVMeFix:</dt> <dd className="inline text-gray-600 dark:text-gray-300">power management for third-party NVMe drives.</dd></div>
                    </dl>
                </section>

                <section className="card p-5 sm:p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Where to learn and get help</h2>
                    <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://dortania.github.io/OpenCore-Install-Guide/" target="_blank" rel="noopener noreferrer">Dortania OpenCore Install Guide <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">The #1 resource. Read it before anything else.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://dortania.github.io/OpenCore-Post-Install/" target="_blank" rel="noopener noreferrer">Dortania Post-Install Guide <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">USB mapping, sleep, audio, security and more.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://www.reddit.com/r/hackintosh/" target="_blank" rel="noopener noreferrer">r/hackintosh <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Active community forum. Read the posting rules first.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://github.com/acidanthera" target="_blank" rel="noopener noreferrer">Acidanthera on GitHub <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Home of OpenCore and the essential kexts.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://www.insanelymac.com/forum/" target="_blank" rel="noopener noreferrer">InsanelyMac Forums <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Long-running community with deep technical threads.</span></li>
                        <li><a className="font-semibold text-blue-700 dark:text-blue-300 hover:underline" href="https://www.tonymacx86.com/forums/" target="_blank" rel="noopener noreferrer">tonymacx86 Forums <Icon name="external" className="icon w-3.5 h-3.5" /></a><br /><span className="text-gray-600 dark:text-gray-300">Large community with model-specific threads.</span></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
