import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    Leaf,
    MapPin,
    Quote,
    ShoppingBasket,
    Sparkles,
    Star,
    Store,
    UtensilsCrossed,
} from 'lucide-react';
import api from '../services/api';
import Reveal from '../components/ui/Reveal';
import CountUp from '../components/ui/CountUp';
import useScrollProgress from '../hooks/useScrollProgress';
import StorefrontScene from '../components/illustrations/StorefrontScene';
import PickupMapArt, { MapPin as MapPinArt } from '../components/illustrations/PickupMapArt';
import {
    BoulangerieArt,
    PrimeurArt,
    CremerieArt,
    EpicerieArt,
    TraiteurArt,
} from '../components/illustrations/rayons';

/*
 * Contenu éditorial de la landing page. Il est regroupé ici, en haut du
 * fichier, pour pouvoir être ajusté sans toucher au JSX plus bas.
 */
const RAYONS = [
    {
        title: 'Boulangerie',
        text: 'Pains au levain, baguettes de tradition et viennoiseries cuites le matin même.',
        Art: BoulangerieArt,
        tone: 'bg-orange-50',
    },
    {
        title: 'Fruits & légumes',
        text: 'Des primeurs de saison, livrés par des producteurs à moins de 50 km.',
        Art: PrimeurArt,
        tone: 'bg-brand-50',
    },
    {
        title: 'Crèmerie',
        text: 'Fromages affinés, beurre de baratte et laitages fermiers.',
        Art: CremerieArt,
        tone: 'bg-slate-100',
    },
    {
        title: 'Épicerie fine',
        text: 'Miels, conserves et condiments choisis chez des artisans.',
        Art: EpicerieArt,
        tone: 'bg-orange-50',
    },
    {
        title: 'Traiteur',
        text: 'Plats préparés du jour, à réchauffer ou à emporter tels quels.',
        Art: TraiteurArt,
        tone: 'bg-brand-50',
    },
];

const ETAPES = [
    {
        icon: ShoppingBasket,
        title: 'Je remplis mon panier',
        text: 'Parcourez le catalogue, ajoutez vos produits. Les stocks affichés sont ceux du magasin, en direct.',
    },
    {
        icon: CalendarClock,
        title: 'Je choisis mon créneau',
        text: 'Un point relais, un jour, une plage de 30 minutes. Vous restez maître de votre horaire.',
    },
    {
        icon: CreditCard,
        title: 'Je paie en ligne',
        text: 'Paiement sécurisé par Stripe. Rien à sortir au moment du retrait, tout est déjà réglé.',
    },
    {
        icon: Store,
        title: 'Je récupère',
        text: 'Votre commande vous attend, préparée et étiquetée. Vous annoncez votre nom, et c\'est tout.',
    },
];

const AVANTAGES = [
    { icon: Leaf, label: 'Producteurs locaux' },
    { icon: CalendarClock, label: 'Créneaux de 30 min' },
    { icon: CreditCard, label: 'Paiement sécurisé' },
    { icon: MapPin, label: 'Points relais de proximité' },
];

const BANDEAU = [
    'Produits de saison',
    'Retrait en 2 h',
    'Zéro frais de service',
    'Circuit court',
    'Créneaux au choix',
    'Commande annulable',
];

