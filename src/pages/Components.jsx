import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import { componentData } from '../data/components.js';
import { useTitle } from '../components/Layout.jsx';

const KEYS = Object.keys(componentData);
const STATUS_LABELS = { good: 'Recommended', mid: 'Works with effort', bad: 'Avoid' };
const tabId = key => `tab-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export default function ComponentsPage() {
    useTitle('Component Checker');
    const [params, setParams] = useSearchParams();
    const active = KEYS.includes(params.get('tab')) ? params.get('tab') : KEYS[0];
    const tabsRef = useRef(null);
    const component = componentData[active];

    const select = (key, focus = false) => {
        setParams({ tab: key }, { replace: true });
        if (focus) tabsRef.current.querySelector(`#${tabId(key)}`).focus();
    };

    // Arrow keys move between tabs (WAI-ARIA tabs pattern).
    const onKeyDown = e => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        select(KEYS[(KEYS.indexOf(active) + step + KEYS.length) % KEYS.length], true);
    };

    return (
        <div className="page">
            <h1 className="page-title">Component Checker</h1>
            <p className="page-lead">A Hackintosh is only as good as its parts. Check the general macOS compatibility of each core component before you buy.</p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <span key={status} className="inline-flex items-center gap-2"><span className={`status-dot ${status} !mt-0`} />{label}</span>
                ))}
            </div>

            <div ref={tabsRef} role="tablist" aria-label="Component categories" onKeyDown={onKeyDown}
                 className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {KEYS.map(key => (
                    <button key={key} type="button" role="tab" id={tabId(key)} className="chip shrink-0" aria-controls="component-panel"
                            aria-selected={key === active} tabIndex={key === active ? 0 : -1} onClick={() => select(key)}>
                        {key}
                    </button>
                ))}
            </div>

            <div id="component-panel" role="tabpanel" aria-labelledby={tabId(active)} className="mt-4">
                <p className="mb-5 text-gray-700 dark:text-gray-300 max-w-3xl">{component.intro}</p>
                <ul className="grid gap-3 md:grid-cols-2">
                    {component.items.map(item => (
                        <li key={item.name} className="card p-4 flex gap-3 animate-in">
                            <span className={`status-dot ${item.status}`} role="img" aria-label={STATUS_LABELS[item.status]} />
                            <div className="min-w-0">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
