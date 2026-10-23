// Turns a laptop's hardware into an OpenCore build plan: config.plist section, SMBIOS,
// iGPU properties, SSDTs, kexts and caveats.
//
// The rules follow Dortania's OpenCore Install Guide (laptop config pages, "Gathering
// files", Getting Started With ACPI, and the Ventura/Tahoe notes). Where the laptop data
// can't pin a part down (an "8th gen" CPU, an unlisted Wi-Fi card), detectOptions()
// returns several candidates and the reader picks theirs.
import { MACOS_VERSIONS } from '../data/laptops.js';
import { ALC_LAYOUTS } from '../data/appleAlcLayouts.js';

const v = name => MACOS_VERSIONS.indexOf(name);
const DORTANIA_LAPTOP = 'https://dortania.github.io/OpenCore-Install-Guide/config-laptop.plist';

const DVMT_PATCH = [
    ['framebuffer-patch-enable', 'Data', '01000000'],
    ['framebuffer-stolenmem', 'Data', '00003001'],
    ['framebuffer-fbmem', 'Data', '00009000']
];

// One entry per Dortania laptop platform. `smbios(target, cls)` picks the model for the
// chosen macOS version and CPU class (U, H or Y).
export const PLATFORMS = {
    broadwell: {
        label: 'Broadwell (5th gen)',
        config: 'broadwell',
        min: 'Yosemite', max: 'Monterey',
        ssdts: ['SSDT-PLUG', 'SSDT-EC', 'SSDT-PNLF', 'IRQ SSDT'],
        igpu: () => ({ platformId: '06002616', dvmtNote: 'Set DVMT pre-allocated to 96MB if your BIOS allows it.' }),
        smbios: () => ['MacBookAir7,2', 'Closest match for 15W dual-core Broadwell. Supported up to Monterey.']
    },
    skylake: {
        label: 'Skylake (6th gen)',
        config: 'skylake',
        min: 'El Capitan', max: 'Ventura',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF'],
        igpu: (target, cls, gpu) => {
            const h = cls === 'H';
            if (v(target) >= v('Ventura')) {
                // Ventura dropped Skylake graphics; WhateverGreen can present it as the closest Kaby Lake GPU.
                return {
                    platformId: '00001B59',
                    deviceId: h ? '1B590000' : '16590000',
                    note: `Ventura dropped Skylake graphics, so these values present your ${gpu || 'iGPU'} as the closest Kaby Lake model (${h ? 'HD 630' : 'HD 620'}). If the same EFI also boots Monterey or older, add -igfxsklaskbl to boot-args.`
                };
            }
            return {
                platformId: '00001619',
                deviceId: /p530/i.test(gpu) ? '16190000' : undefined,
                altPlatformIds: ['00001E19'],
                note: 'Recommended value for HD 520/530/540/550 and P530.'
            };
        },
        smbios: (target, cls) => v(target) >= v('Ventura')
            ? ['MacBookPro14,1', 'Ventura dropped every Skylake SMBIOS. Dortania recommends MacBookPro14,1 for unsupported laptops.']
            : cls === 'H'
                ? ['MacBookPro13,3', 'Quad-core 45W Skylake. Supported up to Monterey.']
                : ['MacBookPro13,1', 'Dual-core 15W Skylake. Supported up to Monterey.']
    },
    kaby: {
        label: 'Kaby Lake (7th gen)',
        config: 'kaby-lake',
        min: 'Sierra', max: 'Sequoia',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF'],
        igpu: () => ({ platformId: '00001B59', altPlatformIds: ['00001659'], note: 'Recommended for HD 615/620/630/640/650.' }),
        smbios: kabySmbios
    },
    kabyR: {
        label: 'Kaby Lake R (8th gen U)',
        config: 'kaby-lake',
        min: 'High Sierra', max: 'Sequoia',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF'],
        igpu: () => ({ platformId: '0000C087', deviceId: '16590000', altPlatformIds: ['00001B59'], note: 'Kaby Lake R\'s UHD 620 needs both values.' }),
        smbios: kabySmbios
    },
    amber: {
        label: 'Amber Lake (8th gen Y)',
        config: 'kaby-lake',
        min: 'Mojave', max: 'Sonoma',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF'],
        igpu: () => ({ platformId: '0000C087', note: 'Recommended for Amber Lake\'s UHD 617.' }),
        smbios: () => ['MacBookAir8,1', 'Amber Lake Y. Supported up to Sonoma.']
    },
    coffee: {
        label: 'Coffee Lake / Whiskey Lake (8th gen)',
        config: 'coffee-lake',
        min: 'High Sierra', max: 'Tahoe',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF', 'SSDT-AWAC'],
        igpu: (target, cls, gpu) => cls === 'H'
            ? /p630/i.test(gpu)
                ? { platformId: '0900A53E', deviceId: '9B3E0000', note: 'The Xeon\'s UHD P630 isn\'t device-id 0x3E9B, so it needs this spoof.' }
                : { platformId: '0900A53E', note: 'Recommended for UHD 630. If your iGPU\'s device-id isn\'t 0x3E9B, also add device-id 9B3E0000.' }
            : { platformId: '00009B3E', deviceId: '9B3E0000', note: 'A UHD 620 on Coffee Lake or Whiskey Lake requires this device-id.' },
        smbios: (target, cls) => cls === 'H'
            ? (v(target) >= v('Tahoe')
                ? ['MacBookPro16,1', 'Tahoe only supports the 2019 16" and 2020 13" four-port MacBook Pros; MacBookPro16,1 is the 45W model.']
                : ['MacBookPro15,1', 'Hexa-core 45W Coffee Lake (the model Dortania uses). Supported through Sequoia.'])
            : ['MacBookPro15,2', 'Quad-core 15W Coffee Lake / Whiskey Lake. Supported through Sequoia.'],
        maxFor: cls => (cls === 'H' ? 'Tahoe' : 'Sequoia')
    },
    coffeePlus: {
        label: 'Coffee Lake Refresh (9th gen H)',
        config: 'coffee-lake-plus',
        min: 'High Sierra', max: 'Tahoe',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF', 'SSDT-AWAC', 'SSDT-PMC'],
        igpu: () => ({ platformId: '0900A53E', note: 'Recommended for UHD 630.' }),
        smbios: () => ['MacBookPro16,1', 'Hexa/octa-core 45W. Supported through Tahoe.']
    },
    comet: {
        label: 'Comet Lake (10th gen)',
        config: 'coffee-lake-plus',
        min: 'Catalina', max: 'Tahoe',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF', 'SSDT-AWAC'],
        igpu: (target, cls) => cls === 'H'
            ? { platformId: '0900A53E', deviceId: '9B3E0000', note: 'Comet Lake H\'s UHD 630 isn\'t device-id 0x3E9B, so it needs this spoof.' }
            : { platformId: '00009B3E', deviceId: '9B3E0000', note: 'A UHD 620 on Comet Lake requires this device-id.' },
        smbios: (target, cls) => cls === 'H'
            ? ['MacBookPro16,1', 'Hexa/octa-core 45W. Supported through Tahoe.']
            : ['MacBookPro16,3', 'Quad-core 15W. Supported through Sequoia.'],
        maxFor: cls => (cls === 'H' ? 'Tahoe' : 'Sequoia')
    },
    ice: {
        label: 'Ice Lake (10th gen G-series)',
        config: 'icelake',
        min: 'Catalina', max: 'Tahoe',
        ssdts: ['SSDT-PLUG', 'SSDT-EC-USBX', 'SSDT-PNLF', 'SSDT-AWAC', 'SSDT-RHUB'],
        igpu: () => ({
            platformId: '0000528A',
            note: 'Recommended for Iris Plus G4/G7. Ice Lake needs 256MB DVMT; if your BIOS is stuck at 32MB, add the patch below (with framebuffer-patch-enable as a Number set to 1).',
            dvmtNote: 'Set DVMT pre-allocated to 256MB if your BIOS allows it.'
        }),
        smbios: target => v(target) >= v('Tahoe')
            ? ['MacBookPro16,2', 'Tahoe dropped MacBookAir9,1; MacBookPro16,2 (13" 2020, four ports) is the Ice Lake model it still supports.']
            : ['MacBookAir9,1', 'The model Dortania uses for Ice Lake. Supported through Sequoia.']
    }
};

