import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import MarketCrateScene from '../illustrations/MarketCrateScene';

const DEFAULT_HIGHLIGHTS = [
    'Des produits frais de producteurs locaux',
    'Un créneau de retrait de 30 minutes',
    'Paiement en ligne sécurisé, zéro frais',
];

const DEFAULT_QUOTE = {
    texte: "Je commande le matin, je récupère en sortant du travail. C'est devenu un réflexe.",
    auteur: 'Camille, cliente à Lille',
};

/**
 * Coquille commune aux pages d'authentification : formulaire à gauche,
 * panneau illustré aux couleurs de la marque à droite (masqué sous lg).
 *
 * Le panneau est volontairement décoratif : tout le contenu utile
 * (formulaire, erreurs, liens) vit dans la colonne de gauche.
 */
const AuthLayout = ({
    title,
    subtitle,
    icon: Icon = ShoppingBag,
    highlights = DEFAULT_HIGHLIGHTS,
    quote = DEFAULT_QUOTE,
    footer,
    children,
}) => (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1fr_1.1fr]">

        {/* Colonne formulaire */}
        <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-14 xl:px-20">
            <div className="flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white">
                        <ShoppingBag size={18} strokeWidth={2.25} />
                    </span>
                    Click<span className="text-orange-600">&amp;</span>Collect
                </Link>
                <Link
                    to="/"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Retour au site
                </Link>
            </div>

            <div className="flex-grow flex items-center justify-center py-12">
                <div className="w-full max-w-md animate-fade-up">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 mb-6">
                        <Icon size={22} />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
                    {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}

                    <div className="mt-8">{children}</div>

                    {footer && <div className="mt-8 text-sm text-slate-500">{footer}</div>}
                </div>
            </div>

            <p className="text-xs text-slate-400 text-center lg:text-left">
                &copy; 2026 Click&amp;Collect · Hauts-de-France
            </p>
        </div>

        {/* Panneau illustré */}
        <aside className="hidden lg:flex relative overflow-hidden bg-brand-800 flex-col justify-between p-14">
            <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-brand-600/45 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl" />

            <ul className="relative space-y-4">
                {highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-brand-50">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white flex-shrink-0">
                            <Check size={14} strokeWidth={3} />
                        </span>
                        <span className="font-medium">{item}</span>
                    </li>
                ))}
            </ul>

            <MarketCrateScene className="relative w-full max-w-md mx-auto animate-float" />

            <figure className="relative max-w-md">
                <blockquote className="font-display text-xl text-white leading-snug">
                    &ldquo;{quote.texte}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm text-brand-200">— {quote.auteur}</figcaption>
            </figure>
        </aside>
    </div>
);

export default AuthLayout;
