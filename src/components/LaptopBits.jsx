// Small building blocks shared by laptop cards, the detail page and the comparison page.
import { LaptopDB, PRIORITY_LABELS } from '../data/laptops.js';
import { Icon } from '../lib/icons.jsx';
import { brandHue, macosClass, scoreClass } from '../lib/format.js';
import { compareList, favoriteList, useList } from '../lib/stores.js';
import { useToast } from './Toast.jsx';

export function ScoreBar({ score }) {
    return (
        <div className="flex items-center gap-3">
            <div className="score-track" role="img" aria-label={`Score ${score.toFixed(1)} out of 10`}>
                <div className={`score-fill ${scoreClass(score)}`} style={{ width: `${score * 10}%` }} />
            </div>
            <span className="text-sm font-semibold tabular-nums">{score.toFixed(1)}</span>
        </div>
    );
}

export function PriorityTags({ laptop }) {
    return laptop.priority.map(p => <span key={p} className="tag">{PRIORITY_LABELS[p] || p}</span>);
}

export function Unverified({ laptop, path }) {
    if (!LaptopDB.isUnverified(laptop, path)) return null;
    return <span className="badge-unverified" title="Not yet confirmed against a real build">Unverified</span>;
}

export function MacosRange({ laptop }) {
    return <>{laptop.details.minMacosSupport} – {laptop.details.maxMacosSupport}</>;
}

export function MacosChip({ label, value }) {
    if (!value) return null;
    return (
        <span className="spec-chip">
            <span className="text-gray-600 dark:text-gray-300">{label}</span>
            <span className={`spec-chip-value ${macosClass(value)}`}>{value}</span>
        </span>
    );
}

// Generated artwork for a laptop: brand-coloured gradient, outline icon, and model name.
export function DeviceTile({ laptop, large = false }) {
    const model = laptop.name.startsWith(laptop.brand) ? laptop.name.slice(laptop.brand.length).trim() : laptop.name;
    return (
        <div className={`device-tile ${large ? 'aspect-[16/10] md:aspect-auto md:h-full' : 'aspect-[16/9]'}`}
             style={{ '--h': brandHue(laptop.brand) }} aria-hidden="true">
            <Icon name="laptop" className={large ? 'w-16 h-16 opacity-90' : 'w-10 h-10 opacity-90'} />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] opacity-80">{laptop.brand}</span>
            <span className={`${large ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold leading-tight drop-shadow-sm`}>{model || laptop.name}</span>
        </div>
    );
}

export function FavoriteButton({ id, className = '' }) {
    const favorites = useList(favoriteList);
    const toast = useToast();
    const on = favorites.includes(id);
    return (
        <button type="button" aria-pressed={on} aria-label={on ? 'Remove from favorites' : 'Add to favorites'}
                className={`icon-btn glass !w-9 !h-9 ${on ? 'text-pink-500' : 'text-gray-700 dark:text-gray-200'} ${className}`}
                onClick={() => {
                    favoriteList.toggle(id);
                    toast(on ? 'Removed from favorites' : 'Added to favorites');
                }}>
            <Icon name="heart" className="w-4 h-4" filled={on} />
        </button>
    );
}

export function CompareButton({ id, labels = ['Compare', 'Comparing'] }) {
    const compared = useList(compareList);
    const toast = useToast();
    const on = compared.includes(id);
    return (
        <button type="button" className="chip" aria-pressed={on}
                onClick={() => {
                    if (!compareList.toggle(id)) {
                        toast(`You can compare up to ${compareList.max} laptops`);
                        return;
                    }
                    toast(on ? 'Removed from comparison' : 'Added to comparison');
                }}>
            <Icon name={on ? 'check' : 'plus'} /> {on ? labels[1] : labels[0]}
        </button>
    );
}

const DIFFICULTY_STYLE = {
    Beginner: 'bg-emerald-500/15 text-emerald-800 ring-emerald-500/25 dark:text-emerald-200',
    Intermediate: 'bg-amber-400/20 text-amber-900 ring-amber-500/30 dark:text-amber-200',
    Advanced: 'bg-rose-500/15 text-rose-800 ring-rose-500/25 dark:text-rose-200'
};

export function DifficultyBadge({ level }) {
    return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${DIFFICULTY_STYLE[level]}`}>{level}</span>;
}
