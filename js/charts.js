// Radar charts for laptop ratings (Chart.js 4, loaded from CDN on the pages that need it).

const ChartManager = (() => {
    const LABELS = ['Ease of Setup', 'Performance', 'Battery', 'Stability'];
    const METRICS = ['ease', 'performance', 'battery', 'stability'];
    const COLORS = ['#4A90E2', '#E2774A', '#2BA36B'];
    const charts = [];

    function themeColors(dark) {
        return {
            grid: dark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
            text: dark ? '#e2e8f0' : '#374151'
        };
    }

    function hexToRgba(hex, alpha) {
        const n = parseInt(hex.slice(1), 16);
        return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
    }

    function dataset(laptop, index) {
        const color = COLORS[index % COLORS.length];
        return {
            label: laptop.name,
            data: METRICS.map(m => laptop.details.chartData[m]),
            backgroundColor: hexToRgba(color, 0.18),
            borderColor: color,
            pointBackgroundColor: color,
            borderWidth: 2,
            pointRadius: 3
        };
    }

    // Draws one radar chart overlaying every laptop passed in.
    function radar(canvas, laptops) {
        if (typeof Chart === 'undefined' || !canvas) {
            if (canvas) canvas.replaceWith(Object.assign(document.createElement('p'), {
                className: 'text-sm text-gray-500 dark:text-gray-400 text-center py-8',
                textContent: 'Chart unavailable (could not load Chart.js).'
            }));
            return null;
        }
        const c = themeColors(UI.isDark());
        const chart = new Chart(canvas, {
            type: 'radar',
            data: { labels: LABELS, datasets: laptops.map(dataset) },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 25, display: false },
                        grid: { color: c.grid },
                        angleLines: { color: c.grid },
                        pointLabels: { color: c.text, font: { family: 'Inter, sans-serif', size: 12 } }
                    }
                },
                plugins: {
                    legend: {
                        display: laptops.length > 1,
                        position: 'bottom',
                        labels: { color: c.text, font: { family: 'Inter, sans-serif' }, boxWidth: 12 }
                    }
                }
            }
        });
        charts.push(chart);
        return chart;
    }

    UI.onThemeChange(dark => {
        const c = themeColors(dark);
        charts.forEach(chart => {
            const r = chart.options.scales.r;
            r.grid.color = c.grid;
            r.angleLines.color = c.grid;
            r.pointLabels.color = c.text;
            chart.options.plugins.legend.labels.color = c.text;
            chart.update();
        });
    });

    return { radar, METRICS, LABELS };
})();
