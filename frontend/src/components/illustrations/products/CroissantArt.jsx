import React from 'react';

/** Viennoiserie : croissant feuilleté posé sur un fond crème. */
const CroissantArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#FDF4EC" />
        <circle cx="258" cy="46" r="52" fill="#FAE4CF" opacity="0.7" />
        <circle cx="52" cy="184" r="40" fill="#F4C7A0" opacity="0.35" />
        <circle cx="46" cy="44" r="6" fill="#EDA870" opacity="0.7" />
        <circle cx="286" cy="176" r="9" fill="#EDA870" opacity="0.45" />

        <g transform="translate(0 6)">
            {/* Ombre portée */}
            <ellipse cx="160" cy="166" rx="92" ry="12" fill="#C9AE87" opacity="0.3" />

            {/* Corps du croissant */}
            <path
                d="M62 156c0-58 44-96 98-96s98 38 98 96c0 11-14 15-21 5-20-28-46-42-77-42s-57 14-77 42c-7 10-21 6-21-5z"
                fill="#E8B96B"
            />
            <path
                d="M62 156c0-58 44-96 98-96s98 38 98 96c0 11-14 15-21 5-20-28-46-42-77-42s-57 14-77 42c-7 10-21 6-21-5z"
                fill="none"
                stroke="#C98F3C"
                strokeWidth="3"
            />

            {/* Pointes */}
            <ellipse cx="66" cy="150" rx="15" ry="11" transform="rotate(-24 66 150)" fill="#E8B96B" stroke="#C98F3C" strokeWidth="3" />
            <ellipse cx="254" cy="150" rx="15" ry="11" transform="rotate(24 254 150)" fill="#E8B96B" stroke="#C98F3C" strokeWidth="3" />

            {/* Feuilletage */}
            <path d="M104 142c8-22 18-36 26-44M139 124c4-24 6-40 6-50M181 124c-4-24-6-40-6-50M216 142c-8-22-18-36-26-44"
                stroke="#C98F3C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M120 96c10-10 24-16 40-16s30 6 40 16" stroke="#F2D9A8" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
    </svg>
);

export default CroissantArt;
