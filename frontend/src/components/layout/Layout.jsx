import React from 'react';
import Navbar from './Navbar'; // On importe la Navbar unique

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children} {/* C'est ici que le contenu de ta page s'affichera */}
            </main>
            <footer className="bg-gray-900 text-white p-4 text-center">
                Click & Collect - 2026
            </footer>
        </div>
    );
};

export default Layout;