function kabySmbios(target, cls) {
    if (v(target) <= v('Ventura')) {
        return cls === 'H'
            ? ['MacBookPro14,3', 'Quad-core 45W Kaby Lake. Supported up to Ventura.']
            : ['MacBookPro14,1', 'The model Dortania uses for Kaby Lake laptops. Supported up to Ventura.'];
    }
    return cls === 'H'
        ? ['MacBookPro15,1', 'MacBookPro14,x stops at Ventura, so newer macOS needs a 2018 model. This is common community practice rather than a Dortania recommendation.']
        : ['MacBookPro15,2', 'MacBookPro14,x stops at Ventura, so newer macOS needs a 2018 model. This is common community practice rather than a Dortania recommendation.'];
}

export function platformMax(key, cls) {
    const p = PLATFORMS[key];
    return p.maxFor ? p.maxFor(cls) : p.max;
}

// ---------------------------------------------------------------------------
// Detecting hardware from the laptop's free-text specs

const CPU_LABELS = {
    broadwell: 'Broadwell, 5th gen (e.g. i5-5200U)',
    skylakeU: 'Skylake U, 6th gen (e.g. i5-6200U)',
    skylakeH: 'Skylake H or Xeon E3 v5 (e.g. i7-6700HQ)',
    kabyU: 'Kaby Lake U, 7th gen (e.g. i5-7200U)',
    kabyH: 'Kaby Lake H, 7th gen (e.g. i7-7700HQ)',
    kabyR: 'Kaby Lake R, 8th gen U ending in 50U (e.g. i5-8250U)',
    amber: 'Amber Lake Y, 8th gen (e.g. i5-8200Y)',
    whiskey: 'Whiskey Lake, 8th gen U ending in 65U (e.g. i5-8265U)',
    coffeeU: 'Coffee Lake U, 8th gen ending in 59U/79U (e.g. i5-8259U)',
    coffeeH: 'Coffee Lake H, 8th gen (e.g. i7-8750H)',
    xeonE2: 'Xeon E-2100M, Coffee Lake (e.g. E-2176M)',
    coffeePlus: 'Coffee Lake Refresh H, 9th gen (e.g. i7-9750H)',
    cometU: 'Comet Lake U, 10th gen (e.g. i5-10210U)',
    cometH: 'Comet Lake H, 10th gen (e.g. i7-10750H)',
    ice: 'Ice Lake, 10th gen G-series (e.g. i5-1035G4)'
};

