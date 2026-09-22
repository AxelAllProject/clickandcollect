import React from 'react';

/** Pâtisserie : éclair glacé au chocolat sur son assiette. */
const EclairArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#F4EEE4" />
        <circle cx="264" cy="48" r="46" fill="#E7DFD1" opacity="0.9" />
        <circle cx="48" cy="176" r="40" fill="#E8D5B5" opacity="0.45" />
        <circle cx="52" cy="44" r="6" fill="#C9AE87" opacity="0.6" />

        <g transform="translate(0 4)">
            {/* Assiette */}
            <ellipse cx="160" cy="150" rx="106" ry="30" fill="#FBF8F3" stroke="#D2C7B5" strokeWidth="3" />
            <ellipse cx="160" cy="146" rx="80" ry="20" fill="#F4EEE4" />

            {/* Choux */}
            <rect x="62" y="96" width="196" height="46" rx="23" fill="#E3BC7C" />
            <rect x="62" y="96" width="196" height="46" rx="23" fill="none" stroke="#B5813D" strokeWidth="3" />
            <path d="M84 132h152" stroke="#C98F3C" strokeWidth="3" strokeLinecap="round" />

            {/* Glaçage chocolat */}
            <path d="M68 100c0-8 8-14 18-14h148c10 0 18 6 18 14 0 10-10 12-18 10-10-2-16 6-26 6s-14-8-24-8-14 8-24 8-16-8-26-6c-8 2-18 0-18-10z" fill="#5B2A11" />
            <path d="M84 96c10-4 22-6 36-6" stroke="#9B4717" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />

            {/* Éclats */}
            <circle cx="126" cy="98" r="3" fill="#FAE4CF" opacity="0.8" />
            <circle cx="196" cy="102" r="2.5" fill="#FAE4CF" opacity="0.7" />
            <circle cx="164" cy="94" r="2.5" fill="#FAE4CF" opacity="0.6" />

            {/* Grains de café décoratifs */}
            <ellipse cx="270" cy="168" rx="9" ry="6" transform="rotate(-20 270 168)" fill="#79370F" opacity="0.5" />
            <ellipse cx="50" cy="150" rx="8" ry="5.5" transform="rotate(16 50 150)" fill="#79370F" opacity="0.4" />
        </g>
    </svg>
);

export default EclairArt;
