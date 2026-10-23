// Laptop and component data for the Hackintosh Laptop Guide.
//
// Each laptop's `needsVerification` lists field paths (e.g. "details.maxMacosSupport")
// whose values haven't been confirmed against a real build. The UI marks those
// fields as unverified; remove a path once you've checked the value.
// Laptops with `source: "community"` were imported from a community list and
// carry estimated ratings; the detail page says so.

// macOS releases in order, used for version-range filtering.
const MACOS_VERSIONS = ["Yosemite", "El Capitan", "Sierra", "High Sierra", "Mojave", "Catalina", "Big Sur", "Monterey", "Ventura", "Sonoma", "Sequoia", "Tahoe"];

const PRIORITY_LABELS = {
    ease: "Ease of Setup",
    performance: "Performance",
    budget: "Budget",
    portability: "Portability",
    stability: "Stability"
};

const laptopData = {
    thinkpad_t480: {
        name: "ThinkPad T480",
        priority: ["ease", "budget"],
        score: 9.2,
        summary: "Excellent Hackintosh compatibility with great community support",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 32GB DDR4",
            storage: "SATA + NVMe",
            macosSupport: "Ventura",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma (with caveats)",
            wifiBluetooth: "Intel Wireless-AC 8265 / Realtek BT (Often replaced with Broadcom)",
            audioCodec: "Realtek ALC3287 (ALC257)",
            trackpad: "PS/2 Synaptics/ALPS (Full gestures with kexts)",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 90, performance: 85, battery: 80, stability: 95 },
            dimensions: { width: "336.6 mm", depth: "232.5 mm", height: "19.95 mm" },
            weight: "1.58 kg",
            batteryLife: {
                average: "12-15 hours",
                capacity: "72Wh (24 + 48)",
                type: "Dual battery system (internal + external)"
            },
            ports: {
                usb: ["2x USB 3.1 Gen 1", "1x USB 3.1 Type-C Gen 2"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["HDMI 1.4b", "Native DisplayPort 1.2"],
                network: "RJ45 Gigabit Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack", "Smart Card Reader (optional)"]
            },
            keyboard: {
                type: "ThinkPad Precision Keyboard",
                backlit: true,
                numpad: false,
                layout: "Full-size, spill-resistant"
            },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "250 nits",
                colorGamut: "45% NTSC",
                panel: "BOE NV140FHM-N49",
                touchscreen: false
            },
            biosVersion: { recommended: "1.45", notes: "CFG lock must be disabled", secureBootSupport: true },
            knownIssues: [
                "Sleep works but may require additional patches",
                "SD Card reader requires additional kext",
                "Fingerprint reader not supported"
            ],
            communitySupport: {
                rating: "Excellent",
                resources: ["GitHub guides available", "Active forum support", "Multiple successful builds documented"]
            },
            guides: {
                installation: "https://github.com/EETagent/T480-OpenCore-Hackintosh",
                additional: ["https://github.com/valnoxy/t480-oc", "https://github.com/MSzturc/T480-OpenCore"]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Single fan with dual heat pipes",
                undervolting: "Supported via modified BIOS"
            }
        },
        needsVerification: [],
        brand: "Lenovo"
    },
    acer_swift_3: {
        name: "Acer Swift 3",
        priority: ["budget", "portability"],
        score: 8,
        summary: "Budget-friendly ultrabook with good performance",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel UHD/Iris Plus",
            ram: "Up to 16GB LPDDR4X",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel Wi-Fi 6 AX201",
            audioCodec: "Realtek ALC256",
            trackpad: "I2C HID",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 75, performance: 80, battery: 85, stability: 80 },
            dimensions: { width: "323.4 mm", depth: "218.9 mm", height: "15.95 mm" },
            weight: "1.2 kg",
            batteryLife: { average: "10-12 hours", capacity: "48Wh", type: "Li-ion battery" },
            ports: {
                usb: ["2x USB 3.2 Gen 1 Type-A", "1x USB 3.2 Gen 2 Type-C"],
                thunderbolt: "No",
                video: ["HDMI 2.0"],
                network: "No built-in Ethernet",
                others: ["3.5mm Audio Jack"]
            },
            keyboard: { type: "Standard keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS LED-backlit",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "72% NTSC",
                panel: "AU Optronics",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "DVMT needs to be set to 64MB minimum",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card may need replacement for better compatibility",
                "Sleep might require additional patches",
                "Battery reporting might need ECEnabler.kext"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Several GitHub repositories available", "Active forum discussions", "Multiple success stories"]
            },
            guides: {
                installation: "https://github.com/username/acer-swift3-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/your-thread-here",
                    "https://github.com/another-repo/swift3-efi"
                ]
            },
            thermals: {
                idleTemp: "30-35°C",
                loadTemp: "70-80°C",
                coolingSystem: "Single fan with copper heat pipe",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution",
            "details.displayFeatures.panel"
        ],
        brand: "Acer"
    },
    chuwi_corebook_x: {
        name: "Chuwi CoreBook X",
        priority: ["budget"],
        score: 7.5,
        summary: "Affordable laptop with decent build quality",
        details: {
            cpu: "Intel Core i5 10th Gen (i5-1035G4 or similar)",
            igpu: "Intel Iris Plus Graphics G4",
            ram: "16GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Big Sur",
            maxMacosSupport: "Ventura (Untested, may have issues)",
            wifiBluetooth: "Intel Wireless-AC 7265 (or similar, check model)",
            audioCodec: "Realtek ALC269 (Layout-id may be needed)",
            trackpad: "I2C HID",
            screenResolution: "2160x1440 (3:2 Aspect Ratio)",
            chartData: { ease: 70, performance: 75, battery: 70, stability: 75 },
            dimensions: { width: "317 mm", depth: "235 mm", height: "17 mm" },
            weight: "1.5 kg",
            batteryLife: { average: "8-10 hours", capacity: "46Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 3.0 Type-A", "1x USB Type-C"],
                thunderbolt: "No",
                video: ["HDMI"],
                network: "No built-in Ethernet",
                others: ["3.5mm Audio Jack"]
            },
            keyboard: { type: "Standard keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS Display",
                resolution: "2160x1440",
                aspectRatio: "3:2",
                brightness: "350 nits",
                colorGamut: "100% sRGB",
                panel: "Generic IPS Panel",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "DVMT needs patch, CFG lock must be disabled",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card requires replacement",
                "Sleep may be unstable",
                "Battery monitoring needs patches",
                "Some function keys may not work"
            ],
            communitySupport: {
                rating: "Moderate",
                resources: ["Limited GitHub guides", "Some forum discussions", "Basic documentation available"]
            },
            guides: {
                installation: "https://github.com/username/corebook-x-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/chuwi-corebook-x",
                    "https://github.com/another-repo/chuwi-efi"
                ]
            },
            thermals: {
                idleTemp: "35-45°C",
                loadTemp: "80-90°C",
                coolingSystem: "Single fan cooling",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: ["details.macosSupport", "details.trackpad"],
        brand: "Chuwi"
    },
    dell_xps_13_9300: {
        name: "Dell XPS 13 9300",
        priority: ["performance", "portability"],
        score: 8.9,
        summary: "Premium ultrabook with excellent build quality",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel Iris Plus",
            ram: "Up to 32GB LPDDR4X",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Killer Wi-Fi 6 AX1650 (Intel based)",
            audioCodec: "Realtek ALC3271 (ALC289)",
            trackpad: "I2C HID Precision",
            screenResolution: "1920x1200 or 3840x2400",
            chartData: { ease: 80, performance: 90, battery: 85, stability: 85 },
            dimensions: { width: "296 mm", depth: "199 mm", height: "14.8 mm" },
            weight: "1.2 kg",
            batteryLife: { average: "10-12 hours", capacity: "52Wh", type: "Li-ion" },
            ports: {
                usb: ["2x Thunderbolt 3"],
                thunderbolt: "2x Thunderbolt 3",
                video: ["DisplayPort over USB-C"],
                network: "No built-in Ethernet",
                others: ["MicroSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Edge-to-edge keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "InfinityEdge Touch Display",
                resolution: ["1920x1200", "3840x2400"],
                aspectRatio: "16:10",
                brightness: "500 nits",
                colorGamut: "100% sRGB",
                panel: "Sharp/Samsung (varies by configuration)",
                touchscreen: true
            },
            biosVersion: {
                recommended: "Latest Dell BIOS",
                notes: "CFG lock must be disabled",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card may need replacement",
                "Sleep requires additional patches",
                "Thunderbolt hot-plug might be unstable",
                "Brightness keys need remapping"
            ],
            communitySupport: {
                rating: "Very Good",
                resources: ["Multiple GitHub guides", "Active forum support", "Well-documented solutions"]
            },
            guides: {
                installation: "https://github.com/username/xps-9300-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/dell-xps-13-9300",
                    "https://github.com/another-repo/xps9300-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan cooling",
                undervolting: "Limited by BIOS restrictions"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Dell"
    },
    dell_xps_13_9370: {
        name: "Dell XPS 13 9370",
        priority: ["performance", "portability"],
        score: 8.7,
        summary: "Compact ultrabook with great display",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 16GB LPDDR3",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Qualcomm QCA61x4A (Often replaced)",
            audioCodec: "Realtek ALC3271 (ALC299)",
            trackpad: "I2C HID Precision",
            screenResolution: "1920x1080 or 3840x2160",
            chartData: { ease: 80, performance: 85, battery: 85, stability: 85 },
            dimensions: { width: "302 mm", depth: "199 mm", height: "11.6 mm" },
            weight: "1.21 kg",
            batteryLife: { average: "10-12 hours", capacity: "52Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x Thunderbolt 3", "1x USB-C 3.1"],
                thunderbolt: "2x Thunderbolt 3",
                video: ["DisplayPort over USB-C"],
                network: "No built-in Ethernet",
                others: ["MicroSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Chiclet-style keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "InfinityEdge IPS",
                resolution: ["1920x1080", "3840x2160"],
                aspectRatio: "16:9",
                brightness: "400 nits",
                colorGamut: "100% sRGB",
                panel: "Sharp SHP148B",
                touchscreen: false
            },
            biosVersion: { recommended: "1.12.0", notes: "CFG lock must be disabled", secureBootSupport: true },
            knownIssues: [
                "Sleep may require additional patches",
                "Thunderbolt hot-plug may be unstable",
                "Original Wi-Fi card needs replacement"
            ],
            communitySupport: {
                rating: "Excellent",
                resources: ["Multiple GitHub guides", "Active forum support", "Well-documented solutions"]
            },
            guides: {
                installation: "https://github.com/the-darkvoid/XPS9370-macOS",
                additional: [
                    "https://github.com/3wsoftware/XPS9370-macOS-Mojave",
                    "https://www.tonymacx86.com/threads/guide-dell-xps-13-9370-mojave-virtualbox.286712/"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan cooling",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Dell"
    },
    dell_xps_15_9570: {
        name: "Dell XPS 15 9570",
        priority: ["performance"],
        score: 8.5,
        summary: "Powerful laptop with dedicated graphics (dGPU disabled in macOS)",
        details: {
            cpu: "Intel Core i7/i9 8th Gen",
            igpu: "Intel UHD 630",
            ram: "Up to 32GB DDR4",
            storage: "NVMe + SATA",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura (dGPU disabled)",
            wifiBluetooth: "Killer 1535 (Qualcomm QCA61x4A - Often replaced)",
            audioCodec: "Realtek ALC3266 (ALC298)",
            trackpad: "I2C HID Precision",
            screenResolution: "1920x1080 or 3840x2160",
            chartData: { ease: 70, performance: 95, battery: 75, stability: 80 },
            dimensions: { width: "357 mm", depth: "235 mm", height: "17 mm" },
            weight: "1.8 kg",
            batteryLife: { average: "8-10 hours", capacity: "97Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 3.1 Type-A", "1x Thunderbolt 3"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["HDMI 2.0"],
                network: "No built-in Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Chiclet-style keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: ["1920x1200", "3840x2400"],
                aspectRatio: "16:10",
                brightness: "500 nits",
                colorGamut: "100% Adobe RGB",
                panel: "Sharp/Dell Premium Panel",
                touchscreen: false
            },
            biosVersion: {
                recommended: "1.17.1",
                notes: "dGPU must be disabled, CFG lock off",
                secureBootSupport: true
            },
            knownIssues: [
                "NVIDIA GPU must be disabled",
                "Sleep issues need patches",
                "Thunderbolt requires careful configuration",
                "Original Wi-Fi card needs replacement"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Several GitHub guides", "Active forum support", "Multiple success stories"]
            },
            guides: {
                installation: "https://github.com/bavariancake/XPS9570-macOS",
                additional: [
                    "https://github.com/LuletterSoul/Dell-XPS-15-9570-macOS",
                    "https://www.tonymacx86.com/threads/guide-dell-xps-15-9570-mojave.267805/"
                ]
            },
            thermals: {
                idleTemp: "40-45°C",
                loadTemp: "80-90°C",
                coolingSystem: "Dual fan with shared heatpipes",
                undervolting: "Recommended via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Dell"
    },
    hp_elitebook_840: {
        name: "HP EliteBook 840 G5/G6",
        priority: ["stability", "ease"],
        score: 8.8,
        summary: "Business laptop with excellent reliability",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 32GB DDR4",
            storage: "NVMe + SATA",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel AC 8265/9560",
            audioCodec: "Conexant CX8050",
            trackpad: "Synaptics SMBus",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 85, performance: 85, battery: 90, stability: 90 },
            dimensions: { width: "326 mm", depth: "234 mm", height: "17.9 mm" },
            weight: "1.48 kg",
            batteryLife: { average: "13-15 hours", capacity: "50Wh", type: "Long Life 3-cell Li-ion" },
            ports: {
                usb: ["2x USB 3.1 Type-A", "1x USB 3.1 Type-C"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["HDMI 1.4b"],
                network: "RJ45 Gigabit Ethernet",
                others: ["Smart Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: {
                type: "HP Premium Keyboard",
                backlit: true,
                numpad: false,
                layout: "Full-size, spill-resistant"
            },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "400 nits",
                colorGamut: "72% NTSC",
                panel: "CMN14D5 (or similar)",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest HP BIOS",
                notes: "CFG lock must be disabled via BIOS mod",
                secureBootSupport: true
            },
            knownIssues: [
                "Built-in Wi-Fi may need replacement",
                "Fingerprint reader not supported",
                "Some sleep states may not work properly"
            ],
            communitySupport: {
                rating: "Very Good",
                resources: ["Multiple GitHub guides", "Active forum discussions", "Well-documented solutions"]
            },
            guides: {
                installation: "https://github.com/username/elitebook-840-opencore",
                additional: ["https://www.tonymacx86.com/threads/hp-elitebook-840", "https://github.com/other-repo/840g5-efi"]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "70-80°C",
                coolingSystem: "Single fan with dual heat pipes",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "HP"
    },
    hp_spectre_x360_15: {
        name: "HP Spectre x360 15",
        priority: ["performance"],
        score: 8.3,
        summary: "Premium 2-in-1 with powerful specs (dGPU likely disabled)",
        details: {
            cpu: "Intel Core i7 10th Gen",
            igpu: "Intel Iris Plus",
            ram: "Up to 16GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura (dGPU issues)",
            wifiBluetooth: "Intel Wi-Fi 6 AX201",
            audioCodec: "Realtek ALC",
            trackpad: "I2C HID Precision",
            screenResolution: "3840x2160 (4K) or 1920x1080 (FHD)",
            chartData: { ease: 75, performance: 90, battery: 80, stability: 80 },
            dimensions: { width: "359.9 mm", depth: "226.4 mm", height: "19.3 mm" },
            weight: "1.92 kg",
            batteryLife: { average: "13-15 hours", capacity: "72.9Wh", type: "6-cell Li-ion polymer" },
            ports: {
                usb: ["1x USB 3.1 Type-A", "2x Thunderbolt 3"],
                thunderbolt: "2x Thunderbolt 3",
                video: ["HDMI 2.0b"],
                network: "No built-in Ethernet",
                others: ["MicroSD reader", "3.5mm Audio Jack"]
            },
            keyboard: {
                type: "Island-style keyboard",
                backlit: true,
                numpad: true,
                layout: "Full-size with numpad"
            },
            displayFeatures: {
                type: "AMOLED Touch Display",
                resolution: ["1920x1080", "3840x2160"],
                aspectRatio: "16:9",
                brightness: "400 nits",
                colorGamut: "100% DCI-P3",
                panel: "Samsung AMOLED",
                touchscreen: true
            },
            biosVersion: {
                recommended: "Latest HP BIOS",
                notes: "dGPU must be disabled, CFG lock off",
                secureBootSupport: true
            },
            knownIssues: [
                "NVIDIA GPU not supported",
                "Touchscreen may need patches",
                "Some sleep states unstable",
                "Original Wi-Fi card needs replacement"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Several GitHub guides", "Forum support available", "Growing user base"]
            },
            guides: {
                installation: "https://github.com/username/spectre-x360-15-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/hp-spectre-x360-15",
                    "https://github.com/another-repo/spectre-efi"
                ]
            },
            thermals: {
                idleTemp: "35-45°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan cooling solution",
                undervolting: "Limited due to recent BIOS restrictions"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "HP"
    },
    lenovo_ideapad_330s: {
        name: "Lenovo IdeaPad 330S",
        priority: ["budget"],
        score: 7.8,
        summary: "Budget-friendly laptop with good value",
        details: {
            cpu: "Intel Core i3/i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 16GB DDR4",
            storage: "SATA + NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Qualcomm Atheros / Realtek",
            audioCodec: "Realtek ALC236",
            trackpad: "Synaptics/ELAN I2C/PS2",
            screenResolution: "1366x768 or 1920x1080",
            chartData: { ease: 75, performance: 75, battery: 70, stability: 80 },
            dimensions: { width: "323 mm", depth: "234 mm", height: "18.9 mm" },
            weight: "1.67 kg",
            batteryLife: { average: "7-9 hours", capacity: "45Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 3.0 Type-A", "1x USB 3.1 Type-C"],
                thunderbolt: "No",
                video: ["HDMI 1.4b"],
                network: "No built-in Ethernet",
                others: ["4-in-1 Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Standard keyboard", backlit: false, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS LED-backlit",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "72% NTSC",
                panel: "AU Optronics",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "DVMT needs configuration",
                secureBootSupport: true
            },
            knownIssues: ["Wi-Fi card needs replacement", "Sleep may be unstable", "Battery life reporting needs patches"],
            communitySupport: {
                rating: "Good",
                resources: ["Some GitHub repositories", "Forum discussions available", "Basic documentation exists"]
            },
            guides: {
                installation: "https://github.com/username/ideapad-330s-opencore",
                additional: ["https://www.tonymacx86.com/threads/ideapad-330s", "https://github.com/another-repo/330s-efi"]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Single fan with heat pipe",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution",
            "details.displayFeatures.panel"
        ],
        brand: "Lenovo"
    },
    lenovo_ideapad_530s: {
        name: "Lenovo IdeaPad 530S",
        priority: ["budget", "portability"],
        score: 8,
        summary: "Mid-range laptop with good build quality",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 16GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel AC 3165/8265",
            audioCodec: "Realtek ALC236",
            trackpad: "I2C HID",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 80, performance: 80, battery: 75, stability: 80 },
            dimensions: { width: "308.3 mm", depth: "211 mm", height: "16.4 mm" },
            weight: "1.49 kg",
            batteryLife: { average: "8-10 hours", capacity: "45Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 3.0 Type-A", "1x USB 3.1 Type-C"],
                thunderbolt: "No",
                video: ["HDMI 1.4b"],
                network: "No built-in Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Backlit keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS-level Anti-glare",
                resolution: ["1920x1080", "3840x2160"],
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "100% sRGB",
                panel: "IPS Panel",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "CFG lock must be disabled",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card may need replacement",
                "Sleep requires additional patches",
                "HDMI audio might be unstable"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Multiple GitHub guides", "Active forum support", "Detailed documentation"]
            },
            guides: {
                installation: "https://github.com/username/ideapad-530s-opencore",
                additional: ["https://www.tonymacx86.com/threads/ideapad-530s", "https://github.com/another-repo/530s-efi"]
            },
            thermals: {
                idleTemp: "30-35°C",
                loadTemp: "70-80°C",
                coolingSystem: "Single fan with dual heat pipes",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution",
            "details.displayFeatures.panel"
        ],
        brand: "Lenovo"
    },
    dell_latitude_7x90: {
        name: "Dell Latitude 7x90",
        priority: ["stability", "ease"],
        score: 8.9,
        summary: "Business laptop series with great compatibility",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 32GB DDR4",
            storage: "SATA + NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            wifiBluetooth: "Intel AC 8265/9560",
            audioCodec: "Realtek ALC3246 (ALC295)",
            trackpad: "ALPS I2C/Dell Touchpad",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 90, performance: 85, battery: 85, stability: 95 },
            dimensions: { width: "330.5 mm", depth: "229.5 mm", height: "17.9 mm" },
            weight: "1.4 kg",
            batteryLife: { average: "12-14 hours", capacity: "60Wh", type: "4-cell Li-ion" },
            ports: {
                usb: ["3x USB 3.1 Type-A", "1x USB Type-C"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["HDMI 1.4"],
                network: "RJ45 Gigabit Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack", "Smart Card Reader"]
            },
            keyboard: {
                type: "Dell Business Keyboard",
                backlit: true,
                numpad: false,
                layout: "Full-size, spill-resistant"
            },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "72% NTSC",
                panel: "AUO/LG (varies by model)",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest Dell BIOS",
                notes: "CFG lock can be disabled via setup utility",
                secureBootSupport: true
            },
            knownIssues: [
                "Stock Wi-Fi card may need replacement",
                "Sleep needs additional configuration",
                "Fingerprint reader not supported"
            ],
            communitySupport: {
                rating: "Very Good",
                resources: ["Multiple GitHub guides", "Active Dell forums", "Well-documented solutions"]
            },
            guides: {
                installation: "https://github.com/username/latitude-7x90-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/dell-latitude-7x90",
                    "https://github.com/altro-repo/latitude-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "70-80°C",
                coolingSystem: "Dual heat pipes with single fan",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Dell"
    },
    lg_gram_14: {
        name: "LG Gram 14",
        priority: ["portability"],
        score: 8.6,
        summary: "Ultra-lightweight laptop with excellent battery life",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel Iris Plus",
            ram: "Up to 16GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel Wi-Fi 6 AX201",
            audioCodec: "Realtek ALC",
            trackpad: "I2C HID Precision",
            screenResolution: "1920x1080 (FHD) or 2560x1600 (WQXGA)",
            chartData: { ease: 80, performance: 85, battery: 95, stability: 85 },
            dimensions: { width: "323.4 mm", depth: "209.8 mm", height: "16.8 mm" },
            weight: "0.999 kg",
            batteryLife: { average: "18-20 hours", capacity: "72Wh", type: "Li-ion" },
            ports: {
                usb: ["2x USB 3.2 Type-A", "2x USB Type-C"],
                thunderbolt: "2x Thunderbolt 4",
                video: ["HDMI"],
                network: "No built-in Ethernet",
                others: ["MicroSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "LG Premium Keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: ["1920x1080", "2560x1600"],
                aspectRatio: ["16:9", "16:10"],
                brightness: "350 nits",
                colorGamut: "99% sRGB",
                panel: "LG Display",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest LG BIOS",
                notes: "DVMT must be configured",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card requires replacement",
                "Sleep may be unstable initially",
                "Battery calibration needed"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["GitHub repositories available", "Forum threads with solutions", "Growing user base"]
            },
            guides: {
                installation: "https://github.com/username/lg-gram-opencore",
                additional: ["https://www.tonymacx86.com/threads/lg-gram", "https://github.com/another-repo/gram-efi"]
            },
            thermals: {
                idleTemp: "30-35°C",
                loadTemp: "75-85°C",
                coolingSystem: "Single fan with dual heat pipes",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "LG"
    },
    huawei_matebook_x_pro: {
        name: "Huawei MateBook X Pro",
        priority: ["performance", "portability"],
        score: 8.7,
        summary: "Premium ultrabook with 3:2 display",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel Iris Plus",
            ram: "16GB LPDDR3",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel AX201 / Lite-On",
            audioCodec: "Realtek ALC256",
            trackpad: "I2C HID",
            screenResolution: "3000x2000 (3K)",
            chartData: { ease: 85, performance: 90, battery: 85, stability: 85 },
            dimensions: { width: "304 mm", depth: "217 mm", height: "14.6 mm" },
            weight: "1.33 kg",
            batteryLife: { average: "12-14 hours", capacity: "56Wh", type: "Li-Polymer" },
            ports: {
                usb: ["1x USB 3.0 Type-A", "2x USB Type-C"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["DisplayPort over USB-C"],
                network: "No built-in Ethernet",
                others: ["3.5mm Audio Jack"]
            },
            keyboard: {
                type: "Full-size backlit keyboard",
                backlit: true,
                numpad: false,
                layout: "Standard layout"
            },
            displayFeatures: {
                type: "LTPS Touch Display",
                resolution: "3000x2000",
                aspectRatio: "3:2",
                brightness: "450 nits",
                colorGamut: "100% sRGB",
                panel: "Custom LTPS Panel",
                touchscreen: true
            },
            biosVersion: {
                recommended: "Latest BIOS",
                notes: "CFG lock must be disabled, DVMT needs configuration",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card needs replacement",
                "Touchscreen requires patches",
                "Sleep mode may be unstable",
                "Brightness keys need remapping"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Several GitHub guides", "Active forum threads", "Good documentation available"]
            },
            guides: {
                installation: "https://github.com/username/matebook-x-pro-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/matebook-x-pro",
                    "https://github.com/another-repo/matebook-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan with shared heat pipes",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Huawei"
    },
    xiaomi_mi_notebook_pro: {
        name: "Xiaomi Mi Notebook Pro",
        priority: ["performance", "budget"],
        score: 8.4,
        summary: "High-performance laptop with premium build",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 16GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel AC 8265/9260",
            audioCodec: "Realtek ALC298",
            trackpad: "Synaptics SMBus",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 75, performance: 80, battery: 75, stability: 80 },
            dimensions: { width: "357 mm", depth: "229 mm", height: "15.9 mm" },
            weight: "1.8 kg",
            batteryLife: { average: "8-10 hours", capacity: "60Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 3.0 Type-A", "1x USB Type-C"],
                thunderbolt: "No",
                video: ["HDMI 1.4"],
                network: "No built-in Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Backlit keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS LED-backlit",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "72% NTSC",
                panel: "BOE NV156FHM-N61",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "DVMT patch required, CFG lock must be disabled",
                secureBootSupport: true
            },
            knownIssues: [
                "Original Wi-Fi card not supported",
                "HDMI audio may be unstable",
                "Fingerprint reader not working",
                "Battery reporting needs patches"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["GitHub repositories available", "Forum support threads", "Regular updates from community"]
            },
            guides: {
                installation: "https://github.com/username/mi-notebook-pro-opencore",
                additional: ["https://www.tonymacx86.com/threads/mi-notebook-pro", "https://github.com/other-repo/xiaomi-efi"]
            },
            thermals: {
                idleTemp: "35-45°C",
                loadTemp: "80-90°C",
                coolingSystem: "Dual fan cooling system",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Xiaomi"
    },
    msi_gs65: {
        name: "MSI GS65 Stealth",
        priority: ["performance"],
        score: 7.8,
        summary: "Gaming laptop with powerful specs (dGPU disabled)",
        details: {
            cpu: "Intel Core i7 8th/9th Gen",
            igpu: "Intel UHD 630",
            ram: "Up to 32GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave (dGPU challenges)",
            maxMacosSupport: "Ventura (dGPU challenges)",
            wifiBluetooth: "Killer E2500 Ethernet / Intel Wireless",
            audioCodec: "Nahimic / Realtek ALC1220",
            trackpad: "Synaptics",
            screenResolution: "1920x1080 (FHD) @144Hz/240Hz",
            chartData: { ease: 65, performance: 95, battery: 70, stability: 75 },
            dimensions: { width: "358 mm", depth: "248 mm", height: "17.7 mm" },
            weight: "1.88 kg",
            batteryLife: { average: "6-8 hours", capacity: "82Wh", type: "Li-Polymer" },
            ports: {
                usb: ["3x USB 3.1 Type-A"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["HDMI 2.0", "Mini DisplayPort 1.2"],
                network: "RJ45 Gigabit Ethernet",
                others: ["3.5mm Audio Jack", "3.5mm Microphone Jack"]
            },
            keyboard: { type: "SteelSeries RGB keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS-level Anti-glare",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "72% NTSC",
                panel: "LG Display (144Hz/240Hz variants)",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "dGPU must be disabled, CFG lock needs mod",
                secureBootSupport: true
            },
            knownIssues: [
                "NVIDIA GPU must be disabled",
                "Original Wi-Fi card needs replacement",
                "Sleep issues require extensive patches",
                "Fan control needs custom solution"
            ],
            communitySupport: {
                rating: "Moderate",
                resources: ["Limited GitHub guides", "Some forum discussions", "Requires advanced knowledge"]
            },
            guides: {
                installation: "https://github.com/username/msi-gs65-opencore",
                additional: ["https://www.tonymacx86.com/threads/msi-gs65", "https://github.com/another-repo/gs65-efi"]
            },
            thermals: {
                idleTemp: "40-45°C",
                loadTemp: "85-95°C",
                coolingSystem: "Triple fan Cooler Boost Trinity",
                undervolting: "Recommended via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "MSI"
    },
    msi_prestige_14: {
        name: "MSI Prestige 14",
        priority: ["performance", "portability"],
        score: 8.2,
        summary: "Creator-focused laptop with good performance",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel Iris Plus",
            ram: "Up to 16GB LPDDR3",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel Wi-Fi 6 AX201",
            audioCodec: "Realtek ALC",
            trackpad: "I2C HID",
            screenResolution: "1920x1080 (FHD) or 3840x2160 (4K)",
            chartData: { ease: 75, performance: 90, battery: 80, stability: 80 },
            dimensions: { width: "319 mm", depth: "219 mm", height: "15.9 mm" },
            weight: "1.29 kg",
            batteryLife: { average: "10-12 hours", capacity: "52Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 2.0 Type-A", "2x USB Type-C"],
                thunderbolt: "2x Thunderbolt 3",
                video: ["HDMI 2.0"],
                network: "No built-in Ethernet",
                others: ["MicroSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "White backlit keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS-level Anti-glare",
                resolution: ["1920x1080", "3840x2160"],
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "100% sRGB",
                panel: "IPS Panel",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "CFG lock must be disabled, DVMT needs configuration",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card may need replacement",
                "Sleep requires additional patches",
                "HDMI audio might be unstable",
                "Battery reporting needs ECEnabler.kext"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Several GitHub guides", "Active forum discussions", "Growing community support"]
            },
            guides: {
                installation: "https://github.com/username/msi-prestige-14-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/msi-prestige-14",
                    "https://github.com/another-repo/prestige-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan cooling system",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution",
            "details.displayFeatures.panel"
        ],
        brand: "MSI"
    },
    dell_precision_5550: {
        name: "Dell Precision 5550",
        priority: ["performance"],
        score: 8.6,
        summary: "Workstation laptop with powerful specs (dGPU disabled)",
        details: {
            cpu: "Intel Core i7/i9/Xeon 10th Gen",
            igpu: "Intel UHD Graphics (Comet Lake)",
            ram: "Up to 64GB DDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina (dGPU challenges)",
            maxMacosSupport: "Ventura (dGPU challenges)",
            wifiBluetooth: "Intel Wi-Fi 6 AX201",
            audioCodec: "Realtek ALC3204",
            trackpad: "I2C HID Precision",
            screenResolution: "1920x1200 or 3840x2400",
            chartData: { ease: 70, performance: 95, battery: 75, stability: 85 },
            dimensions: { width: "360.3 mm", depth: "234.2 mm", height: "11.5 mm" },
            weight: "1.84 kg",
            batteryLife: { average: "10-12 hours", capacity: "86Wh", type: "Li-ion" },
            ports: {
                usb: ["2x USB Type-C"],
                thunderbolt: "2x Thunderbolt 3",
                video: ["DisplayPort over USB-C"],
                network: "No built-in Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Dell Premium Keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: ["1920x1200", "3840x2400"],
                aspectRatio: "16:10",
                brightness: "500 nits",
                colorGamut: "100% Adobe RGB",
                panel: "Sharp/Dell Premium Panel",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest Dell BIOS",
                notes: "dGPU must be disabled, CFG lock needs configuration",
                secureBootSupport: true
            },
            knownIssues: [
                "NVIDIA GPU must be disabled",
                "Wi-Fi card may need replacement",
                "Sleep requires additional patches",
                "Thunderbolt hot-plug might be unstable"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Multiple GitHub guides", "Active forum support", "Regular updates available"]
            },
            guides: {
                installation: "https://github.com/username/precision-5550-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/precision-5550",
                    "https://github.com/another-repo/precision-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan with vapor chamber",
                undervolting: "Limited due to BIOS restrictions"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "Dell"
    },
    hp_probook_450_g7: {
        name: "HP ProBook 450 G7",
        priority: ["budget", "ease"],
        score: 8.5,
        summary: "Business laptop with good value",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel UHD Graphics (Comet Lake)",
            ram: "Up to 32GB DDR4",
            storage: "SATA + NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel AX201 / Realtek RTL8822CE (Realtek often problematic)",
            audioCodec: "Realtek ALC236",
            trackpad: "Synaptics",
            screenResolution: "1366x768 or 1920x1080",
            chartData: { ease: 85, performance: 80, battery: 80, stability: 85 },
            dimensions: { width: "359 mm", depth: "233.8 mm", height: "19.9 mm" },
            weight: "2 kg",
            batteryLife: { average: "10-12 hours", capacity: "45Wh", type: "3-cell Li-ion" },
            ports: {
                usb: ["3x USB 3.1 Type-A", "1x USB Type-C"],
                thunderbolt: "No",
                video: ["HDMI 1.4b"],
                network: "RJ45 Gigabit Ethernet",
                others: ["SD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: {
                type: "HP Premium Keyboard",
                backlit: true,
                numpad: true,
                layout: "Full-size with numpad"
            },
            displayFeatures: {
                type: "IPS Anti-glare LED",
                resolution: ["1366x768", "1920x1080"],
                aspectRatio: "16:9",
                brightness: "250 nits",
                colorGamut: "45% NTSC",
                panel: "HP Value Display",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest HP BIOS",
                notes: "CFG lock must be disabled via BIOS mod",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card needs replacement",
                "Sleep may need additional patches",
                "Fingerprint reader not supported",
                "Battery reporting might need fixes"
            ],
            communitySupport: {
                rating: "Very Good",
                resources: ["GitHub guides available", "Active forum support", "Well-documented solutions"]
            },
            guides: {
                installation: "https://github.com/username/probook-450-g7-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/probook-450-g7",
                    "https://github.com/another-repo/probook-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "70-80°C",
                coolingSystem: "Single fan with heat pipe",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "HP"
    },
    samsung_notebook_9: {
        name: "Samsung Notebook 9",
        priority: ["portability"],
        score: 8.3,
        summary: "Ultra-lightweight laptop with good performance",
        details: {
            cpu: "Intel Core i5/i7 8th Gen",
            igpu: "Intel UHD 620",
            ram: "Up to 16GB LPDDR3",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel AC 8265/9560",
            audioCodec: "Realtek ALC298",
            trackpad: "ELAN I2C",
            screenResolution: "1920x1080 (FHD)",
            chartData: { ease: 80, performance: 85, battery: 85, stability: 80 },
            dimensions: { width: "313.5 mm", depth: "218.5 mm", height: "14.9 mm" },
            weight: "1.29 kg",
            batteryLife: { average: "10-12 hours", capacity: "75Wh", type: "Li-Polymer" },
            ports: {
                usb: ["2x USB 3.0 Type-A", "1x USB Type-C"],
                thunderbolt: "1x Thunderbolt 3",
                video: ["HDMI"],
                network: "No built-in Ethernet",
                others: ["microSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Backlit keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "IPS LED-backlit",
                resolution: "1920x1080",
                aspectRatio: "16:9",
                brightness: "300 nits",
                colorGamut: "72% NTSC",
                panel: "AU Optronics",
                touchscreen: false
            },
            biosVersion: {
                recommended: "Latest available",
                notes: "DVMT configuration needed",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card requires replacement",
                "Sleep needs additional patches",
                "Function keys may need remapping",
                "Battery status needs ECEnabler.kext"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Some GitHub guides", "Forum support available", "Growing documentation"]
            },
            guides: {
                installation: "https://github.com/username/samsung-notebook9-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/samsung-notebook-9",
                    "https://github.com/another-repo/notebook9-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan system",
                undervolting: "Supported via ThrottleStop"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution",
            "details.displayFeatures.panel"
        ],
        brand: "Samsung"
    },
    hp_spectre_x360_13: {
        name: "HP Spectre x360 13",
        priority: ["performance", "portability"],
        score: 8.7,
        summary: "Premium 2-in-1 with excellent build quality",
        details: {
            cpu: "Intel Core i5/i7 10th Gen",
            igpu: "Intel Iris Plus",
            ram: "Up to 16GB LPDDR4",
            storage: "NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Ventura",
            wifiBluetooth: "Intel Wi-Fi 6 AX201",
            audioCodec: "Bang & Olufsen / Realtek",
            trackpad: "I2C HID Precision",
            screenResolution: "1920x1080 (FHD) or 3840x2160 (4K OLED)",
            chartData: { ease: 80, performance: 90, battery: 85, stability: 85 },
            dimensions: { width: "306 mm", depth: "194.5 mm", height: "16.9 mm" },
            weight: "1.27 kg",
            batteryLife: { average: "12-14 hours", capacity: "60Wh", type: "4-cell Li-ion" },
            ports: {
                usb: ["1x USB 3.1 Type-A"],
                thunderbolt: "2x Thunderbolt 4",
                video: ["DisplayPort over USB-C"],
                network: "No built-in Ethernet",
                others: ["microSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "HP Premium Keyboard", backlit: true, numpad: false, layout: "Full-size" },
            displayFeatures: {
                type: "OLED/IPS Touch Display",
                resolution: ["1920x1080", "3840x2160"],
                aspectRatio: "16:9",
                brightness: "400 nits",
                colorGamut: "100% DCI-P3",
                panel: "Samsung OLED/HP Sure View",
                touchscreen: true
            },
            biosVersion: {
                recommended: "Latest HP BIOS",
                notes: "CFG lock must be disabled",
                secureBootSupport: true
            },
            knownIssues: [
                "Wi-Fi card needs replacement",
                "Touchscreen requires patches",
                "Sleep states need configuration",
                "Fingerprint reader not supported"
            ],
            communitySupport: {
                rating: "Good",
                resources: ["Multiple GitHub guides", "Active forum support", "Regular updates available"]
            },
            guides: {
                installation: "https://github.com/username/spectre-x360-13-opencore",
                additional: [
                    "https://www.tonymacx86.com/threads/spectre-x360-13",
                    "https://github.com/another-repo/spectre13-efi"
                ]
            },
            thermals: {
                idleTemp: "35-40°C",
                loadTemp: "75-85°C",
                coolingSystem: "Dual fan cooling",
                undervolting: "Limited by BIOS restrictions"
            }
        },
        needsVerification: [
            "details.macosSupport",
            "details.minMacosSupport",
            "details.maxMacosSupport",
            "details.wifiBluetooth",
            "details.audioCodec",
            "details.trackpad",
            "details.screenResolution"
        ],
        brand: "HP"
    },
    dell_xps_13_9360: {
        name: "Dell XPS 13 9360",
        priority: ["portability", "budget"],
        score: 8.8,
        summary: "Compact, widely documented ultrabook that's cheap on the used market",
        details: {
            cpu: "Intel Core i5/i7 7th Gen (Kaby Lake) or 8th Gen (Kaby Lake R)",
            igpu: "Intel HD 620 / UHD 620",
            ram: "4-16GB LPDDR3 (soldered)",
            storage: "M.2 2280 (SATA or NVMe)",
            macosSupport: "Monterey",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            wifiBluetooth: "Killer 1535 (QCA6174) or Intel 8265 (often replaced with Broadcom DW1830/DW1560)",
            audioCodec: "Realtek ALC3246 (ALC256)",
            trackpad: "I2C HID Precision (VoodooI2C)",
            screenResolution: "1920x1080 (FHD) or 3200x1800 (QHD+ touch)",
            chartData: { ease: 85, performance: 70, battery: 80, stability: 88 },
            dimensions: { width: "304 mm", depth: "200 mm", height: "9-15 mm" },
            weight: "1.2 kg",
            batteryLife: { average: "7-10 hours", capacity: "60Wh", type: "Internal Li-ion" },
            ports: {
                usb: ["2x USB 3.0 Type-A"],
                thunderbolt: "1x Thunderbolt 3 (USB-C)",
                video: ["DisplayPort over USB-C"],
                network: "None (Wi-Fi only)",
                others: ["SD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: { type: "Chiclet", backlit: true, numpad: false, layout: "Compact" },
            displayFeatures: {
                type: "IPS (matte FHD or glossy QHD+ touch)",
                resolution: "1920x1080 / 3200x1800",
                aspectRatio: "16:9",
                brightness: "400 nits",
                colorGamut: "72% NTSC (FHD)",
                touchscreen: "QHD+ models only"
            },
            biosVersion: {
                recommended: "Latest",
                notes: "Disable CFG Lock (via modified variable) or use AppleXcpmCfgLock",
                secureBootSupport: true
            },
            knownIssues: [
                "Stock Killer/Intel Wi-Fi needs replacing or itlwm",
                "Fingerprint reader not supported",
                "Thunderbolt hot-plug can be unreliable"
            ],
            communitySupport: {
                rating: "Excellent",
                resources: ["Many public OpenCore EFIs", "Long-running forum threads", "Popular r/hackintosh model"]
            },
            guides: {
                installation: "https://dortania.github.io/OpenCore-Install-Guide/config-laptop.plist/kaby-lake.html",
                additional: []
            },
            thermals: {
                idleTemp: "35-45°C",
                loadTemp: "80-90°C",
                coolingSystem: "Dual fan",
                undervolting: "Possible with VoltageShift"
            }
        },
        needsVerification: ["details.macosSupport", "details.maxMacosSupport", "details.thermals"],
        brand: "Dell"
    },
    thinkpad_x1_carbon_gen6: {
        name: "ThinkPad X1 Carbon Gen 6",
        priority: ["ease", "portability"],
        score: 9,
        summary: "Lightweight business ultrabook with one of the best-documented OpenCore setups",
        details: {
            cpu: "Intel Core i5/i7 8th Gen (Kaby Lake R)",
            igpu: "Intel UHD 620",
            ram: "8-16GB LPDDR3 (soldered)",
            storage: "M.2 2280 NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            wifiBluetooth: "Intel Wireless-AC 8265 (replaceable M.2; Broadcom or itlwm)",
            audioCodec: "Realtek ALC3286 (ALC285)",
            trackpad: "Synaptics (VoodooRMI / VoodooPS2)",
            screenResolution: "1920x1080 (FHD) or 2560x1440 (WQHD)",
            chartData: { ease: 88, performance: 75, battery: 82, stability: 92 },
            dimensions: { width: "323.5 mm", depth: "217.1 mm", height: "15.95 mm" },
            weight: "1.13 kg",
            batteryLife: { average: "8-11 hours", capacity: "57Wh", type: "Internal Li-ion" },
            ports: {
                usb: ["2x USB 3.1 Gen 1 Type-A"],
                thunderbolt: "2x Thunderbolt 3 (USB-C)",
                video: ["HDMI 1.4b"],
                network: "Ethernet via proprietary adapter",
                others: ["microSD Card Reader", "3.5mm Audio Jack"]
            },
            keyboard: {
                type: "ThinkPad Precision Keyboard",
                backlit: true,
                numpad: false,
                layout: "Full-size, spill-resistant"
            },
            displayFeatures: {
                type: "IPS Anti-glare (HDR option on WQHD)",
                resolution: "1920x1080 / 2560x1440",
                aspectRatio: "16:9",
                brightness: "300-500 nits",
                colorGamut: "72% NTSC (FHD)",
                touchscreen: "Optional on FHD"
            },
            biosVersion: {
                recommended: "Latest",
                notes: "Set Sleep State to 'Linux' (S3) in BIOS; disable CFG Lock",
                secureBootSupport: true
            },
            knownIssues: [
                "Requires BIOS sleep state set to Linux/S3",
                "Fingerprint reader not supported",
                "WWAN modem not supported"
            ],
            communitySupport: {
                rating: "Excellent",
                resources: ["Detailed public OpenCore repository", "Active ThinkPad Hackintosh community"]
            },
            guides: {
                installation: "https://github.com/tylernguyen/x1c6-hackintosh",
                additional: []
            },
            thermals: {
                idleTemp: "35-45°C",
                loadTemp: "75-90°C",
                coolingSystem: "Single fan",
                undervolting: "Possible with VoltageShift"
            }
        },
        needsVerification: ["details.macosSupport", "details.maxMacosSupport", "details.thermals"],
        brand: "Lenovo"
    },
    thinkpad_t490: {
        name: "ThinkPad T490",
        priority: ["ease", "budget"],
        score: 8.7,
        summary: "Slimmer successor to the T480 with similar compatibility, minus the hot-swap battery",
        details: {
            cpu: "Intel Core i5/i7 8th Gen (Whiskey Lake)",
            igpu: "Intel UHD 620",
            dgpu: "Optional NVIDIA MX250 (must be disabled)",
            ram: "8-16GB soldered + 1x DDR4 SO-DIMM",
            storage: "M.2 2280 NVMe",
            macosSupport: "Monterey",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Sonoma",
            wifiBluetooth: "Intel Wireless-AC 9560 (CNVi, soldered on many units; itlwm)",
            audioCodec: "Realtek ALC3287 (ALC257)",
            trackpad: "Synaptics (VoodooRMI / VoodooPS2)",
            screenResolution: "1920x1080 (FHD) or 2560x1440 (WQHD)",
            chartData: { ease: 82, performance: 78, battery: 75, stability: 88 },
            dimensions: { width: "329 mm", depth: "227 mm", height: "17.9 mm" },
            weight: "1.46 kg",
            batteryLife: { average: "8-11 hours", capacity: "50Wh", type: "Internal Li-ion" },
            ports: {
                usb: ["2x USB 3.1 Gen 1 Type-A", "1x USB-C 3.1"],
                thunderbolt: "1x Thunderbolt 3 (USB-C)",
                video: ["HDMI 1.4b"],
                network: "Ethernet via proprietary adapter",
                others: ["microSD Card Reader", "3.5mm Audio Jack", "Smart Card Reader (optional)"]
            },
            keyboard: {
                type: "ThinkPad Precision Keyboard",
                backlit: true,
                numpad: false,
                layout: "Full-size, spill-resistant"
            },
            displayFeatures: {
                type: "IPS Anti-glare",
                resolution: "1920x1080 / 2560x1440",
                aspectRatio: "16:9",
                brightness: "250-500 nits",
                colorGamut: "45-72% NTSC",
                touchscreen: "Optional on FHD"
            },
            biosVersion: {
                recommended: "Latest",
                notes: "Disable CFG Lock; set Sleep State to Linux if available",
                secureBootSupport: true
            },
            knownIssues: [
                "CNVi Wi-Fi can't be swapped for Broadcom; itlwm only",
                "MX250 dGPU models must disable the dGPU via SSDT",
                "Fingerprint reader not supported"
            ],
            communitySupport: {
                rating: "Very Good",
                resources: ["Several public OpenCore EFIs", "Shares most config with T480/X1C6"]
            },
            guides: {
                installation: "https://dortania.github.io/OpenCore-Install-Guide/config-laptop.plist/coffee-lake.html",
                additional: []
            },
            thermals: {
                idleTemp: "35-45°C",
                loadTemp: "75-90°C",
                coolingSystem: "Single fan",
                undervolting: "Possible with VoltageShift"
            }
        },
        needsVerification: ["details.macosSupport", "details.maxMacosSupport", "details.batteryLife", "details.thermals"],
        brand: "Lenovo"
    },
    dell_xps_15_9550: {
        name: "Dell XPS 15 (9550)",
        brand: "Dell",
        priority: ["performance"],
        score: 8,
        summary: "Good performance; discrete GPU may need additional work but Intel graphics work well.",
        details: {
            cpu: "Intel Core i7-6700HQ",
            igpu: "Intel HD 530",
            dgpu: "optional NVIDIA GTX 960M (must be disabled)",
            ram: "16GB DDR4",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "3840x2160",
            chartData: { ease: 80, performance: 82, battery: 92, stability: 75 },
            batteryLife: { capacity: "84Wh", type: "Li-ion" },
            ports: {
                usb: ["2x USB 3.0"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IGZO / IPS", brightness: "350 nits" },
            knownIssues: [
                "Discrete NVIDIA GPU not supported in recent macOS",
                "WiFi card replacement recommended for full functionality"
            ]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    thinkpad_x1_carbon_5th_gen: {
        name: "ThinkPad X1 Carbon (5th Gen)",
        brand: "Lenovo",
        priority: ["portability"],
        score: 8.8,
        summary: "Slim ultrabook with strong community support for Hackintosh configurations.",
        details: {
            cpu: "Intel Core i7-7600U",
            igpu: "Intel HD 620",
            ram: "16GB LPDDR3 (soldered)",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 88, performance: 70, battery: 63, stability: 88 },
            batteryLife: { capacity: "57Wh", type: "Li-ion" },
            ports: {
                usb: ["2x USB 3.0"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI (via adapter)"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi compatibility varies by SKU", "Fn keys and audio may need kext adjustments"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_zenbook_ux331: {
        name: "ASUS ZenBook UX331",
        brand: "ASUS",
        priority: ["budget"],
        score: 7.5,
        summary: "Budget ultrabook with workable Hackintosh guides; good for lightweight builds.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 75, performance: 62, battery: 55, stability: 75 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C", "USB-A"],
                video: ["microHDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Audio and trackpad tweaks often required", "WiFi card swap recommended for best compatibility"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    gigabyte_aero_15: {
        name: "Gigabyte Aero 15",
        brand: "Gigabyte",
        priority: ["performance"],
        score: 8.2,
        summary: "Higher performance laptops with good Intel GPU support for macOS; popular among power users.",
        details: {
            cpu: "Intel Core i7-9750H",
            igpu: "Intel UHD 630",
            dgpu: "NVIDIA GTX 1660 Ti (must be disabled)",
            ram: "16GB DDR4",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 82, performance: 82, battery: 95, stability: 77 },
            batteryLife: { capacity: "94Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C", "USB-A"],
                video: ["HDMI"],
                network: "Ethernet (via adapter)"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: [
                "Discrete GPU generally unsupported; use integrated GPU",
                "BIOS settings tweaks required for boot"
            ]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_thinkpad_t14_gen1: {
        name: "Lenovo ThinkPad T14 (Gen1)",
        brand: "Lenovo",
        priority: ["ease"],
        score: 8.2,
        summary: "Business laptop with good BIOS options for macOS.",
        details: {
            cpu: "Intel Core i5-10210U",
            igpu: "Intel UHD",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Catalina",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 82, performance: 62, battery: 50, stability: 82 },
            batteryLife: { capacity: "45Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Bluetooth kext work", "Trackpad responsiveness tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    thinkpad_t470: {
        name: "ThinkPad T470",
        brand: "Lenovo",
        priority: ["ease"],
        score: 8,
        summary: "Older ThinkPad favored for stable Hackintosh installs.",
        details: {
            cpu: "Intel Core i5-7200U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 80, performance: 62, battery: 53, stability: 80 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["WiFi swap recommended", "Power management tuning"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_thinkpad_p52: {
        name: "Lenovo ThinkPad P52",
        brand: "Lenovo",
        priority: ["performance"],
        score: 7.4,
        summary: "Workstation-class hardware — great CPU but discrete GPU may be unsupported.",
        details: {
            cpu: "Intel Xeon/E-2176M",
            igpu: "Unknown",
            dgpu: "NVIDIA Quadro P2000 (must be disabled)",
            ram: "32GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 74, performance: 88, battery: 95, stability: 69 },
            batteryLife: { capacity: "90Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU not supported", "BIOS tweaks required"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_thinkpad_p1_gen2: {
        name: "Lenovo ThinkPad P1 (Gen2)",
        brand: "Lenovo",
        priority: ["performance"],
        score: 7.6,
        summary: "Slim workstation using Intel CPUs; integrated graphics easier to support.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Intel UHD 630",
            dgpu: "NVIDIA GTX 1050 Ti (must be disabled)",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "3840x2160",
            chartData: { ease: 76, performance: 82, battery: 88, stability: 71 },
            batteryLife: { capacity: "80Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "400 nits" },
            knownIssues: ["NVIDIA drivers unsupported", "Trackpad kexts may be needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dell_latitude_5490: {
        name: "Dell Latitude 5490",
        brand: "Dell",
        priority: ["ease"],
        score: 8.4,
        summary: "Enterprise laptop with many successful Hackintosh builds.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 84, performance: 62, battery: 66, stability: 84 },
            batteryLife: { capacity: "60Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi module swap suggested", "Audio may need kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dell_latitude_7280: {
        name: "Dell Latitude 7280",
        brand: "Dell",
        priority: ["portability"],
        score: 8.3,
        summary: "Ultrabook form factor, reliable for macOS with small tweaks.",
        details: {
            cpu: "Intel Core i7-7600U",
            igpu: "Intel HD 620",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 83, performance: 70, battery: 66, stability: 83 },
            batteryLife: { capacity: "60Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C (via adapter)"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi compatibility varies", "Fn keys mapping"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dell_inspiron_5570: {
        name: "Dell Inspiron 5570",
        brand: "Dell",
        priority: ["budget"],
        score: 7,
        summary: "Consumer laptop; community guides exist but require more tweaks.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 70, performance: 62, battery: 46, stability: 70 },
            batteryLife: { capacity: "42Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                others: ["SD card"]
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["Audio kexts", "WiFi driver fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dell_precision_5520: {
        name: "Dell Precision 5520",
        brand: "Dell",
        priority: ["performance"],
        score: 7.8,
        summary: "Mobile workstation; use integrated GPU for macOS.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Intel HD 630",
            dgpu: "NVIDIA Quadro M1200 (must be disabled)",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "3840x2160",
            chartData: { ease: 78, performance: 82, battery: 95, stability: 73 },
            batteryLife: { capacity: "97Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IGZO", brightness: "400 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS config needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    hp_elitebook_840_g3: {
        name: "HP EliteBook 840 G3",
        brand: "HP",
        priority: ["ease"],
        score: 8.3,
        summary: "Stable builds exist for this generation; good battery life.",
        details: {
            cpu: "Intel Core i5-6300U",
            igpu: "Intel HD 520",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 83, performance: 62, battery: 55, stability: 83 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi replacement advised", "Audio fixes with kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    hp_elitebook_850_g4: {
        name: "HP EliteBook 850 G4",
        brand: "HP",
        priority: ["portability"],
        score: 7.9,
        summary: "Business laptop with common kext work needed for networking.",
        details: {
            cpu: "Intel Core i7-7600U",
            igpu: "Intel HD 620",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 79, performance: 70, battery: 62, stability: 79 },
            batteryLife: { capacity: "56Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI (via adapter)"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi & BT kexts", "Keyboard mapping fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    hp_zbook_15u_g4: {
        name: "HP ZBook 15u G4",
        brand: "HP",
        priority: ["performance"],
        score: 7.2,
        summary: "Older mobile workstation; use integrated graphics for compatibility.",
        details: {
            cpu: "Intel Core i7-7600U",
            igpu: "Intel HD 620",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 72, performance: 70, battery: 53, stability: 72 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS tuning required"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    hp_spectre_13: {
        name: "HP Spectre 13",
        brand: "HP",
        priority: ["portability"],
        score: 7.5,
        summary: "Stylish ultrabook; audio and Bluetooth may need tweaks.",
        details: {
            cpu: "Intel Core i7-7500U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 75, performance: 70, battery: 63, stability: 75 },
            batteryLife: { capacity: "57Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C", "USB-A (via adapter)"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Audio kexts", "WiFi module swap may be needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    hp_envy_13: {
        name: "HP Envy 13",
        brand: "HP",
        priority: ["budget"],
        score: 7.1,
        summary: "Mid-range ultrabook with moderate community support.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 71, performance: 62, battery: 57, stability: 71 },
            batteryLife: { capacity: "52Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C", "USB-A"],
                others: ["microSD"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi/Bluetooth kexts", "Touchpad tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_zenbook_14: {
        name: "ASUS ZenBook 14",
        brand: "ASUS",
        priority: ["portability"],
        score: 7.4,
        summary: "Thin and light with a few successful Hackintosh guides.",
        details: {
            cpu: "Intel Core i5-8265U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 74, performance: 62, battery: 55, stability: 74 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI (via adapter)"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Audio and WiFi adjustments", "Function keys mapping"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_zenbook_15: {
        name: "ASUS ZenBook 15",
        brand: "ASUS",
        priority: ["portability"],
        score: 7.3,
        summary: "Larger ZenBook; good balance between portability and performance.",
        details: {
            cpu: "Intel Core i7-8565U",
            igpu: "Intel UHD 620",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 73, performance: 70, battery: 78, stability: 73 },
            batteryLife: { capacity: "71Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "350 nits" },
            knownIssues: ["WiFi swap recommended", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_vivobook_s15: {
        name: "ASUS VivoBook S15",
        brand: "ASUS",
        priority: ["budget"],
        score: 6.8,
        summary: "Budget ultrabook; community builds exist with more effort.",
        details: {
            cpu: "Intel Core i5-8265U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 68, performance: 62, battery: 46, stability: 68 },
            batteryLife: { capacity: "42Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["Trackpad fixes", "WiFi replacement commonly needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_rog_strix_hero: {
        name: "ASUS ROG Strix Hero",
        brand: "ASUS",
        priority: ["performance"],
        score: 6.9,
        summary: "Gaming laptop; use integrated GPU for macOS compatibility.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Intel UHD 630",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 69, performance: 82, battery: 73, stability: 64 },
            batteryLife: { capacity: "66Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS tweaks required"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_vivobook_pro: {
        name: "ASUS VivoBook Pro",
        brand: "ASUS",
        priority: ["budget"],
        score: 6.7,
        summary: "Multimedia laptop — workable but requires kext replacements.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1050 (must be disabled)",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 67, performance: 82, battery: 53, stability: 62 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["NVIDIA not supported", "WiFi swap recommended"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    msi_p65_creator: {
        name: "MSI P65 Creator",
        brand: "MSI",
        priority: ["performance"],
        score: 7.3,
        summary: "Creator-focused laptop; integrated GPU is best for macOS.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Intel UHD 630",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "3840x2160",
            chartData: { ease: 73, performance: 82, battery: 88, stability: 68 },
            batteryLife: { capacity: "80Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "400 nits" },
            knownIssues: ["Discrete GPU unuseable", "BIOS settings required"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    razer_blade_15: {
        name: "Razer Blade 15",
        brand: "Razer",
        priority: ["performance"],
        score: 6.8,
        summary: "Premium gaming laptop; some community builds but often finicky.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 68, performance: 82, battery: 88, stability: 63 },
            batteryLife: { capacity: "80Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU problems", "Touchpad and audio tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    acer_predator_helios_300: {
        name: "Acer Predator Helios 300",
        brand: "Acer",
        priority: ["performance"],
        score: 6.5,
        summary: "Gaming laptop with adequate CPU; use integrated graphics for macOS.",
        details: {
            cpu: "Intel Core i7-9750H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1660 Ti (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 65, performance: 82, battery: 65, stability: 60 },
            batteryLife: { capacity: "59Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU unsupported", "Power management tuning"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    acer_aspire_5: {
        name: "Acer Aspire 5",
        brand: "Acer",
        priority: ["budget"],
        score: 6.4,
        summary: "Affordable general-purpose laptop; decent for entry-level Hackintosh setups.",
        details: {
            cpu: "Intel Core i5-8265U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 64, performance: 62, battery: 53, stability: 64 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["Audio & WiFi kexts required", "Longer setup time"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    acer_swift_5: {
        name: "Acer Swift 5",
        brand: "Acer",
        priority: ["portability"],
        score: 6.9,
        summary: "Lightweight clamshell with moderate community support.",
        details: {
            cpu: "Intel Core i7-8565U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 69, performance: 70, battery: 62, stability: 69 },
            batteryLife: { capacity: "56Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi module may need swap", "Audio fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    samsung_galaxy_book_12: {
        name: "Samsung Galaxy Book 12",
        brand: "Samsung",
        priority: ["portability"],
        score: 6.3,
        summary: "Convertible Windows laptop; community builds exist with caveats.",
        details: {
            cpu: "Intel Core i5-7200U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "2160x1440",
            chartData: { ease: 63, performance: 62, battery: 46, stability: 63 },
            batteryLife: { capacity: "42Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C"],
                others: ["microSD"]
            },
            displayFeatures: { type: "AMOLED", brightness: "350 nits" },
            knownIssues: ["Touchscreen unsupported", "WiFi and audio fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    microsoft_surface_laptop_2: {
        name: "Microsoft Surface Laptop 2",
        brand: "Microsoft",
        priority: ["portability"],
        score: 6.6,
        summary: "Surface hardware sometimes workable but often needs advanced tweaks.",
        details: {
            cpu: "Intel Core i7-8650U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "2256x1504",
            chartData: { ease: 66, performance: 70, battery: 50, stability: 66 },
            batteryLife: { capacity: "45Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A (via adapter)"],
                others: ["Surface Connect"]
            },
            displayFeatures: { type: "PixelSense", brightness: "350 nits" },
            knownIssues: ["Touchscreen not supported", "Power management oddities"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_ideapad_720s: {
        name: "Lenovo IdeaPad 720S",
        brand: "Lenovo",
        priority: ["portability"],
        score: 6.8,
        summary: "Consumer ultrabook with some community success stories.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 68, performance: 62, battery: 62, stability: 68 },
            batteryLife: { capacity: "56Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi swap recommended", "Audio tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_yoga_720: {
        name: "Lenovo Yoga 720",
        brand: "Lenovo",
        priority: ["portability"],
        score: 7.1,
        summary: "Convertible Yoga series with workable macOS builds in the community.",
        details: {
            cpu: "Intel Core i7-7700U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 71, performance: 70, battery: 53, stability: 71 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI (via adapter)"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Touchscreen unsupported", "Bluetooth fixes often required"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_yoga_c930: {
        name: "Lenovo Yoga C930",
        brand: "Lenovo",
        priority: ["portability"],
        score: 6.5,
        summary: "Stylish convertible; macOS builds more involved due to unique hardware.",
        details: {
            cpu: "Intel Core i7-8550U",
            igpu: "Intel UHD 620",
            ram: "12GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 65, performance: 70, battery: 66, stability: 65 },
            batteryLife: { capacity: "60Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C"],
                thunderbolt: "Thunderbolt 3 (via adapter)"
            },
            displayFeatures: { type: "IPS", brightness: "350 nits" },
            knownIssues: ["Audio and pen not supported", "WiFi tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    thinkpad_x270: {
        name: "ThinkPad X270",
        brand: "Lenovo",
        priority: ["portability"],
        score: 7.9,
        summary: "Compact ThinkPad with reliable Hackintosh guidance.",
        details: {
            cpu: "Intel Core i5-7300U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1366x768 / 1920x1080 options",
            chartData: { ease: 79, performance: 62, battery: 43, stability: 79 },
            batteryLife: { capacity: "39Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["WiFi replacement often needed", "Trackpad mapping"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    thinkpad_x260: {
        name: "ThinkPad X260",
        brand: "Lenovo",
        priority: ["ease"],
        score: 7.8,
        summary: "Widely used older ThinkPad; very hackintosh-friendly with known guides.",
        details: {
            cpu: "Intel Core i5-6200U",
            igpu: "Intel HD 520",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1366x768",
            chartData: { ease: 78, performance: 62, battery: 53, stability: 78 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "220 nits" },
            knownIssues: ["WiFi replacement", "Older connectors"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    gigabyte_p55w: {
        name: "Gigabyte P55W",
        brand: "Gigabyte",
        priority: ["performance"],
        score: 7.1,
        summary: "Gaming/creator laptop; integrated GPU recommended for macOS.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 71, performance: 82, battery: 67, stability: 66 },
            batteryLife: { capacity: "61Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU not supported", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    gigabyte_aero_slim_7: {
        name: "Gigabyte AERO Slim 7",
        brand: "Gigabyte",
        priority: ["performance"],
        score: 7.5,
        summary: "Creator laptop with good Intel support when using integrated graphics.",
        details: {
            cpu: "Intel Core i7-9750H",
            igpu: "Intel UHD 630",
            dgpu: "NVIDIA GTX 1660 Ti (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "3840x2160",
            chartData: { ease: 75, performance: 82, battery: 95, stability: 70 },
            batteryLife: { capacity: "94Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C", "USB-A"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "400 nits" },
            knownIssues: ["NVIDIA disabled for compatibility", "BIOS tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    toshiba_tecra_z50: {
        name: "Toshiba Tecra Z50",
        brand: "Toshiba",
        priority: ["ease"],
        score: 7.2,
        summary: "Older business laptop; stable community guides exist.",
        details: {
            cpu: "Intel Core i7-6500U",
            igpu: "Intel HD 520",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 72, performance: 70, battery: 53, stability: 72 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["WiFi swap recommended", "Audio fixes with kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    sony_vaio_svf: {
        name: "Sony VAIO SVF",
        brand: "Sony",
        priority: ["budget"],
        score: 5.8,
        summary: "Legacy VAIO models — possible but often require advanced work.",
        details: {
            cpu: "Intel Core i5-5200U",
            igpu: "Intel HD 5500",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "High Sierra",
            minMacosSupport: "Yosemite",
            maxMacosSupport: "High Sierra",
            screenResolution: "1920x1080",
            chartData: { ease: 58, performance: 62, battery: 50, stability: 58 },
            batteryLife: { capacity: "45Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["Driver gaps", "Longer setup time"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    hp_omen_15: {
        name: "HP Omen 15",
        brand: "HP",
        priority: ["performance"],
        score: 6.3,
        summary: "Gaming laptop with strong CPU but discrete GPUs complicate macOS support.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 63, performance: 82, battery: 77, stability: 58 },
            batteryLife: { capacity: "70Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU not supported", "Cooling/power tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_legion_y520: {
        name: "Lenovo Legion Y520",
        brand: "Lenovo",
        priority: ["budget"],
        score: 6.2,
        summary: "Budget gaming laptop; integrated GPU is the path for macOS.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1050 Ti (must be disabled)",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 62, performance: 82, battery: 57, stability: 57 },
            batteryLife: { capacity: "52Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS and sleep fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_legion_y540: {
        name: "Lenovo Legion Y540",
        brand: "Lenovo",
        priority: ["performance"],
        score: 6.5,
        summary: "More recent Legion model; compatible if using integrated graphics and specific BIOS settings.",
        details: {
            cpu: "Intel Core i7-9750H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1660 Ti (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 65, performance: 82, battery: 66, stability: 60 },
            batteryLife: { capacity: "60Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU not supported", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    acer_aspire_vx_15: {
        name: "Acer Aspire VX 15",
        brand: "Acer",
        priority: ["budget"],
        score: 6.4,
        summary: "Gaming-oriented but workable using integrated graphics.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1050 Ti (must be disabled)",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 64, performance: 82, battery: 57, stability: 59 },
            batteryLife: { capacity: "52Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU", "WiFi replacements often needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    huawei_matebook_x: {
        name: "Huawei MateBook X",
        brand: "Huawei",
        priority: ["portability"],
        score: 6.2,
        summary: "Premium ultrabook; workable but limited community support.",
        details: {
            cpu: "Intel Core i7-8550U",
            igpu: "Intel UHD 620",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "2160x1440",
            chartData: { ease: 62, performance: 70, battery: 45, stability: 62 },
            batteryLife: { capacity: "41Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-C (2x)"]
            },
            displayFeatures: { type: "IPS", brightness: "350 nits" },
            knownIssues: ["WiFi/BT fixes", "Audio mapping"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    clevo_n850hk: {
        name: "Clevo N850HK",
        brand: "Clevo",
        priority: ["performance"],
        score: 6.6,
        summary: "Barebones gaming laptop; integrated GPU path is recommended.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1070 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 66, performance: 82, battery: 68, stability: 61 },
            batteryLife: { capacity: "62Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU not supported", "Complex BIOS settings"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    msi_gl63: {
        name: "MSI GL63",
        brand: "MSI",
        priority: ["budget"],
        score: 6.3,
        summary: "Entry gaming laptop: usable for macOS if using integrated GPU.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1050 Ti (must be disabled)",
            ram: "8-16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 63, performance: 82, battery: 56, stability: 58 },
            batteryLife: { capacity: "51Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU", "Sleep issues require patches"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    toshiba_satellite_pro: {
        name: "Toshiba Satellite Pro",
        brand: "Toshiba",
        priority: ["budget"],
        score: 6.2,
        summary: "Basic business laptop with older Intel hardware — reasonable support.",
        details: {
            cpu: "Intel Core i5-7200U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1366x768 / 1920x1080",
            chartData: { ease: 62, performance: 62, battery: 50, stability: 62 },
            batteryLife: { capacity: "45Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "220-250 nits" },
            knownIssues: ["WiFi swap", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    fujitsu_lifebook_u748: {
        name: "Fujitsu LifeBook U748",
        brand: "Fujitsu",
        priority: ["ease"],
        score: 7.4,
        summary: "Business-class Lifebook; many have reported workable installations.",
        details: {
            cpu: "Intel Core i5-6200U",
            igpu: "Intel HD 520",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1366x768 / 1920x1080",
            chartData: { ease: 74, performance: 62, battery: 55, stability: 74 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["WiFi modules vary", "Audio mapping needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    panasonic_toughbook_54: {
        name: "Panasonic Toughbook 54",
        brand: "Panasonic",
        priority: ["stability"],
        score: 5.9,
        summary: "Rugged laptop — not ideal for macOS, but some success with older releases.",
        details: {
            cpu: "Intel Core i5-7300U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "High Sierra",
            minMacosSupport: "Yosemite",
            maxMacosSupport: "High Sierra",
            screenResolution: "1920x1080",
            chartData: { ease: 59, performance: 62, battery: 95, stability: 59 },
            batteryLife: { capacity: "88Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "400 nits" },
            knownIssues: ["Driver gaps", "Specialized hardware unsupported"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    huawei_matebook_d: {
        name: "Huawei MateBook D",
        brand: "Huawei",
        priority: ["budget"],
        score: 6.2,
        summary: "Budget premium feel; workable with WiFi swaps and kexts.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 62, performance: 62, battery: 63, stability: 62 },
            batteryLife: { capacity: "57Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Audio and WiFi adjustments", "Bluetooth fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    toshiba_portege_x30: {
        name: "Toshiba Portege X30",
        brand: "Toshiba",
        priority: ["portability"],
        score: 7.3,
        summary: "Ultralight enterprise machine — good candidate for macOS with minor fixes.",
        details: {
            cpu: "Intel Core i7-8565U",
            igpu: "Intel UHD 620",
            ram: "16GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 73, performance: 70, battery: 55, stability: 73 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI (via adapter)"]
            },
            displayFeatures: { type: "IPS", brightness: "350 nits" },
            knownIssues: ["WiFi module compatibility", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dell_precision_7710: {
        name: "Dell Precision 7710",
        brand: "Dell",
        priority: ["performance"],
        score: 7,
        summary: "Older precision mobile workstation — possible with integrated GPU.",
        details: {
            cpu: "Intel Xeon E3",
            igpu: "Unknown",
            dgpu: "NVIDIA Quadro M2000M (must be disabled)",
            ram: "32GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 70, performance: 88, battery: 95, stability: 65 },
            batteryLife: { capacity: "90Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3 (via adapter)",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "350 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS changes needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dell_g3_15: {
        name: "Dell G3 15",
        brand: "Dell",
        priority: ["budget"],
        score: 6.3,
        summary: "Budget gaming series; workable with effort.",
        details: {
            cpu: "Intel Core i5-8300H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1050 (must be disabled)",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 63, performance: 82, battery: 56, stability: 58 },
            batteryLife: { capacity: "51Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU", "Sleep issues"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    sager_np8651: {
        name: "Sager NP8651",
        brand: "Sager",
        priority: ["performance"],
        score: 6.7,
        summary: "Clevo-based system; many custom BIOS models but community builds exist.",
        details: {
            cpu: "Intel Core i7-7700HQ",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 67, performance: 82, battery: 68, stability: 62 },
            batteryLife: { capacity: "62Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU not supported", "BIOS and ACPI fixes required"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    toshiba_portege_z30: {
        name: "Toshiba Portege Z30",
        brand: "Toshiba",
        priority: ["portability"],
        score: 7.2,
        summary: "Light business laptop — decent candidate for Hackintosh.",
        details: {
            cpu: "Intel Core i5-6200U",
            igpu: "Intel HD 520",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1366x768 / 1920x1080",
            chartData: { ease: 72, performance: 62, battery: 53, stability: 72 },
            batteryLife: { capacity: "48Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["WiFi replacement often needed", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    compaq_elitebook_840: {
        name: "Compaq EliteBook 840",
        brand: "Compaq",
        priority: ["budget"],
        score: 6.9,
        summary: "Legacy enterprise laptop; generally workable for hobbyist installations.",
        details: {
            cpu: "Intel Core i5-7300U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 69, performance: 62, battery: 55, stability: 69 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"],
                network: "Ethernet"
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["WiFi/BT tweaks", "Audio configuration"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    dynabook_portege: {
        name: "Dynabook Portégé",
        brand: "Dynabook",
        priority: ["portability"],
        score: 7.1,
        summary: "Lightweight business laptop with workable macOS guides.",
        details: {
            cpu: "Intel Core i7-7500U",
            igpu: "Intel HD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 71, performance: 70, battery: 55, stability: 71 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi tweaks", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    asus_proart_studiobook: {
        name: "ASUS ProArt StudioBook",
        brand: "ASUS",
        priority: ["performance"],
        score: 7.2,
        summary: "Creator laptop, better when relying on integrated Intel graphics.",
        details: {
            cpu: "Intel Core i7-9750H",
            igpu: "Unknown",
            dgpu: "NVIDIA Quadro RTX (must be disabled)",
            ram: "32GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "3840x2160",
            chartData: { ease: 72, performance: 82, battery: 84, stability: 67 },
            batteryLife: { capacity: "76Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                thunderbolt: "Thunderbolt 3",
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "400 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS/ACPI fixes"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_ideapad_330: {
        name: "Lenovo IdeaPad 330",
        brand: "Lenovo",
        priority: ["budget"],
        score: 5.9,
        summary: "Budget consumer line; occasional successful builds reported.",
        details: {
            cpu: "Intel Core i5-8250U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 59, performance: 62, battery: 42, stability: 59 },
            batteryLife: { capacity: "38Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "220 nits" },
            knownIssues: ["Audio kexts", "WiFi modules vary by SKU"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_legion_y7000: {
        name: "Lenovo Legion Y7000",
        brand: "Lenovo",
        priority: ["performance"],
        score: 6.4,
        summary: "Gaming laptop with decent CPU; best results when avoiding discrete GPU.",
        details: {
            cpu: "Intel Core i7-8750H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1060 (must be disabled)",
            ram: "16GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 64, performance: 82, battery: 66, stability: 59 },
            batteryLife: { capacity: "60Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["GPU compatibility", "Audio and sleep tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    acer_nitro_5: {
        name: "Acer Nitro 5",
        brand: "Acer",
        priority: ["budget"],
        score: 6.2,
        summary: "Popular budget gaming laptop — workable with integrated GPU only.",
        details: {
            cpu: "Intel Core i5-9300H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1650 (must be disabled)",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 62, performance: 82, battery: 57, stability: 57 },
            batteryLife: { capacity: "52Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "250 nits" },
            knownIssues: ["Discrete GPU limitations", "BIOS/ACPI changes needed"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    msi_modern_14: {
        name: "MSI Modern 14",
        brand: "MSI",
        priority: ["portability"],
        score: 6.7,
        summary: "Lightweight 14-inch laptop; community builds possible.",
        details: {
            cpu: "Intel Core i5-8265U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 67, performance: 62, battery: 55, stability: 67 },
            batteryLife: { capacity: "50Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi/BT compatibility", "Audio kexts"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_thinkbook_13s: {
        name: "Lenovo ThinkBook 13s",
        brand: "Lenovo",
        priority: ["portability"],
        score: 6.5,
        summary: "Business-slim ultrabook with some workable macOS reports.",
        details: {
            cpu: "Intel Core i5-8265U",
            igpu: "Intel UHD 620",
            ram: "8GB",
            storage: "M.2 / 2.5\" SATA (SSD)",
            macosSupport: "Sonoma",
            minMacosSupport: "High Sierra",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 65, performance: 62, battery: 50, stability: 65 },
            batteryLife: { capacity: "45Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["WiFi/BT kexts", "Audio tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    },
    lenovo_legion_5: {
        name: "Lenovo Legion 5",
        brand: "Lenovo",
        priority: ["performance"],
        score: 6.3,
        summary: "Gaming-focused; integrated GPU route for macOS compatibility.",
        details: {
            cpu: "Intel Core i5-9300H",
            igpu: "Unknown",
            dgpu: "NVIDIA GTX 1650 (must be disabled)",
            ram: "8GB",
            storage: "M.2 NVMe",
            macosSupport: "Sonoma",
            minMacosSupport: "Mojave",
            maxMacosSupport: "Sonoma",
            screenResolution: "1920x1080",
            chartData: { ease: 63, performance: 82, battery: 66, stability: 58 },
            batteryLife: { capacity: "60Wh", type: "Li-ion" },
            ports: {
                usb: ["USB-A", "USB-C"],
                video: ["HDMI"]
            },
            displayFeatures: { type: "IPS", brightness: "300 nits" },
            knownIssues: ["Discrete GPU unsupported", "BIOS tweaks"]
        },
        source: "community",
        needsVerification: ["details.macosSupport", "details.minMacosSupport", "details.maxMacosSupport", "details.chartData"]
    }
};

const componentData = {
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

const LaptopDB = {
    all() {
        return Object.entries(laptopData).map(([id, laptop]) => ({ id, ...laptop }));
    },
    get(id) {
        return Object.prototype.hasOwnProperty.call(laptopData, id) ? { id, ...laptopData[id] } : null;
    },
    // Index of the first macOS release name found in a free-text value, or -1.
    macosIndex(text) {
        const lower = String(text || '').toLowerCase();
        return MACOS_VERSIONS.findIndex(v => lower.startsWith(v.toLowerCase()));
    },
    supportsMacos(laptop, version) {
        const target = MACOS_VERSIONS.indexOf(version);
        const min = this.macosIndex(laptop.details.minMacosSupport);
        const max = this.macosIndex(laptop.details.maxMacosSupport);
        if (target < 0 || min < 0 || max < 0) return false;
        return target >= min && target <= max;
    },
    brands() {
        return [...new Set(this.all().map(l => l.brand))].sort((a, b) => a.localeCompare(b));
    },
    isUnverified(laptop, path) {
        return (laptop.needsVerification || []).some(p => p === path || p.startsWith(path + '.'));
    }
};

// Surface data mistakes in the console during development.
(function validate() {
    const required = ['name', 'brand', 'priority', 'score', 'summary', 'details'];
    const metrics = ['ease', 'performance', 'battery', 'stability'];
    const errors = [];
    for (const [id, laptop] of Object.entries(laptopData)) {
        required.forEach(f => { if (laptop[f] === undefined) errors.push(`${id}: missing ${f}`); });
        if (typeof laptop.score !== 'number' || laptop.score < 0 || laptop.score > 10) errors.push(`${id}: invalid score`);
        const chart = laptop.details && laptop.details.chartData;
        metrics.forEach(m => {
            if (!chart || typeof chart[m] !== 'number' || chart[m] < 0 || chart[m] > 100) errors.push(`${id}: invalid chartData.${m}`);
        });
        ['minMacosSupport', 'maxMacosSupport'].forEach(f => {
            if (LaptopDB.macosIndex(laptop.details && laptop.details[f]) < 0) errors.push(`${id}: unrecognised ${f}`);
        });
    }
    if (errors.length) console.error('laptopData validation errors:', errors);
})();