// CPU option -> [platform key, CPU class, iGPU name]
const CPU_PLATFORM = {
    broadwell: ['broadwell', 'U', 'HD 5500'],
    skylakeU: ['skylake', 'U', 'HD 520'],
    skylakeH: ['skylake', 'H', 'HD 530'],
    kabyU: ['kaby', 'U', 'HD 620'],
    kabyH: ['kaby', 'H', 'HD 630'],
    kabyR: ['kabyR', 'U', 'UHD 620'],
    amber: ['amber', 'Y', 'UHD 617'],
    whiskey: ['coffee', 'U', 'UHD 620'],
    coffeeU: ['coffee', 'U', 'Iris Plus 655'],
    coffeeH: ['coffee', 'H', 'UHD 630'],
    xeonE2: ['coffee', 'H', 'UHD P630'],
    coffeePlus: ['coffeePlus', 'H', 'UHD 630'],
    cometU: ['comet', 'U', 'UHD'],
    cometH: ['comet', 'H', 'UHD 630'],
    ice: ['ice', 'U', 'Iris Plus G4/G7']
};

function cpuOptions(laptop) {
    const cpu = String(laptop.details.cpu).toLowerCase();
    const gpu = String(laptop.details.igpu).toLowerCase();

    if (/e-2\d{3}m/.test(cpu)) return ['xeonE2'];
    if (/xeon e3/.test(cpu)) return ['skylakeH', 'kabyH'];

    const m = cpu.match(/i[3579]-(\d{4,5})([a-z]+\d?)/);
    if (m) {
        const [, num, suffix] = m;
        const gen = num.length === 5 ? Number(num.slice(0, 2)) : Number(num[0]);
        const h = /h/.test(suffix);
        if (/^g\d/.test(suffix)) return ['ice'];
        if (gen === 5) return ['broadwell'];
        if (gen === 6) return [h ? 'skylakeH' : 'skylakeU'];
        if (gen === 7) return [h ? 'kabyH' : 'kabyU'];
        if (gen === 8) {
            if (h) return ['coffeeH'];
            if (/y/.test(suffix)) return ['amber'];
            if (/65$/.test(num)) return ['whiskey'];
            if (/(59|79)$/.test(num)) return ['coffeeU'];
            return ['kabyR'];
        }
        if (gen === 9) return ['coffeePlus'];
        if (gen === 10) return [h ? 'cometH' : 'cometU'];
    }

    // Free text such as "Intel Core i5/i7 8th Gen".
    const h = /i9|xeon|\bh\b|hq/.test(cpu) || /uhd 630/.test(gpu);
    if (/kaby lake r/.test(cpu) && /7th gen/.test(cpu)) return ['kabyR', 'kabyU'];
    if (/kaby lake r/.test(cpu)) return ['kabyR'];
    if (/whiskey/.test(cpu)) return ['whiskey'];
    if (/8th\/9th gen/.test(cpu)) return ['coffeeH', 'coffeePlus'];
    if (/8th gen/.test(cpu)) return h ? ['coffeeH'] : ['kabyR', 'whiskey'];
    if (/7th gen/.test(cpu)) return [h ? 'kabyH' : 'kabyU'];
    if (/10th gen/.test(cpu)) {
        if (/iris plus|g[47]/.test(gpu) && !/uhd/.test(gpu)) return ['ice'];
        if (/comet|uhd graphics/.test(gpu)) return [h ? 'cometH' : 'cometU'];
        return h ? ['cometH'] : ['ice', 'cometU'];
    }
    return Object.keys(CPU_LABELS);
}

