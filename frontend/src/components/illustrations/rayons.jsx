import React from 'react';

/*
 * Petites illustrations des rayons de la boutique, toutes calées sur le même
 * viewBox (160 x 120) pour que les cartes de la landing page restent alignées.
 * Le fond est géré par la carte, ici on ne dessine que les objets.
 */

export const BoulangerieArt = ({ className = '' }) => (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="102" rx="56" ry="8" fill="#D2C7B5" opacity="0.5" />
        <g transform="rotate(-18 68 62)">
            <rect x="54" y="16" width="26" height="92" rx="13" fill="#D9A56A" />
            <path d="M60 38l12-7M64 58l12-7M68 78l12-7" stroke="#B5834B" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g transform="rotate(14 96 66)">
            <rect x="84" y="24" width="24" height="86" rx="12" fill="#E5BC8A" />
            <path d="M90 44l11-6M94 64l11-6M98 84l11-6" stroke="#C9955C" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <path
            d="M112 88c-14 0-22-9-22-19 0-6 5-9 9-6 3 3 4 8 9 8s8-6 13-6 8 4 8 10c0 7-6 13-17 13z"
            fill="#E8B872"
        />
    </svg>
);

export const PrimeurArt = ({ className = '' }) => (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="104" rx="56" ry="8" fill="#D2C7B5" opacity="0.5" />
        {/* Carotte */}
        <g transform="rotate(18 44 66)">
            <path d="M44 44l16 4-9 52c-1 6-9 6-10 0z" fill="#E58C48" />
            <path d="M44 44c-6-10-3-20 3-22 4 6 4 14-3 22z" fill="#8CB699" />
            <path d="M44 44c8-8 18-8 22-4-5 6-14 8-22 4z" fill="#A9C7B2" />
        </g>
        {/* Tomate */}
        <circle cx="88" cy="72" r="26" fill="#C4452F" />
        <path d="M88 46c9-10 21-11 27-8-4 10-15 13-27 8z" fill="#5E8A6C" />
        <path d="M78 62a11 11 0 0 1 8-7" stroke="#E08170" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Salade */}
        <circle cx="126" cy="82" r="19" fill="#8CB699" />
        <circle cx="116" cy="74" r="13" fill="#A9C7B2" />
        <circle cx="136" cy="74" r="11" fill="#A9C7B2" />
    </svg>
);

export const CremerieArt = ({ className = '' }) => (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="104" rx="56" ry="8" fill="#D2C7B5" opacity="0.5" />
        {/* Bouteille de lait */}
        <path d="M40 42h26v50a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10z" fill="#FBF8F3" />
        <path d="M40 42h26v50a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10z" fill="none" stroke="#D2C7B5" strokeWidth="3" />
        <rect x="46" y="22" width="14" height="24" rx="4" fill="#FBF8F3" stroke="#D2C7B5" strokeWidth="3" />
        <rect x="43" y="16" width="20" height="10" rx="5" fill="#2E5C44" />
        <rect x="40" y="66" width="26" height="16" fill="#DCE9DF" />
        {/* Meule de fromage */}
        <path d="M82 96V60l52-18v36z" fill="#E8B872" />
        <path d="M82 60l52-18-16-10-52 18z" fill="#F2CE98" />
        <path d="M82 96V60l-16-10v36z" fill="#D6A05C" />
        <circle cx="102" cy="72" r="5" fill="#D6A05C" />
        <circle cx="120" cy="64" r="4" fill="#D6A05C" />
    </svg>
);

export const EpicerieArt = ({ className = '' }) => (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="104" rx="56" ry="8" fill="#D2C7B5" opacity="0.5" />
        {/* Bocal de miel */}
        <path d="M36 50h44v40a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12z" fill="#E8B872" />
        <rect x="32" y="38" width="52" height="16" rx="6" fill="#C9AE87" />
        <rect x="40" y="64" width="36" height="20" rx="4" fill="#FBF8F3" opacity="0.8" />
        {/* Bocal de confiture */}
        <path d="M92 58h38v34a12 12 0 0 1-12 12h-14a12 12 0 0 1-12-12z" fill="#C4452F" />
        <rect x="88" y="46" width="46" height="16" rx="6" fill="#2E5C44" />
        <rect x="98" y="70" width="26" height="16" rx="4" fill="#FBF8F3" opacity="0.85" />
        {/* Brin d'herbe */}
        <path d="M74 38c0-10 6-18 12-20 2 10-3 18-12 20z" fill="#8CB699" />
    </svg>
);

export const TraiteurArt = ({ className = '' }) => (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="106" rx="56" ry="8" fill="#D2C7B5" opacity="0.5" />
        {/* Vapeur */}
        <path
            d="M66 34c6-6 0-12 4-18M80 30c6-6 0-12 4-18M94 34c6-6 0-12 4-18"
            fill="none"
            stroke="#B7D2BF"
            strokeWidth="4"
            strokeLinecap="round"
        />
        {/* Plat */}
        <path d="M34 66h92a46 46 0 0 1-92 0z" fill="#2E5C44" />
        <path d="M34 66h92a46 46 0 0 1-11 29H45a46 46 0 0 1-11-29z" fill="#244936" />
        <rect x="26" y="60" width="108" height="12" rx="6" fill="#FBF8F3" />
        <rect x="26" y="60" width="108" height="12" rx="6" fill="none" stroke="#D2C7B5" strokeWidth="2" />
        {/* Garnitures qui dépassent */}
        <circle cx="60" cy="56" r="12" fill="#E58C48" />
        <circle cx="84" cy="52" r="14" fill="#C4452F" />
        <circle cx="106" cy="57" r="11" fill="#8CB699" />
    </svg>
);
