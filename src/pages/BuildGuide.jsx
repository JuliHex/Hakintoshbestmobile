import { Link } from 'react-router';
import { useTitle } from '../components/Layout.jsx';

export default function BuildGuide() {
    useTitle('Build Guide');
    return (
        <div className="page">
            <h1 className="page-title">Laptop Build Guide</h1>
            <p className="page-lead">A map of the whole process, from BIOS settings to a fully tuned install. Each step links to the detailed Dortania documentation, which is the authoritative source.</p>

            <div className="mt-8 lg:grid lg:grid-cols-[14rem,1fr] lg:gap-10 lg:items-start">
                <nav className="card p-4 mb-8 lg:mb-0 lg:sticky lg:top-24" aria-label="On this page">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">On this page</p>
                    <ol className="text-sm space-y-1.5 list-decimal pl-5">
                        <li><a href="#prepare" className="hover:text-blue-700 dark:hover:text-blue-300">Prepare</a></li>
                        <li><a href="#bios" className="hover:text-blue-700 dark:hover:text-blue-300">BIOS settings</a></li>
                        <li><a href="#installer" className="hover:text-blue-700 dark:hover:text-blue-300">USB installer</a></li>
                        <li><a href="#efi" className="hover:text-blue-700 dark:hover:text-blue-300">Build the EFI</a></li>
                        <li><a href="#install" className="hover:text-blue-700 dark:hover:text-blue-300">Install macOS</a></li>
                        <li><a href="#post-install" className="hover:text-blue-700 dark:hover:text-blue-300">Post-install</a></li>
                    </ol>
                </nav>

                <article className="prose-guide max-w-3xl">
                    <div className="callout callout-info">
                        <p>This guide is an overview, not a replacement for the <a href="https://dortania.github.io/OpenCore-Install-Guide/" target="_blank" rel="noopener noreferrer">Dortania OpenCore Install Guide</a>. Keep it open alongside.</p>
                    </div>

                    <h2 id="prepare">1. Prepare</h2>
                    <p>Before touching anything, know exactly what's inside your laptop. Boot Windows or a Linux live USB and note:</p>
                    <ul>
                        <li><strong>CPU generation</strong>: decides which Dortania config section you follow. 8th–10th gen Intel is the sweet spot.</li>
                        <li><strong>iGPU</strong>: you need its device ID for the framebuffer patch.</li>
                        <li><strong>Wi-Fi card</strong>: Broadcom, Intel, or something to replace. See the <Link to="/components?tab=Wi-Fi">Component Checker</Link>.</li>
                        <li><strong>Audio codec</strong>: you'll need it to choose an AppleALC layout-id.</li>
                        <li><strong>Trackpad bus</strong>: PS/2, I2C or SMBus. This decides which Voodoo kext you use.</li>
                        <li><strong>NVMe SSD model</strong>: some drives (notably some Samsung OEM ones) cause trouble.</li>
                    </ul>
                    <p>You'll also need a USB stick of 16&nbsp;GB or more, and a way to back up your current system.</p>

                    <h2 id="bios">2. BIOS settings</h2>
                    <p>Names differ between vendors, but look for these:</p>
                    <ul>
                        <li><strong>Disable:</strong> Secure Boot, Fast Boot, CSM/Legacy boot, Intel SGX, Intel Platform Trust,VT-d (or enable <code>DisableIoMapper</code>), serial/parallel ports, and any discrete NVIDIA GPU you can switch off.</li>
                        <li><strong>Enable:</strong> UEFI boot, VT-x, Above 4G decoding (if present), XHCI hand-off, and AHCI mode for SATA.</li>
                        <li><strong>DVMT pre-allocated memory:</strong> 64&nbsp;MB if the option exists. If not, you'll patch around it in the framebuffer.</li>
                        <li><strong>CFG Lock:</strong> disable it if you can (sometimes only through a modified BIOS variable). Otherwise enable <code>AppleXcpmCfgLock</code> in your config.</li>
                    </ul>

                    <h2 id="installer">3. Create the USB installer</h2>
                    <ol>
                        <li>From macOS, download the full installer from the App Store and use <code>createinstallmedia</code>.</li>
                        <li>From Windows or Linux, use OpenCore's <code>macrecovery.py</code> to fetch the recovery image, then copy it to a FAT32 USB. This needs an internet connection during install, so pick a machine with Ethernet or a supported Wi-Fi card.</li>
                    </ol>
                    <p>Details: <a href="https://dortania.github.io/OpenCore-Install-Guide/installer-guide/" target="_blank" rel="noopener noreferrer">Creating the USB</a>.</p>

                    <h2 id="efi">4. Build the EFI</h2>
                    <p>The EFI folder is your Hackintosh. Build it yourself rather than downloading a random one; you'll understand and fix it far more easily.</p>
                    <ol>
                        <li>Download the latest <a href="https://github.com/acidanthera/OpenCorePkg/releases" target="_blank" rel="noopener noreferrer">OpenCorePkg</a> release and copy the <code>EFI</code> folder structure.</li>
                        <li>Add firmware drivers: <code>OpenRuntime.efi</code> and <code>HfsPlus.efi</code> (or <code>OpenHfsPlus.efi</code>).</li>
                        <li>Add kexts: Lilu, VirtualSMC (+ SMCBatteryManager), WhateverGreen, AppleALC, your trackpad/keyboard kexts, Wi-Fi/Bluetooth kexts and NVMeFix. Order matters: Lilu first, plugins after the kexts they extend.</li>
                        <li>Generate ACPI patches with <a href="https://github.com/corpnewt/SSDTTime" target="_blank" rel="noopener noreferrer">SSDTTime</a>. Laptops commonly need SSDT-PLUG, SSDT-EC-USBX, SSDT-PNLF (backlight), SSDT-AWAC/RTC0 and SSDT-XOSI/GPI0 for I2C trackpads.</li>
                        <li>Copy <code>Sample.plist</code> to <code>config.plist</code>, run <em>OC Snapshot</em> in ProperTree, then follow your CPU generation's laptop section line by line.</li>
                        <li>Pick a SMBIOS close to your hardware (e.g. <code>MacBookPro15,2</code> for 8th gen U-series) and generate serials with GenSMBIOS.</li>
                    </ol>
                    <div className="callout callout-warn">
                        <p>Keep the verbose boot argument <code>-v</code> and <code>debug=0x100 keepsyms=1</code> while setting up. A frozen Apple logo tells you nothing; verbose text tells you where it stopped.</p>
                    </div>

                    <h2 id="install">5. Install macOS</h2>
                    <ol>
                        <li>Boot the USB from the firmware boot menu, then pick the installer in the OpenCore picker.</li>
                        <li>In Disk Utility, choose <em>Show All Devices</em> and erase the target drive as <strong>APFS</strong> with a <strong>GUID Partition Map</strong>.</li>
                        <li>Run the installer. It reboots several times; pick the <em>macOS Installer</em> entry each time until it's gone.</li>
                    </ol>
                    <p>If it hangs, note the last lines on screen and check <Link to="/troubleshooting">Troubleshooting</Link>.</p>

                    <h2 id="post-install">6. Post-install</h2>
                    <ul>
                        <li><strong>Boot without the USB:</strong> mount the internal EFI partition (e.g. with MountEFI) and copy your EFI folder over.</li>
                        <li><strong>USB mapping:</strong> map ports with USBToolBox and drop the port-limit quirk.</li>
                        <li><strong>Audio:</strong> try AppleALC layout-ids for your codec until speakers, headphones and mic all work.</li>
                        <li><strong>Sleep &amp; battery:</strong> check that the lid sleeps and wakes, and battery percentage updates. Disable hibernation with <code>sudo pmset -a hibernatemode 0</code>.</li>
                        <li><strong>Brightness keys:</strong> map them with BrightnessKeys.kext and SSDT-PNLF.</li>
                        <li><strong>Clean up:</strong> remove <code>-v</code> and debug flags, and hide auxiliary entries in the picker.</li>
                    </ul>
                    <p>Details: <a href="https://dortania.github.io/OpenCore-Post-Install/" target="_blank" rel="noopener noreferrer">OpenCore Post-Install guide</a>.</p>
                </article>
            </div>
        </div>
    );
}
