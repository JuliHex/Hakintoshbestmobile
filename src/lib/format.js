import { LaptopDB, MACOS_VERSIONS } from '../data/laptops.js';

export function scoreClass(score) {
    if (score >= 9) return 'score-excellent';
    if (score >= 8) return 'score-good';
    if (score >= 7) return 'score-average';
    return 'score-poor';
}

export function macosClass(text) {
    const index = LaptopDB.macosIndex(text);
    return index < 0 ? '' : 'macos-' + MACOS_VERSIONS[index].toLowerCase().replace(/\s+/g, '-');
}

// Major brands get hand-picked hues so they stay distinct; the rest are hashed.
const BRAND_HUES = { Lenovo: 352, Dell: 212, HP: 192, ASUS: 255, Acer: 145, MSI: 18, Huawei: 325, Xiaomi: 32, Samsung: 232, LG: 295, Razer: 115, Microsoft: 172, Gigabyte: 48, Toshiba: 275 };

export function brandHue(brand) {
    if (brand in BRAND_HUES) return BRAND_HUES[brand];
    let h = 0;
    for (const c of String(brand)) h = (h * 31 + c.charCodeAt(0)) % 360;
    return (h + 200) % 360;
}

export const laptopPath = id => `/laptop/${encodeURIComponent(id)}`;
