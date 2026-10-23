// Component compatibility notes shown on the Component Checker page.
// Each item has a status of "good", "mid" or "bad".

export const componentData = {
    CPU: {
        intro: "The CPU is the brain. Intel CPUs from 8th-10th Gen are the 'sweet spot'. Newer generations and AMD CPUs introduce significant challenges for laptops.",
        items: [
            {
                name: "Intel 8th-10th Gen (Coffee/Comet/Ice Lake U/H)",
                status: "good",
                desc: "Recommended: Excellent choice. Best balance of performance, iGPU compatibility (UHD 620/630, Iris Plus), and community support."
            },
            {
                name: "Intel 11th+ Gen (Tiger/Alder Lake & newer)",
                status: "bad",
                desc: "Avoid for Laptops: Their Iris Xe iGPUs lack graphics acceleration in macOS, making them unusable for a good experience unless it's a rare model where iGPU can be fully disabled and a supported AMD dGPU is present (uncommon in laptops)."
            },
            {
                name: "Intel 4th-7th Gen (Haswell/Broadwell/Skylake/Kaby Lake)",
                status: "mid",
                desc: "Viable with Effort: Good for budget builds. Compatibility is generally good with appropriate patching (e.g. HD 4600, HD 5500, HD 620), but lower performance. Great for learning on cheaper hardware."
            },
            {
                name: "AMD Ryzen (All series for laptops)",
                status: "bad",
                desc: "Avoid for Laptops: Requires complex patches (NootedRed for iGPU), and support for iGPU, power management, sleep, and other features is very inconsistent, experimental, and often breaks."
            }
        ]
    },
    GPU: {
        intro: "Graphics acceleration is non-negotiable. For laptops, the integrated GPU (iGPU) is almost always the one you'll use. NVIDIA dGPUs are not supported on recent macOS versions and MUST be disabled.",
        items: [
            {
                name: "Intel UHD 620 / 630 / Iris Plus (8th-10th Gen)",
                status: "good",
                desc: "Recommended: The gold standard for laptop iGPUs. Excellent support in macOS."
            },
            {
                name: "Intel HD Graphics (4th-7th Gen, e.g., HD 4600, HD 520, HD 620)",
                status: "mid",
                desc: "Usable: Supported with WhateverGreen and appropriate device properties. Performance varies but generally okay for non-demanding tasks."
            },
            {
                name: "Intel Iris Xe (11th Gen+)",
                status: "bad",
                desc: "Avoid: No hardware acceleration in macOS for these iGPUs. Makes the system very laggy and unusable."
            },
            {
                name: "NVIDIA GeForce/Quadro dGPU (All modern laptop versions)",
                status: "bad",
                desc: "Must Disable: No support in recent macOS versions (High Sierra was last for some older cards). Must be disabled via ACPI patches (SSDT) to prevent heat, battery drain, and instability. Cannot be used as primary GPU."
            },
            {
                name: "AMD Radeon dGPU (RX 5xx, Vega M, RX 5xxxM, 6xxxM series)",
                status: "mid",
                desc: "Potentially Usable (Rare): Some AMD dGPUs are supported. However, in most laptops with Optimus-like technology (paired with Intel iGPU), the dGPU cannot drive the internal display. If it's the sole GPU or can directly drive display, it might work, but this is uncommon. Research specific model thoroughly."
            }
        ]
    },
    "Wi-Fi": {
        intro: "Wireless is crucial. Many stock laptop cards are not compatible and must be replaced. Check if your laptop's Wi-Fi card is soldered or replaceable before buying.",
        items: [
            {
                name: "Broadcom (e.g., DW1560, DW1820A, DW1830, Fenvi cards)",
                status: "good",
                desc: "Recommended (Check Sonoma/Sequoia compatibility): Offers the most 'native' experience, enabling features like AirDrop & Handoff. Some cards may need OCLP patching on newest macOS versions."
            },
            {
                name: "Intel Wi-Fi (e.g., AX200, AX201, AX210, AC-9560)",
                status: "mid",
                desc: "Good Alternative: Works well with OpenIntelWireless kexts (itlwm + HeliPort or AirportItlwm). Most Apple ecosystem features (AirDrop, Handoff, Continuity Camera) will NOT work or be limited."
            },
            {
                name: "Atheros (Older cards, e.g., AR9285, AR9380)",
                status: "mid",
                desc: "Viable for Older Systems: Some older Atheros cards have good support on older macOS versions. Check specific chipset."
            },
            {
                name: "Killer Wireless (Intel-based, e.g., AX1650)",
                status: "mid",
                desc: "Usually Intel Rebrands: If based on an Intel chipset (like AX200), it will work with OpenIntelWireless. Non-Intel Killer cards are generally incompatible."
            },
            {
                name: "Realtek Wi-Fi / Qualcomm Atheros (newer QCA series)",
                status: "bad",
                desc: "Avoid: Poor to no support. Must be replaced."
            }
        ]
    },
    RAM: {
        intro: "macOS benefits from ample RAM, especially for creative tasks. Ensure your chosen laptop's RAM is compatible and sufficient for your needs.",
        items: [
            {
                name: "DDR3 / DDR3L (1333MHz, 1600MHz)",
                status: "good",
                desc: "Compatible: Standard for older Hackintosh-compatible laptops (3rd-5th Gen Intel). Works reliably."
            },
            {
                name: "DDR4 (2133MHz, 2400MHz, 2666MHz+)",
                status: "good",
                desc: "Compatible: Standard for modern Hackintosh laptops (6th Gen Intel onwards). Works reliably."
            },
            {
                name: "LPDDR3 / LPDDR4 / LPDDR4X (Soldered)",
                status: "good",
                desc: "Compatible (If on board): Low Power RAM, common in ultrabooks. Works fine, but it's almost always soldered, so ensure you get enough capacity at purchase."
            },
            {
                name: "ECC RAM (Error Correcting Code)",
                status: "mid",
                desc: "Usually Works (Non-ECC Mode): While some Xeon-based Hackintoshes might use ECC RAM, macOS typically doesn't leverage ECC features. It should work as standard non-ECC RAM."
            },
            {
                name: "Mismatched RAM Sticks (Speed/Capacity/Brand)",
                status: "bad",
                desc: "Avoid if Possible: Can lead to instability or prevent booting. Always try to use matching pairs of RAM sticks for dual-channel operation and stability."
            }
        ]
    },
    Storage: {
        intro: "macOS is picky about NVMe SSDs. A wrong choice can lead to slowdowns, freezes, or kernel panics. SATA SSDs are generally safer.",
        items: [
            {
                name: "SATA SSD (Any major brand, e.g., Crucial, WD, Samsung SATA, SanDisk)",
                status: "good",
                desc: "Highly Recommended for Stability: Virtually all SATA SSDs work flawlessly and are the safest bet for compatibility."
            },
            {
                name: "NVMe SSD - Western Digital (e.g., SN550, SN570, SN750, SN770, Black series)",
                status: "good",
                desc: "Recommended NVMe: Generally excellent compatibility and reliability with macOS. Good performance."
            },
            {
                name: "NVMe SSD - Crucial (P-series, e.g., P1, P2, P5)",
                status: "good",
                desc: "Good NVMe Option: Most Crucial NVMe drives work well. P1/P2 are QLC and might be slower for sustained writes but are compatible."
            },
            {
                name: "NVMe SSD - Kingston (A2000, KC2500, KC3000)",
                status: "mid",
                desc: "Generally Compatible: Many Kingston NVMe drives work, but research specific models. Some newer/controller-specific models might have issues."
            },
            {
                name: "NVMe SSD - Samsung (e.g., PM981, PM981a, PM9A1, 970 EVO Plus, 980 Pro, 990 Pro)",
                status: "bad",
                desc: "Problematic - Avoid or Use with Caution: Many Samsung NVMes (especially OEM like PM981) are known for issues like freezes, trim problems, or instability in macOS. Some newer retail drives (970 Evo Plus, 980/990 Pro) might work with specific firmware or kexts (e.g., NVMeFix.kext, SetApfsTrimTimeout in OpenCore) but can still be unreliable. Not recommended for beginners."
            },
            {
                name: "NVMe SSD - Micron / SK Hynix (OEM models)",
                status: "bad",
                desc: "Often Problematic: Certain OEM models from these brands can be incompatible or cause issues. Research specific model numbers carefully."
            },
            {
                name: "HDD (Hard Disk Drive)",
                status: "mid",
                desc: "Usable but Slow: macOS will run on an HDD, but the experience will be very slow compared to an SSD. Not recommended for main OS drive if avoidable."
            }
        ]
    }
};
