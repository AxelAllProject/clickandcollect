import React from 'react';

/** Boissons : jus de fruits pressé et sa tranche d'orange. */
const DrinkArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#FDF4EC" />
        <circle cx="60" cy="54" r="44" fill="#FAE4CF" opacity="0.85" />
        <circle cx="268" cy="182" r="44" fill="#F4C7A0" opacity="0.35" />
        <circle cx="270" cy="48" r="6" fill="#E58C48" opacity="0.6" />

        <g>
            <ellipse cx="150" cy="182" rx="74" ry="11" fill="#C9AE87" opacity="0.28" />

            {/* Verre */}
            <path d="M108 56h84l-10 118a12 12 0 0 1-12 11h-40a12 12 0 0 1-12-11z" fill="#F4EEE4" opacity="0.8" />
            <path d="M113 88h74l-8 86a12 12 0 0 1-12 11h-34a12 12 0 0 1-12-11z" fill="#E58C48" />
            <path d="M113 88h74l-2 20h-70z" fill="#EDA870" />
            <path d="M108 56h84l-10 118a12 12 0 0 1-12 11h-40a12 12 0 0 1-12-11z" fill="none" stroke="#9B4717" strokeWidth="4" strokeLinejoin="round" />
            <path d="M126 104l-4 62" stroke="#FBF8F3" strokeWidth="5" strokeLinecap="round" opacity="0.5" />

            {/* Paille */}
            <path d="M166 42l-14 58" stroke="#2E5C44" strokeWidth="9" strokeLinecap="round" />
            <path d="M166 42l-14 58" stroke="#8CB699" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 9" />

            {/* Tranche d'orange */}
            <g transform="translate(206 74)">
                <circle r="26" fill="#EDA870" stroke="#BE5B1C" strokeWidth="4" />
                <circle r="19" fill="#F4C7A0" />
                {Array.from({ length: 8 }).map((_, i) => (
                    <path key={i} d="M0 0l8-17a19 19 0 0 0-16 0z" fill="#E58C48" transform={`rotate(${i * 45})`} />
                ))}
            </g>

            {/* Feuille de menthe */}
            <path d="M96 66c-14-6-22-18-20-30 13-2 25 6 30 18z" fill="#629674" />
        </g>
    </svg>
);

export default DrinkArt;
