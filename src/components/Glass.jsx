// liquid-glass-react (https://github.com/rdev/liquid-glass-react) with the site's defaults.
//
// LiquidGlass centres itself with absolute positioning, so <Glass> renders a sized,
// relatively positioned host (pass its size via `className`) and puts the glass in the middle.
// The refraction effect is Chromium-only; Safari and Firefox show frosted glass without it.
import { useEffect, useRef } from 'react';
import LiquidGlass from 'liquid-glass-react';
import { useDarkMode } from '../lib/theme.js';

export default function Glass({ className = '', children, glassStyle, ...props }) {
    const dark = useDarkMode();
    const contentRef = useRef(null);

    // LiquidGlass only re-measures itself on window resize, so nudge it when content changes size.
    useEffect(() => {
        const observer = new ResizeObserver(() => window.dispatchEvent(new Event('resize')));
        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={`relative ${className}`}>
            <LiquidGlass
                displacementScale={64}
                blurAmount={0.08}
                saturation={140}
                aberrationIntensity={2}
                elasticity={0.2}
                cornerRadius={999}
                padding="0"
                overLight={!dark}
                {...props}
                style={{ position: 'absolute', top: '50%', left: '50%', ...glassStyle }}
            >
                <div ref={contentRef}>{children}</div>
            </LiquidGlass>
        </div>
    );
}