const AVIS = [
    {
        nom: 'Camille',
        ville: 'Lille',
        texte: 'Je commande le matin, je récupère en sortant du travail. Plus jamais de course au supermarché le samedi.',
    },
    {
        nom: 'Thomas',
        ville: 'Roubaix',
        texte: 'Le créneau est respecté à la minute et la qualité des produits est vraiment au-dessus.',
    },
    {
        nom: 'Sofia',
        ville: 'Villeneuve-d\'Ascq',
        texte: 'Ce que j\'aime : savoir d\'où viennent les produits et payer en ligne une bonne fois pour toutes.',
    },
];

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stepsRef, stepsProgress] = useScrollProgress();

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const response = await api.get('/products');
                setFeaturedProducts(response.data.slice(0, 3));
            } catch (err) {
                console.error("Impossible de charger l'aperçu :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, []);

    return (
        <div className="overflow-x-hidden">

            {/* ------------------------------------------------------------ */}
            {/* HERO                                                          */}
            {/* ------------------------------------------------------------ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-slate-50 to-slate-50" />
                <div className="absolute -top-40 -left-32 w-[30rem] h-[30rem] bg-brand-100/70 rounded-full blur-3xl" />
                <div className="absolute top-24 -right-40 w-[28rem] h-[28rem] bg-orange-100/60 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 md:gap-8 items-center">
                    <div>
                        <Reveal direction="up">
                            <span className="inline-flex items-center gap-1.5 bg-white text-brand-700 font-semibold px-3 py-1.5 rounded-full text-xs ring-1 ring-brand-200 shadow-sm">
                                <Sparkles size={13} className="text-orange-500" />
                                NOUVEAU EN HAUTS-DE-FRANCE
                            </span>
                        </Reveal>

                        <Reveal direction="up" delay={80}>
                            <h1 className="mt-6 text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-slate-900 leading-[1.08]">
                                Le meilleur du quartier,
                                <br />
                                <span className="text-brand-600 italic">prêt quand vous l&apos;êtes.</span>
                            </h1>
                        </Reveal>

                        <Reveal direction="up" delay={160}>
                            <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                                Commandez vos produits frais en ligne, choisissez un point relais et un
                                créneau de 30 minutes, puis passez récupérer votre panier. Sans file
                                d&apos;attente, sans frais, sans surprise.
                            </p>
                        </Reveal>

                        <Reveal direction="up" delay={240}>
                            <div className="mt-9 flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/catalog"
                                    className="group inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors shadow-lg shadow-orange-900/15"
                                >
                                    Découvrir la boutique
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <a
                                    href="#etapes"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-3.5 px-7 rounded-xl transition-colors ring-1 ring-slate-200"
                                >
                                    Comment ça marche ?
                                </a>
                            </div>
                        </Reveal>

                        <Reveal direction="up" delay={320}>
                            <ul className="mt-10 grid grid-cols-2 gap-y-3 gap-x-4 max-w-md">
                                {AVANTAGES.map(({ icon: Icon, label }) => (
                                    <li key={label} className="flex items-center gap-2.5 text-sm text-slate-600">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white ring-1 ring-slate-200 text-brand-600 flex-shrink-0">
                                            <Icon size={15} />
                                        </span>
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>

                    {/* Illustration + cartes flottantes */}
                    <Reveal direction="zoom" delay={120} className="relative">
                        <StorefrontScene className="w-full max-w-lg mx-auto drop-shadow-sm" />

                        <div
                            className="animate-float absolute top-6 -left-2 sm:left-2 bg-white rounded-2xl shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 px-4 py-3 flex items-center gap-3"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-50 text-brand-600">
                                <CalendarClock size={18} />
                            </span>
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Créneau réservé</p>
                                <p className="text-sm font-bold text-slate-900">Aujourd&apos;hui, 12h30 – 13h00</p>
                            </div>
                        </div>

                        <div
                            className="animate-float absolute bottom-8 -right-2 sm:right-0 bg-white rounded-2xl shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 px-4 py-3 flex items-center gap-3"
                            style={{ animationDelay: '1.6s' }}
                        >
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-50 text-orange-600">
                                <CheckCircle2 size={18} />
                            </span>
                            <div>
                                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Commande #1284</p>
                                <p className="text-sm font-bold text-slate-900">Prête au relais Gambetta</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* BANDEAU DÉFILANT                                              */}
            {/* ------------------------------------------------------------ */}
            <section className="bg-brand-800 py-4 overflow-hidden">
                <div className="flex w-max animate-marquee">
                    {[0, 1].map((copy) => (
                        <ul key={copy} className="flex items-center" aria-hidden={copy === 1}>
                            {BANDEAU.map((mot) => (
                                <li key={mot} className="flex items-center gap-8 px-8">
                                    <span className="text-brand-50 font-display text-lg whitespace-nowrap">{mot}</span>
                                    <Leaf size={15} className="text-orange-400 flex-shrink-0" />
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* RAYONS                                                        */}
            {/* ------------------------------------------------------------ */}
            <section id="rayons" className="py-20 md:py-28 px-4">
                <div className="max-w-6xl mx-auto">
                    <Reveal direction="up" className="max-w-2xl">
                        <span className="text-xs font-bold tracking-[0.18em] text-orange-600 uppercase">Nos rayons</span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
                            Une épicerie complète, en circuit court
                        </h2>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            Du pain du matin au plat du soir : tout ce que vous mettez habituellement dans
                            votre panier, sélectionné auprès de producteurs et d&apos;artisans de la région.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {RAYONS.map(({ title, text, Art, tone }, index) => (
                            <Reveal
                                key={title}
                                direction="up"
                                delay={index * 90}
                                className="group bg-white rounded-3xl ring-1 ring-slate-200 overflow-hidden hover:ring-brand-300 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`${tone} px-6 pt-8 pb-4 flex justify-center`}>
                                    <Art className="w-40 h-32 transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
                                </div>
                            </Reveal>
                        ))}

                        <Reveal
                            direction="up"
                            delay={RAYONS.length * 90}
                            className="rounded-3xl bg-brand-700 text-brand-50 p-8 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white">Et bien plus encore</h3>
                                <p className="mt-2 text-sm text-brand-100 leading-relaxed">
                                    Le catalogue évolue chaque semaine au rythme des arrivages. Jetez-y un œil,
                                    il y a toujours une nouveauté.
                                </p>
                            </div>
                            <Link
                                to="/catalog"
                                className="group mt-8 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-5 rounded-xl transition-colors self-start"
                            >
                                Voir le catalogue
                                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* COMMENT ÇA MARCHE (ligne dessinée au scroll)                   */}
            {/* ------------------------------------------------------------ */}
            <section id="etapes" ref={stepsRef} className="py-20 md:py-28 px-4 bg-white border-y border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <Reveal direction="up" className="max-w-2xl">
                        <span className="text-xs font-bold tracking-[0.18em] text-orange-600 uppercase">Comment ça marche</span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
                            Quatre étapes, dix minutes montre en main
                        </h2>
                    </Reveal>

                    <div className="relative mt-16">
                        {/* Rail de progression : se remplit au fil du scroll */}
                        <div className="hidden lg:block absolute left-0 right-0 top-7 h-1 rounded-full bg-slate-200 overflow-hidden">
                            <div
                                className="scroll-line h-full rounded-full bg-gradient-to-r from-brand-500 to-orange-500"
                                style={{ '--progress': String(Math.min(1, stepsProgress * 1.5)) }}
                            />
                        </div>

                        <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                            {ETAPES.map(({ icon: Icon, title, text }, index) => (
                                <Reveal as="li" key={title} direction="up" delay={index * 110}>
                                    <div className="flex items-center gap-4 lg:block">
                                        <span className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white ring-8 ring-white flex-shrink-0">
                                            <Icon size={22} />
                                        </span>
                                        <span className="lg:mt-6 lg:block text-sm font-bold text-orange-600">
                                            Étape {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
                                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
                                </Reveal>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* À LA UNE                                                      */}
            {/* ------------------------------------------------------------ */}
            <section className="py-20 md:py-28 px-4">
                <div className="max-w-6xl mx-auto">
                    <Reveal direction="up" className="flex flex-wrap justify-between items-end gap-4">
                        <div>
                            <span className="text-xs font-bold tracking-[0.18em] text-orange-600 uppercase">À la une</span>
                            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">Les produits de la semaine</h2>
                        </div>
                        <Link to="/catalog" className="group inline-flex items-center gap-1.5 text-brand-700 font-semibold text-sm hover:text-brand-600">
                            Tout le catalogue
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Reveal>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {loading && (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl ring-1 ring-slate-200 overflow-hidden">
                                    <div className="h-48 skeleton" />
                                    <div className="p-5 flex flex-col gap-3">
                                        <div className="h-4 w-2/3 rounded skeleton" />
                                        <div className="h-4 w-1/3 rounded skeleton" />
                                    </div>
                                </div>
                            ))
                        )}

                        {!loading && featuredProducts.length > 0 && featuredProducts.map((product, index) => (
                            <Reveal
                                key={product.id}
                                direction="up"
                                delay={index * 100}
                                className="group bg-white rounded-3xl ring-1 ring-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="h-48 bg-brand-50 flex items-center justify-center text-brand-300 overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <UtensilsCrossed size={30} />
                                    )}
                                </div>
                                <div className="p-5 flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                                    <p className="text-orange-600 font-bold whitespace-nowrap">
                                        {Number(product.price).toFixed(2)} €
                                    </p>
                                </div>
                            </Reveal>
                        ))}

                        {!loading && featuredProducts.length === 0 && (
                            <Reveal direction="up" className="sm:col-span-2 md:col-span-3">
                                <div className="text-center py-14 px-6 bg-white rounded-3xl ring-1 ring-dashed ring-slate-300">
                                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 mx-auto mb-4">
                                        <ShoppingBasket size={22} />
                                    </span>
                                    <p className="text-slate-700 font-semibold">Connectez-vous pour découvrir le catalogue</p>
                                    <p className="text-sm text-slate-500 mt-1.5 mb-5">
                                        La sélection de la semaine est réservée aux membres.
                                    </p>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-colors"
                                    >
                                        Me connecter
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* POINTS RELAIS                                                 */}
            {/* ------------------------------------------------------------ */}
            <section className="py-20 md:py-28 px-4 bg-white border-y border-slate-200">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
                    <Reveal direction="left" className="relative">
                        <PickupMapArt className="w-full" />

                        <MapPinArt
                            active
                            className="animate-float absolute w-9 left-[36%] top-[26%] drop-shadow-md"
                        />
                        <MapPinArt
                            className="animate-float absolute w-8 left-[16%] top-[58%] drop-shadow-md"
                            style={{ animationDelay: '1s' }}
                        />
                        <MapPinArt
                            className="animate-float absolute w-8 left-[71%] top-[44%] drop-shadow-md"
                            style={{ animationDelay: '2s' }}
                        />
                    </Reveal>

                    <div>
                        <Reveal direction="right">
                            <span className="text-xs font-bold tracking-[0.18em] text-orange-600 uppercase">Points relais</span>
                            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
                                Un retrait toujours à portée de main
                            </h2>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                Commerces partenaires, casiers réfrigérés, marchés couverts : choisissez le
                                point relais qui se trouve sur votre route. Chaque adresse propose ses
                                propres créneaux, du lundi au samedi.
                            </p>
                        </Reveal>

                        <div className="mt-8 space-y-3">
                            {[
                                { nom: 'Relais Gambetta', ville: 'Lille · 59000', creneaux: '9h – 20h' },
                                { nom: 'Marché couvert Wazemmes', ville: 'Lille · 59000', creneaux: '8h – 14h' },
                                { nom: 'Casiers Grand-Place', ville: 'Roubaix · 59100', creneaux: '24h/24' },
                            ].map(({ nom, ville, creneaux }, index) => (
                                <Reveal
                                    key={nom}
                                    direction="right"
                                    delay={100 + index * 90}
                                    className="flex items-center gap-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200 p-4"
                                >
                                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white ring-1 ring-slate-200 text-brand-600 flex-shrink-0">
                                        <MapPin size={19} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{nom}</p>
                                        <p className="text-sm text-slate-500 truncate">{ville}</p>
                                    </div>
                                    <span className="ml-auto text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                                        {creneaux}
                                    </span>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* CHIFFRES                                                      */}
            {/* ------------------------------------------------------------ */}
            <section className="py-16 md:py-20 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {[
                        { to: 42, suffix: '', label: 'producteurs partenaires' },
                        { to: 12, suffix: '', label: 'points relais dans la métropole' },
                        { to: 30, suffix: ' min', label: 'de créneau, pas une heure entière' },
                        { to: 4.8, suffix: '/5', decimals: 1, label: 'de satisfaction client' },
                    ].map(({ to, suffix, decimals, label }, index) => (
                        <Reveal key={label} direction="up" delay={index * 100}>
                            <p className="font-display text-4xl md:text-5xl font-bold text-brand-600">
                                <CountUp to={to} suffix={suffix} decimals={decimals || 0} />
                            </p>
                            <p className="mt-2 text-sm text-slate-500 max-w-[14rem] mx-auto">{label}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* AVIS                                                          */}
            {/* ------------------------------------------------------------ */}
            <section className="pb-20 md:pb-28 px-4">
                <div className="max-w-6xl mx-auto">
                    <Reveal direction="up" className="text-center max-w-2xl mx-auto">
                        <span className="text-xs font-bold tracking-[0.18em] text-orange-600 uppercase">Ils commandent déjà</span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
                            Des habitudes qui changent vite
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {AVIS.map(({ nom, ville, texte }, index) => (
                            <Reveal
                                key={nom}
                                direction="up"
                                delay={index * 100}
                                className="bg-white rounded-3xl ring-1 ring-slate-200 p-7 flex flex-col"
                            >
                                <Quote size={24} className="text-orange-300" />
                                <p className="mt-4 text-slate-700 leading-relaxed flex-grow">{texte}</p>
                                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-100">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-600 text-white font-semibold">
                                        {nom[0]}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">{nom}</p>
                                        <p className="text-xs text-slate-500">{ville}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5 text-orange-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={13} fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* CTA FINAL                                                     */}
            {/* ------------------------------------------------------------ */}
            <section className="px-4 pb-20 md:pb-28">
                <Reveal direction="zoom" className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-16 md:py-20 text-center">
                    <div className="absolute -top-24 -left-16 w-80 h-80 bg-brand-600/50 rounded-full blur-3xl" />
                    <div className="absolute -bottom-28 -right-10 w-80 h-80 bg-orange-600/25 rounded-full blur-3xl" />

                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
                            Votre prochain panier vous attend déjà
                        </h2>
                        <p className="mt-4 text-brand-100 max-w-xl mx-auto leading-relaxed">
                            Créez votre compte en une minute et réservez votre premier créneau dès aujourd&apos;hui.
                        </p>
                        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/register"
                                className="group inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors shadow-lg shadow-brand-950/30"
                            >
                                Créer mon compte
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/catalog"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-7 rounded-xl transition-colors ring-1 ring-white/25"
                            >
                                Parcourir sans compte
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </section>
        </div>
    );
};

export default HomePage;
