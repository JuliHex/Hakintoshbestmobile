import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Explorer from './pages/Explorer.jsx';
import ComponentsPage from './pages/Components.jsx';
import Essentials from './pages/Essentials.jsx';
import BuildGuide from './pages/BuildGuide.jsx';
import BuyUsed from './pages/BuyUsed.jsx';
import Troubleshooting from './pages/Troubleshooting.jsx';
import NotFound from './pages/NotFound.jsx';

// Pages with charts load Chart.js on demand.
const LaptopDetail = lazy(() => import('./pages/LaptopDetail.jsx'));
const Compare = lazy(() => import('./pages/Compare.jsx'));

// Keep links to the old multi-page site (e.g. explorer.html?priority=ease) working.
function LegacyRedirect({ to }) {
    const { search, hash } = useLocation();
    return <Navigate to={`${to}${search}${hash}`} replace />;
}

function LegacyDetailRedirect() {
    const [params] = useSearchParams();
    const id = params.get('id');
    return <Navigate to={id ? `/laptop/${encodeURIComponent(id)}` : '/explorer'} replace />;
}

function LegacyComponentsRedirect() {
    const { hash } = useLocation();
    return <Navigate to={hash ? `/components?tab=${hash.slice(1)}` : '/components'} replace />;
}

const Loading = () => <p className="page text-center text-gray-500">Loading…</p>;

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="explorer" element={<Explorer />} />
                <Route path="laptop/:id" element={<Suspense fallback={<Loading />}><LaptopDetail /></Suspense>} />
                <Route path="compare" element={<Suspense fallback={<Loading />}><Compare /></Suspense>} />
                <Route path="components" element={<ComponentsPage />} />
                <Route path="essentials" element={<Essentials />} />
                <Route path="build-guide" element={<BuildGuide />} />
                <Route path="buy-used" element={<BuyUsed />} />
                <Route path="troubleshooting" element={<Troubleshooting />} />

                <Route path="index.html" element={<LegacyRedirect to="/" />} />
                <Route path="explorer.html" element={<LegacyRedirect to="/explorer" />} />
                <Route path="laptop_detail.html" element={<LegacyDetailRedirect />} />
                <Route path="comparison.html" element={<LegacyRedirect to="/compare" />} />
                <Route path="components.html" element={<LegacyComponentsRedirect />} />
                <Route path="essentials.html" element={<LegacyRedirect to="/essentials" />} />
                <Route path="build_guide.html" element={<LegacyRedirect to="/build-guide" />} />
                <Route path="buy_used.html" element={<LegacyRedirect to="/buy-used" />} />
                <Route path="troubleshooting.html" element={<LegacyRedirect to="/troubleshooting" />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