const WIFI_LABELS = {
    intel: 'Intel Wi-Fi card',
    broadcom: 'Broadcom card (e.g. DW1560, DW1820A, DW1830, BCM94360)',
    none: 'No Wi-Fi in macOS (Ethernet or a USB adapter)'
};

function wifiInfo(laptop) {
    const raw = laptop.details.wifiBluetooth;
    const w = String(raw || '').toLowerCase();
    const intel = /intel|ax1650|ax1690|ac ?9560|ac ?8265/.test(w);
    const broadcom = /broadcom|dw1[5-8]|bcm/.test(w);
    const unsupported = /qualcomm|atheros|qca|killer 1535|realtek|mediatek|lite-on/.test(w);
    return {
        raw,
        known: Boolean(raw),
        intel, broadcom, unsupported,
        cnvi: /cnvi/.test(w),
        // Default choice: what's in the laptop, or Intel/Broadcom swap guidance.
        default: intel ? 'intel' : broadcom ? 'broadcom' : unsupported ? 'broadcom' : 'intel'
    };
}

const TRACKPAD_LABELS = {
    ps2: 'PS/2 trackpad',
    i2cHid: 'I2C HID trackpad (most precision touchpads, ELAN1200+)',
    i2cAlps: 'ALPS I2C trackpad',
    smbusSynaptics: 'Synaptics over SMBus/RMI (most ThinkPads)',
    smbusElan: 'ELAN over SMBus'
};

function trackpadOptions(laptop) {
    const t = String(laptop.details.trackpad || '').toLowerCase();
    if (!t) return Object.keys(TRACKPAD_LABELS);
    if (/alps/.test(t) && /i2c/.test(t)) return ['i2cAlps', 'i2cHid'];
    if (/i2c/.test(t) && /ps\/?2/.test(t)) return ['i2cHid', 'ps2'];
    if (/elan/.test(t) && /i2c/.test(t)) return ['i2cHid'];
    if (/i2c|precision/.test(t)) return ['i2cHid'];
    if (/smbus|rmi/.test(t)) return ['smbusSynaptics', 'ps2'];
    if (/ps\/?2/.test(t)) return ['ps2', 'smbusSynaptics'];
    if (/synaptics/.test(t)) return ['ps2', 'smbusSynaptics', 'i2cHid'];
    return Object.keys(TRACKPAD_LABELS);
}

const ETHERNET_LABELS = {
    none: 'No Ethernet port',
    intel: 'Intel (I217, I218, I219…)',
    realtek: 'Realtek, or Killer E2500',
    atheros: 'Atheros / Killer (not E2500)'
};

