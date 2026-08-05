import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Les pages d'authentification ont leur propre mise en page plein écran
// (formulaire + panneau illustré) : ni navbar, ni footer par-dessus.
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

const Layout = ({ children }) => {
    const { pathname, hash } = useLocation();

    // React Router ne gère pas les ancres : on remonte en haut à chaque
    // changement de page, et on scrolle vers la section quand l'URL en cible une
    // (liens "/#rayons" du footer par exemple).
    useEffect(() => {
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);

    if (AUTH_ROUTES.includes(pathname)) {
        return children;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
