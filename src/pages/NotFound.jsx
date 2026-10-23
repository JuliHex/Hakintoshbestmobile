import { Link } from 'react-router';
import { useTitle } from '../components/Layout.jsx';

export default function NotFound() {
    useTitle('Page not found');
    return (
        <div className="page min-h-[60vh] flex items-center justify-center">
            <div className="card p-8 sm:p-12 text-center max-w-md w-full animate-in">
                <p className="text-6xl font-bold text-blue-700 dark:text-blue-300">404</p>
                <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">The page you're looking for doesn't exist or has moved.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="btn-primary">Go home</Link>
                    <Link to="/explorer" className="btn-secondary">Browse laptops</Link>
                </div>
            </div>
        </div>
    );
}