function ethernetOptions(laptop) {
    const net = String(laptop.details.ports?.network || '').toLowerCase();
    const wifi = String(laptop.details.wifiBluetooth || '').toLowerCase();
    if (/e2500/.test(wifi + net)) return ['realtek'];
    if (!net || /^none/.test(net)) return ['none', 'intel', 'realtek', 'atheros'];
    return ['intel', 'realtek', 'atheros', 'none'];
}

// Codec in the laptop data -> AppleALC layout-ids, trying every ALC/CX name mentioned.
// Layout-ids a model's guide reports as working (e.g. "layout-id 30 or 99") come first.
export function audioInfo(laptop) {
    const raw = laptop.details.audioCodec;
    const names = String(raw || '').toUpperCase().match(/\b(?:ALC|CX)\s?\d{3,4}[A-Z]?\b/g) || [];
    const known = (String(raw || '').match(/layout-id[s]?\s*([\d\s,or/]+)/i)?.[1].match(/\d+/g) || []).map(Number);
    for (const name of names) {
        const hit = ALC_LAYOUTS[name.replace(/\s/g, '')];
        if (hit) {
            const preferred = known.filter(n => hit.layouts.includes(n));
            return { raw, codec: hit.codec, layouts: [...preferred, ...hit.layouts.filter(n => !preferred.includes(n))], known: preferred };
        }
    }
    return { raw, codec: null, layouts: [], known: [] };
}

// Everything the reader may need to choose, with the best default first.
export function detectOptions(laptop) {
    const cpus = cpuOptions(laptop);
    const trackpads = trackpadOptions(laptop);
    const ethernets = ethernetOptions(laptop);
    const wifi = wifiInfo(laptop);
    return {
        cpu: { options: cpus.map(k => [k, CPU_LABELS[k]]), default: cpus[0], certain: cpus.length === 1 },
        wifi: { options: Object.entries(WIFI_LABELS), default: wifi.default, info: wifi },
        trackpad: { options: trackpads.map(k => [k, TRACKPAD_LABELS[k]]), default: trackpads[0], certain: trackpads.length === 1 && Boolean(laptop.details.trackpad) },
        ethernet: { options: ethernets.map(k => [k, ETHERNET_LABELS[k]]), default: ethernets[0], certain: ethernets.length === 1 }
    };
}

// macOS versions this laptop can target on the chosen platform.
export function targetVersions(laptop, cpu) {
    const [key, cls] = CPU_PLATFORM[cpu];
    const p = PLATFORMS[key];
    const minIdx = Math.max(v(p.min), Math.max(0, MACOS_VERSIONS.findIndex(x => String(laptop.details.minMacosSupport).startsWith(x))));
    const maxIdx = v(platformMax(key, cls));
    return MACOS_VERSIONS.slice(Math.min(minIdx, maxIdx), maxIdx + 1);
}

export function defaultTarget(laptop, cpu) {
    const versions = targetVersions(laptop, cpu);
    const listed = MACOS_VERSIONS.findIndex(x => String(laptop.details.maxMacosSupport).startsWith(x));
    // Prefer the newest version the laptop is listed for, but never Tahoe by default
    // (it removed AppleHDA, so built-in analog audio stops working).
    const preferred = versions.filter(x => v(x) <= listed && x !== 'Tahoe');
    return preferred[preferred.length - 1] || versions.filter(x => x !== 'Tahoe').pop() || versions[versions.length - 1];
}

// ---------------------------------------------------------------------------
// Building the plan

function kext(name, group, extra = {}) {
    return { name, group, ...extra };
}

