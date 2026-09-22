import React from 'react';

/** Frais / primeur : bol de salade de saison. */
const SaladArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#F0F5F1" />
        <circle cx="58" cy="50" r="44" fill="#DCE9DF" opacity="0.9" />
        <circle cx="274" cy="186" r="48" fill="#B7D2BF" opacity="0.4" />
        <circle cx="272" cy="44" r="7" fill="#8CB699" opacity="0.7" />
        <circle cx="40" cy="166" r="5" fill="#8CB699" opacity="0.5" />

        <g transform="translate(0 6)">
            <ellipse cx="160" cy="176" rx="82" ry="11" fill="#244936" opacity="0.18" />

            {/* Feuilles */}
            <ellipse cx="116" cy="106" rx="34" ry="24" fill="#8CB699" />
            <ellipse cx="206" cy="104" rx="34" ry="24" fill="#629674" />
            <ellipse cx="160" cy="94" rx="32" ry="24" fill="#A9C7B2" />
            <path d="M160 78c-9-11-7-23 0-28 8 5 9 18 0 28z" fill="#B7D2BF" />
            <path d="M124 100c8 10 18 16 30 18M204 98c-8 10-18 16-30 18" stroke="#427658" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Tomates cerises */}
            <circle cx="126" cy="116" r="12" fill="#D9722B" />
            <circle cx="122" cy="112" r="4" fill="#FAE4CF" opacity="0.6" />
            <circle cx="200" cy="118" r="10" fill="#BE5B1C" />
            <path d="M126 105l-5-6M126 105l5-6" stroke="#427658" strokeWidth="3" strokeLinecap="round" />

            {/* Rondelles de concombre */}
            <circle cx="162" cy="116" r="12" fill="#DCE9DF" stroke="#8CB699" strokeWidth="3" />
            <circle cx="162" cy="116" r="5" fill="#B7D2BF" />

            {/* Bol */}
            <path d="M74 126h172c0 34-38 58-86 58s-86-24-86-58z" fill="#FBF8F3" />
            <path d="M74 126h172c0 34-38 58-86 58s-86-24-86-58z" fill="none" stroke="#2E5C44" strokeWidth="4" strokeLinejoin="round" />
            <path d="M92 146c6 18 30 30 68 30" stroke="#D2C7B5" strokeWidth="5" strokeLinecap="round" fill="none" />
            <rect x="66" y="118" width="188" height="12" rx="6" fill="#DCE9DF" stroke="#2E5C44" strokeWidth="4" />
        </g>
    </svg>
);

export default SaladArt;
