import { Link } from 'react-router';
import { laptopPath } from '../lib/format.js';
import { CompareButton, DeviceTile, FavoriteButton, MacosRange, PriorityTags, ScoreBar, Unverified } from './LaptopBits.jsx';

export default function LaptopCard({ laptop, compare = true }) {
    const href = laptopPath(laptop.id);
    const d = laptop.details;
    return (
        <article className="card overflow-hidden flex flex-col animate-in">
            <div className="relative">
                <Link to={href} className="block hover:opacity-95 transition-opacity" tabIndex={-1}><DeviceTile laptop={laptop} /></Link>
                <FavoriteButton id={laptop.id} className="absolute top-3 right-3" />
            </div>
            <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                <div>
                    <h3 className="text-lg font-bold leading-snug">
                        <Link to={href} className="hover:text-blue-600 dark:hover:text-blue-300">{laptop.name}</Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{laptop.summary}</p>
                </div>
                <ScoreBar score={laptop.score} />
                <dl className="text-sm grid grid-cols-[auto,1fr] gap-x-3 gap-y-1">
                    <dt className="text-gray-500 dark:text-gray-400">CPU</dt><dd className="truncate" title={d.cpu}>{d.cpu}</dd>
                    <dt className="text-gray-500 dark:text-gray-400">GPU</dt><dd className="truncate">{d.igpu}</dd>
                    <dt className="text-gray-500 dark:text-gray-400">macOS</dt><dd><MacosRange laptop={laptop} /><Unverified laptop={laptop} path="details.maxMacosSupport" /></dd>
                </dl>
                <div className="flex flex-wrap gap-1.5"><PriorityTags laptop={laptop} /></div>
                <div className="mt-auto pt-2 flex items-center gap-2">
                    <Link to={href} className="btn-primary flex-1">Details</Link>
                    {compare && <CompareButton id={laptop.id} />}
                </div>
            </div>
        </article>
    );
}
