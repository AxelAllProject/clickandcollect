import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Mail, Clock } from 'lucide-react';

const COLONNES = [
    {
        titre: 'La boutique',
        liens: [
            { label: 'Catalogue', to: '/catalog' },
            { label: 'Nos rayons', to: '/#rayons' },
            { label: 'Comment ça marche', to: '/#etapes' },
        ],
    },
    {
        titre: 'Mon compte',
        liens: [
            { label: 'Mes commandes', to: '/orders' },
            { label: 'Mon profil', to: '/profile' },
            { label: 'Paramètres', to: '/settings' },
        ],
    },
];

const Footer = () => (
    <footer className="bg-brand-900 text-brand-100">
        <div className="max-w-6xl mx-auto px-4 py-14">
            <div className="grid gap-10 md:grid-cols-4">
                <div className="md:col-span-2 max-w-sm">
                    <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500 text-white">
                            <ShoppingBag size={18} strokeWidth={2.25} />
                        </span>
                        Click<span className="text-orange-400">&amp;</span>Collect
                    </Link>
                    <p className="mt-4 text-sm leading-relaxed text-brand-200">
                        L&apos;épicerie de quartier en ligne : des produits frais de producteurs des
                        Hauts-de-France, à retirer au point relais et au créneau de votre choix.
                    </p>
                </div>

                {COLONNES.map(({ titre, liens }) => (
                    <div key={titre}>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">{titre}</h3>
                        <ul className="mt-4 space-y-2.5">
                            {liens.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="text-sm text-brand-200 hover:text-white transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-300">
                <p>&copy; 2026 Click&amp;Collect. Tous droits réservés.</p>
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <li className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        Hauts-de-France
                    </li>
                    <li className="flex items-center gap-1.5">
                        <Clock size={14} />
                        Lun – Sam, 8h – 20h
                    </li>
                    <li className="flex items-center gap-1.5">
                        <Mail size={14} />
                        contact@clickandcollect.fr
                    </li>
                </ul>
            </div>
        </div>
    </footer>
);

export default Footer;
