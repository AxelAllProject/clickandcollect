import React from 'react';

/**
 * Illustration du panneau des pages d'authentification : une cagette de
 * produits frais. Pensée pour être posée sur le vert foncé de la marque, donc
 * dessinée en tons clairs (crème, terracotta, vert clair) sans contour sombre.
 */
const MarketCrateScene = ({ className = '' }) => (
    <svg
        viewBox="0 0 420 380"
        className={className}
        role="img"
        aria-label="Cagette remplie de produits frais du marché"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Halos de fond */}
        <circle cx="210" cy="188" r="150" fill="#FBF8F3" opacity="0.08" />
        <circle
            cx="210"
            cy="188"
            r="176"
            fill="none"
            stroke="#FBF8F3"
            strokeWidth="2"
            strokeDasharray="4 12"
            strokeLinecap="round"
            opacity="0.35"
        />
        <circle cx="352" cy="82" r="8" fill="#E58C48" opacity="0.9" />
        <circle cx="72" cy="128" r="5" fill="#B7D2BF" />
        <circle cx="88" cy="292" r="10" fill="#B7D2BF" opacity="0.5" />

        {/* Baguettes qui dépassent */}
        <g transform="rotate(-20 160 148)">
            <rect x="128" y="66" width="26" height="146" rx="13" fill="#E8D5B5" />
            <path
                d="M134 90l12-7M138 112l12-7M142 134l12-7M146 156l12-7M150 178l12-7"
                stroke="#C9AE87"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
        </g>
        <g transform="rotate(-8 186 156)">
            <rect x="174" y="86" width="24" height="132" rx="12" fill="#DCC5A2" />
            <path
                d="M180 110l11-6M184 132l11-6M188 154l11-6M192 176l11-6"
                stroke="#BFA377"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </g>

        {/* Salade */}
        <ellipse cx="256" cy="148" rx="42" ry="34" fill="#A9C7B2" />
        <ellipse cx="292" cy="168" rx="28" ry="24" fill="#8CB699" />
        <ellipse cx="228" cy="172" rx="26" ry="22" fill="#8CB699" />
        <path
            d="M256 130c-10-12-8-26 0-32 9 6 10 20 0 32z"
            fill="#B7D2BF"
        />

        {/* Agrume + tomate */}
        <circle cx="304" cy="196" r="30" fill="#E58C48" />
        <path d="M304 166c8-9 18-10 23-8-3 9-12 12-23 8z" fill="#A9C7B2" />
        <circle cx="140" cy="204" r="26" fill="#D9634A" />
        <path d="M140 178c7-7 15-8 19-6-2 7-10 10-19 6z" fill="#A9C7B2" />

        {/* Cagette */}
        <path d="M104 208h212l-20 128a14 14 0 0 1-14 12H138a14 14 0 0 1-14-12z" fill="#F0E2CA" />
        <path d="M210 208h106l-20 128a14 14 0 0 1-14 12h-72z" fill="#DCC5A2" />
        <rect x="96" y="194" width="228" height="26" rx="13" fill="#FBF8F3" />
        <path
            d="M114 254h192M120 300h180"
            stroke="#C9AE87"
            strokeWidth="6"
            strokeLinecap="round"
        />

        {/* Étiquette accrochée à la cagette */}
        <g transform="rotate(-8 210 288)">
            <rect x="168" y="262" width="84" height="52" rx="12" fill="#E58C48" />
            <path
                d="M192 288l10 11 20-22"
                fill="none"
                stroke="#FBF8F3"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>

        {/* Sol */}
        <ellipse cx="210" cy="352" rx="132" ry="14" fill="#FBF8F3" opacity="0.12" />
    </svg>
);

export default MarketCrateScene;
