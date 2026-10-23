import { Link } from 'react-router';
import { useTitle } from '../components/Layout.jsx';
import { LaptopDB } from '../data/laptops.js';
import { laptopPath } from '../lib/format.js';

// Highest-rated laptops that are easy or cheap: good used-market targets.
const SHORTLIST = LaptopDB.all()
    .filter(l => l.priority.includes('budget') || l.priority.includes('ease'))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

export default function BuyUsed() {
    useTitle('Buying Used');
    return (
        <div className="page">
            <h1 className="page-title">Buying a used laptop</h1>
            <p className="page-lead">The best Hackintosh laptops are 2018–2020 business machines, which are now cheap second-hand. Here's where to look and how to avoid a dud.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="card p-5 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4">Where to look</h2>
                    <ul className="space-y-3 text-sm">
                        <li><strong>Refurbishers and off-lease resellers.</strong> <span className="text-gray-600 dark:text-gray-300">Ex-corporate ThinkPads, Latitudes and EliteBooks, usually tested, cleaned and with a short warranty. Often the best value.</span></li>
                        <li><strong>eBay and similar marketplaces.</strong> <span className="text-gray-600 dark:text-gray-300">Widest choice. Buy from sellers with a returns policy and clear photos of the actual unit.</span></li>
                        <li><strong>Local classifieds.</strong> <span className="text-gray-600 dark:text-gray-300">Cheapest, and you can test before paying. Bring a USB stick (see the checklist).</span></li>
                        <li><strong>Manufacturer outlets.</strong> <span className="text-gray-600 dark:text-gray-300">Lenovo, Dell and HP sell refurbished stock with full warranties, though newer models may not be Hackintosh-friendly.</span></li>
                    </ul>
                </section>

                <section className="card p-5 sm:p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">What to check in the listing</h2>
                    <div className="table-scroll">
                        <table>
                            <thead className="text-gray-500 dark:text-gray-400">
                                <tr><th scope="col">Check</th><th scope="col">Why it matters</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                <tr><td className="font-medium">Exact CPU model</td><td>8th–10th gen Intel is ideal. 11th gen and newer have Iris Xe graphics, which has no macOS acceleration.</td></tr>
                                <tr><td className="font-medium">Discrete GPU</td><td>NVIDIA dGPUs can't be used and must be disabled. Prefer iGPU-only configurations.</td></tr>
                                <tr><td className="font-medium">Wi-Fi card</td><td>Replaceable M.2 cards can be swapped for Broadcom. Soldered or CNVi cards limit you to Intel itlwm.</td></tr>
                                <tr><td className="font-medium">RAM</td><td>Soldered RAM can't be upgraded. Aim for 16&nbsp;GB on those models.</td></tr>
                                <tr><td className="font-medium">SSD</td><td>Plan to swap known-problem NVMe drives (e.g. Samsung PM981) for a compatible one.</td></tr>
                                <tr><td className="font-medium">BIOS lock</td><td>Supervisor or Computrace-locked business laptops can be impossible to configure. Ask the seller.</td></tr>
                                <tr><td className="font-medium">Battery health</td><td>Ask for the wear level. A replacement battery is cheap for some models and painful for others.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="card p-5 sm:p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">In-person test checklist</h2>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li>Boot into the BIOS and confirm there's no supervisor password. Note the BIOS version.</li>
                        <li>Boot a Linux live USB and run <code className="px-1 rounded bg-gray-100 dark:bg-gray-700">lspci</code> and <code className="px-1 rounded bg-gray-100 dark:bg-gray-700">lsusb</code> to identify the Wi-Fi card, audio codec and trackpad.</li>
                        <li>Test every key, the trackpad buttons, all USB ports, the headphone jack and the webcam.</li>
                        <li>Check the screen for dead pixels, backlight bleed and hinge wobble.</li>
                        <li>Run on battery for 10 minutes and watch how fast the percentage drops.</li>
                        <li>Check the charger's wattage matches the original spec.</li>
                    </ol>
                </section>

                <section className="card p-5 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4">Good shortlists</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">These are well-documented, widely available used, and run macOS well:</p>
                    <ul className="space-y-2 text-sm">
                        {SHORTLIST.map(l => (
                            <li key={l.id} className="flex justify-between gap-3">
                                <Link className="font-medium text-blue-700 dark:text-blue-300 hover:underline" to={laptopPath(l.id)}>{l.name}</Link>
                                <span className="tabular-nums text-gray-500 dark:text-gray-400">{l.score.toFixed(1)}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to="/explorer?priority=budget" className="btn-primary mt-5 w-full">See all budget picks</Link>
                </section>
            </div>
        </div>
    );
}
