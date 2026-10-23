// Mounts liquid-glass-react (https://github.com/rdev/liquid-glass-react) onto plain HTML.
//
// Any element with `data-liquid-glass` becomes an island: its existing child nodes are moved,
// untouched, inside a <LiquidGlass> component, so links, buttons and ids keep working and the
// page's vanilla scripts can keep updating them. Optional JSON in the attribute is passed as
// props, e.g. data-liquid-glass='{"cornerRadius": 999, "padding": "6px"}'.
//
// LiquidGlass centres itself with absolute positioning, so the host element needs a size and
// `position: relative` (or fixed). If this bundle fails to load, the host's children still
// render with the site's CSS glass styling.
//
// Built by `npm run build:js` into assets/js/liquid-glass.js.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import LiquidGlass from 'liquid-glass-react';

const isDark = () => document.documentElement.classList.contains('dark');

// LiquidGlass only re-measures itself on window resize, so nudge it when content changes.
const remeasure = () => window.dispatchEvent(new Event('resize'));

function Island({ nodes, props }) {
    const contentRef = useRef(null);
    const [dark, setDark] = useState(isDark);

    useLayoutEffect(() => {
        nodes.forEach(node => contentRef.current.appendChild(node));
    }, [nodes]);

    useEffect(() => {
        const onTheme = e => setDark(e.detail.dark);
        document.addEventListener('theme:change', onTheme);
        const observer = new ResizeObserver(remeasure);
        observer.observe(contentRef.current);
        return () => {
            document.removeEventListener('theme:change', onTheme);
            observer.disconnect();
        };
    }, []);

    return (
        <LiquidGlass
            displacementScale={64}
            blurAmount={0.08}
            saturation={140}
            aberrationIntensity={2}
            elasticity={0.2}
            cornerRadius={999}
            overLight={!dark}
            {...props}
            style={{ position: 'absolute', top: '50%', left: '50%', ...(props.style || {}) }}
        >
            <div ref={contentRef} className="liquid-glass-content" />
        </LiquidGlass>
    );
}

function mount(host) {
    let props = {};
    try {
        props = JSON.parse(host.dataset.liquidGlass || '{}');
    } catch (e) {
        console.warn('Invalid data-liquid-glass props', host, e);
    }
    const nodes = [...host.childNodes];
    host.classList.add('liquid-glass-ready');
    createRoot(host).render(<Island nodes={nodes} props={props} />);
}

document.querySelectorAll('[data-liquid-glass]').forEach(mount);