export function buildPlan(laptop, choices) {
    const { cpu, target, wifi, trackpad, ethernet } = choices;
    const [platformKey, cls, gpuName] = CPU_PLATFORM[cpu];
    const platform = PLATFORMS[platformKey];
    const t = v(target);
    const d = laptop.details;
    const isDell = laptop.brand === 'Dell';
    const hasDgpu = Boolean(d.dgpu) && !/^none/i.test(d.dgpu);
    const hasI2c = trackpad === 'i2cHid' || trackpad === 'i2cAlps';
    const audio = audioInfo(laptop);
    const wifiDetails = wifiInfo(laptop);
    const warnings = [];
    const checks = [];

    // SMBIOS and iGPU
    const [smbios, smbiosNote] = platform.smbios(target, cls);
    const igpu = platform.igpu(target, cls, gpuName);
    const igpuProps = [['AAPL,ig-platform-id', 'Data', igpu.platformId]];
    if (igpu.deviceId) igpuProps.push(['device-id', 'Data', igpu.deviceId]);
    const dvmtProps = platformKey === 'ice'
        ? [['framebuffer-patch-enable', 'Number', '1'], ...DVMT_PATCH.slice(1)]
        : DVMT_PATCH;

    // SSDTs
    const ssdts = [...platform.ssdts];
    if (hasI2c) ssdts.splice(ssdts.indexOf('SSDT-PNLF') + 1, 0, 'SSDT-GPI0');
    if (hasDgpu) ssdts.push('SSDT-dGPU-Off');

    // Kexts
    const kexts = [
        kext('Lilu', 'Core', { required: true }),
        kext('VirtualSMC', 'Core', { required: true }),
        kext('SMCBatteryManager', 'Core', { required: true }),
        kext('SMCProcessor', 'Core'),
        kext('WhateverGreen', 'Graphics', { required: true })
    ];
    if (isDell) kexts.push(kext('SMCDellSensors', 'Core', { when: 'Optional: only on Dell models that support SMM fan control.' }));

    if (t < v('Tahoe')) {
        kexts.push(kext('AppleALC', 'Audio', {
            required: true,
            when: audio.layouts.length
                ? `Your codec (${audio.codec}) supports layout-ids ${audio.layouts.join(', ')}.${audio.known.length ? ` Start with ${audio.known.join(' or ')}, which this model's guide reports as working.` : ' Try them in order.'}`
                : 'Find your codec\'s layout-ids on the AppleALC supported codecs list.'
        }));
    }

    kexts.push(kext('VoodooPS2Controller', 'Input', { required: true }));
    if (trackpad === 'i2cHid') kexts.push(kext('VoodooI2C', 'Input', { required: true }), kext('VoodooI2CHID', 'Input', { required: true }));
    if (trackpad === 'i2cAlps') kexts.push(kext('VoodooI2C', 'Input', { required: true }), kext('AlpsHID', 'Input', { required: true }));
    if (trackpad === 'smbusSynaptics') kexts.push(kext('VoodooRMI', 'Input', { required: true }));
    if (trackpad === 'smbusElan') kexts.push(kext('VoodooSMBus', 'Input', { required: true }));

    kexts.push(
        kext('ECEnabler', 'Power & keys', { required: true }),
        kext('BrightnessKeys', 'Power & keys', { required: true })
    );

    const storage = String(d.storage || '').toLowerCase();
    kexts.push(kext('NVMeFix', 'Storage', storage.includes('nvme')
        ? { required: true }
        : { when: 'Only if your SSD is NVMe (most M.2 drives).' }));

    if (wifi === 'intel') {
        kexts.push(kext('AirportItlwm', 'Wi-Fi & Bluetooth', {
            required: true,
            when: `Download the build for macOS ${target}. If there isn't one, use itlwm + HeliPort instead.`
        }));
        kexts.push(kext('itlwm', 'Wi-Fi & Bluetooth', { when: 'Alternative to AirportItlwm: use one or the other, never both.' }));
        kexts.push(kext('IntelBluetoothFirmware', 'Wi-Fi & Bluetooth', { required: true }));
        kexts.push(kext('IntelBTPatcher', 'Wi-Fi & Bluetooth', { required: true }));
        if (t <= v('Big Sur')) kexts.push(kext('IntelBluetoothInjector', 'Wi-Fi & Bluetooth', { required: true }));
        if (t >= v('Monterey')) kexts.push(kext('BlueToolFixup', 'Wi-Fi & Bluetooth', { required: true }));
    }
    if (wifi === 'broadcom') {
        if (t >= v('Sequoia')) {
            kexts.push(kext('AppleBCMWLANCompanion', 'Wi-Fi & Bluetooth', { when: 'Brings Broadcom Wi-Fi back on macOS 15 and 26 without root patches. Not fully stable yet, and needs VT-d enabled. The alternative is OpenCore Legacy Patcher root patches.' }));
        } else {
            kexts.push(kext('AirportBrcmFixup', 'Wi-Fi & Bluetooth', {
                required: true,
                when: t >= v('Sonoma') ? 'Sonoma removed the Broadcom Wi-Fi drivers, so you also need OpenCore Legacy Patcher root patches.' : undefined
            }));
        }
        if (t <= v('Big Sur')) kexts.push(kext('BrcmBluetoothInjector', 'Wi-Fi & Bluetooth', { required: true }));
        kexts.push(kext('BrcmFirmwareData', 'Wi-Fi & Bluetooth', { required: true }));
        kexts.push(kext(t >= v('Catalina') ? 'BrcmPatchRAM3' : 'BrcmPatchRAM2', 'Wi-Fi & Bluetooth', { required: true }));
        if (t >= v('Monterey')) kexts.push(kext('BlueToolFixup', 'Wi-Fi & Bluetooth', { required: true }));
    }

    if (ethernet === 'intel') kexts.push(kext('IntelMausi', 'Ethernet', { required: true }));
    if (ethernet === 'realtek') kexts.push(kext('RealtekRTL8111', 'Ethernet', { required: true }));
    if (ethernet === 'atheros') kexts.push(kext('AtherosE2200Ethernet', 'Ethernet', { required: true }));

    const others = [d.ports?.others].flat().join(' ').toLowerCase();
    if (/\bsd\b|microsd|card reader/.test(others)) {
        kexts.push(kext('RealtekCardReader', 'Extras', { when: 'Only if your SD reader is a Realtek PCIe/USB reader. Many USB readers work without a kext.' }));
        kexts.push(kext('RealtekCardReaderFriend', 'Extras', { when: 'Only with RealtekCardReader.' }));
    }
    if (t >= v('Sonoma')) {
        kexts.push(kext('RestrictEvents', 'Extras', { when: 'For over-the-air updates on macOS 14.4+, with boot-arg revpatch=sbvmm. Dortania notes this also needs SecureBootModel set to Disabled, which conflicts with AirportItlwm; see the Tahoe page for the iBridged alternative.' }));
    }

    kexts.push(
        kext('USBToolBox', 'USB (after mapping)', { required: true, when: 'Add once you\'ve mapped your ports.' }),
        kext('UTBMap', 'USB (after mapping)', { required: true, when: 'Generated by the USBToolBox tool for your laptop.' })
    );

    // Boot arguments
    const bootArgs = [['-v keepsyms=1 debug=0x100', 'Verbose boot while setting up. Remove once everything works.']];
    if (t < v('Tahoe') && audio.layouts.length) bootArgs.push([`alcid=${audio.layouts[0]}`, 'Quick way to test a layout-id without editing DeviceProperties. Make the working one permanent as layout-id.']);
    if (wifi === 'intel' && t >= v('Tahoe')) bootArgs.push(['-ibtcompatbeta', 'Required for Intel Bluetooth on macOS 26 Tahoe.']);
    if (hasDgpu) bootArgs.push(['-wegnoegpu', 'Quick alternative to SSDT-dGPU-Off: hides the dGPU but leaves it powered on.']);
    if (t >= v('Sonoma')) bootArgs.push(['revpatch=sbvmm', 'With RestrictEvents, enables over-the-air updates on macOS 14.4+.']);

    // BIOS
    const bios = [
        'Disable Secure Boot, Fast Boot, CSM, Intel SGX and Intel Platform Trust.',
        `${t >= v('Sequoia') && wifi === 'broadcom' ? 'Enable VT-d (AppleBCMWLANCompanion needs it)' : 'Disable VT-d, or enable DisableIoMapper in the config'}.`,
        'Enable VT-x, Hyper-Threading, Execute Disable Bit and XHCI hand-off. Set SATA to AHCI.',
        igpu.dvmtNote || 'Set DVMT pre-allocated to 64MB if your BIOS allows it.',
        'Disable CFG Lock if possible. Otherwise enable Kernel > Quirks > AppleXcpmCfgLock.'
    ];
    if (d.biosVersion?.notes) bios.push(`Model note: ${d.biosVersion.notes}.`);
    if (hasDgpu) bios.push('If the BIOS has a graphics mode or MUX switch, set it to Hybrid/Optimus (or iGPU only), never dGPU only.');

    // Things to check or know before starting
    if (!choices.cpuCertain) checks.push('Check your exact CPU model (Settings > About in Windows, or lscpu in Linux) and pick it above. The config section and graphics values depend on it.');
    if (!wifiDetails.known) checks.push('Find out which Wi-Fi card your unit has (Device Manager, or lspci in Linux) and pick it above.');
    if (!choices.trackpadCertain) checks.push('Check how your trackpad connects (Device Manager or dmesg in Linux) and pick it above. Most laptop keyboards are PS/2 either way.');
    if (!choices.ethernetCertain && ethernet !== 'none') checks.push('Check which Ethernet chip you have and pick it above.');
    if (!audio.codec) checks.push(audio.raw
        ? `Your codec is listed as "${audio.raw}". Look up its layout-ids on the AppleALC supported codecs list.`
        : 'Find your audio codec (e.g. ALC256) in Linux with cat /proc/asound/card0/codec#0, then look up its layout-ids.');

    if (wifiDetails.unsupported && !wifiDetails.intel) {
        warnings.push(`The stock Wi-Fi (${wifiDetails.raw}) doesn't work in macOS. Replace it with a supported Intel or Broadcom M.2 card${wifiDetails.cnvi ? '' : ', if it isn\'t soldered'}.`);
    } else if (wifiDetails.unsupported && wifiDetails.intel) {
        warnings.push(`Some units ship with an unsupported card (${wifiDetails.raw}). Check yours; only the Intel version works.`);
    }
    if (wifiDetails.cnvi && wifi === 'broadcom') warnings.push('This laptop\'s CNVi Intel Wi-Fi slot can\'t take a Broadcom card. Use the Intel option.');
    if (hasDgpu) warnings.push(`The ${d.dgpu.replace(/\s*\(must be disabled\)/i, '')} can't be used by macOS and must be disabled. Before buying, make sure the internal display is wired to the Intel iGPU (Optimus); on some gaming laptops it's wired to the dGPU only, and macOS can't drive it.`);
    if (t >= v('Tahoe')) warnings.push('macOS 26 Tahoe removed AppleHDA, so AppleALC can\'t drive the speakers or headphone jack. Analog audio needs VoodooHDA with SIP partly disabled. Sequoia is the better target if you need sound.');
    if (platformKey === 'skylake' && t >= v('Ventura')) warnings.push('Ventura dropped Skylake graphics. This plan presents your iGPU as Kaby Lake, which Dortania documents but some features may misbehave. Monterey is the last fully supported version.');
    if (platformKey === 'ice' && /1035g1|uhd/.test(String(d.cpu + d.igpu).toLowerCase())) warnings.push('Dortania only lists Ice Lake\'s Iris Plus G4/G7 as supported. G1 models (UHD graphics) may not get acceleration.');
    const listedMax = MACOS_VERSIONS.findIndex(x => String(d.maxMacosSupport).startsWith(x));
    if (listedMax > v(platformMax(platformKey, cls))) warnings.push(`This laptop is listed as running ${d.maxMacosSupport}, but Dortania's support for this platform ends at ${platformMax(platformKey, cls)}. Newer versions need OpenCore Legacy Patcher, which Dortania doesn't support on Hackintoshes.`);
    if (isDell) warnings.push('Some Dell laptops need PlatformInfo > UpdateSMBIOSMode set to Custom, with the CustomSMBIOSGuid quirk enabled.');
    if (laptop.source === 'community') warnings.push('This laptop\'s specs come from a community list. Treat the hardware details as a typical configuration and confirm them for your unit.');

    return {
        platform: { key: platformKey, ...platform, cls, gpuName, configUrl: `${DORTANIA_LAPTOP}/${platform.config}.html` },
        target,
        smbios: { model: smbios, note: smbiosNote },
        igpu: { props: igpuProps, dvmtProps, note: igpu.note, altPlatformIds: igpu.altPlatformIds || [] },
        ssdts,
        kexts,
        bootArgs,
        bios,
        audio,
        checks,
        warnings
    };
}

export { CPU_PLATFORM };
