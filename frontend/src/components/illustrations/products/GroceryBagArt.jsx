import React from 'react';

/** Visuel par défaut : le sac click & collect prêt à être retiré. */
const GroceryBagArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#F0F5F1" />
        <circle cx="58" cy="50" r="44" fill="#DCE9DF" opacity="0.9" />
        <circle cx="270" cy="184" r="46" fill="#B7D2BF" opacity="0.4" />
        <circle cx="272" cy="46" r="6" fill="#8CB699" opacity="0.7" />
        <circle cx="44" cy="172" r="5" fill="#8CB699" opacity="0.5" />

        <g>
            <ellipse cx="160" cy="186" rx="80" ry="11" fill="#244936" opacity="0.16" />

            {/* Contenu qui dépasse */}
            <g transform="rotate(-12 128 74)">
                <rect x="116" y="30" width="22" height="66" rx="11" fill="#E8D5B5" />
                <path d="M121 48l11-6M124 64l11-6M127 80l11-6" stroke="#C9AE87" strokeWidth="3" strokeLinecap="round" />
            </g>
            <ellipse cx="186" cy="72" rx="28" ry="22" fill="#8CB699" />
            <ellipse cx="206" cy="84" rx="18" ry="15" fill="#629674" />
            <path d="M186 58c-8-10-6-20 0-25 7 5 8 16 0 25z" fill="#B7D2BF" />
            <circle cx="152" cy="78" r="15" fill="#D9722B" />
            <path d="M152 63v-8" stroke="#79370F" strokeWidth="4" strokeLinecap="round" />

            {/* Sac kraft */}
            <path d="M98 92h124l-10 88a14 14 0 0 1-14 12h-76a14 14 0 0 1-14-12z" fill="#E3BC7C" />
            <path d="M98 92h124l-10 88a14 14 0 0 1-14 12h-76a14 14 0 0 1-14-12z" fill="none" stroke="#B5813D" strokeWidth="4" strokeLinejoin="round" />
            <rect x="92" y="84" width="136" height="18" rx="8" fill="#F0D08C" stroke="#B5813D" strokeWidth="4" />

            {/* Étiquette click & collect */}
            <rect x="126" y="126" width="68" height="44" rx="12" fill="#2E5C44" />
            <path d="M144 149l9 10 17-19" stroke="#FBF8F3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
    </svg>
);

export default GroceryBagArt;
