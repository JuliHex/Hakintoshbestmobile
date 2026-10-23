import { useEffect, useRef } from 'react';
import { Chart, Filler, Legend, LineElement, PointElement, RadarController, RadialLinearScale, Tooltip } from 'chart.js';
import { useDarkMode } from '../lib/theme.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Legend, Tooltip);

const LABELS = ['Ease of Setup', 'Performance', 'Battery', 'Stability'];
const METRICS = ['ease', 'performance', 'battery', 'stability'];
const COLORS = ['#4A90E2', '#E2774A', '#2BA36B'];
const FONT = '"Inter Variable", Inter, system-ui, sans-serif';

function rgba(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// One radar chart overlaying the ratings of every laptop passed in.
export default function RadarChart({ laptops, className = 'relative h-72' }) {
    const canvasRef = useRef(null);
    const dark = useDarkMode();

    useEffect(() => {
        const grid = dark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
        const text = dark ? '#e2e8f0' : '#374151';
        const chart = new Chart(canvasRef.current, {
            type: 'radar',
            data: {
                labels: LABELS,
                datasets: laptops.map((laptop, i) => {
                    const color = COLORS[i % COLORS.length];
                    return {
                        label: laptop.name,
                        data: METRICS.map(m => laptop.details.chartData[m]),
                        backgroundColor: rgba(color, 0.18),
                        borderColor: color,
                        pointBackgroundColor: color,
                        borderWidth: 2,
                        pointRadius: 3,
                        fill: true
                    };
                })
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 25, display: false },
                        grid: { color: grid },
                        angleLines: { color: grid },
                        pointLabels: { color: text, font: { family: FONT, size: 12 } }
                    }
                },
                plugins: {
                    legend: {
                        display: laptops.length > 1,
                        position: 'bottom',
                        labels: { color: text, font: { family: FONT }, boxWidth: 12 }
                    }
                }
            }
        });
        return () => chart.destroy();
    }, [laptops, dark]);

    return (
        <div className={className}>
            <canvas ref={canvasRef} role="img" aria-label={`Ratings for ${laptops.map(l => l.name).join(', ')}`} />
        </div>
    );
}
