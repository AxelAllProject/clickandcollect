import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-slate-900 text-slate-400 text-sm">
                <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                        <ShoppingBag size={16} />
                        Click&amp;Collect
                    </div>
                    <p>&copy; 2026 Click&amp;Collect. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
