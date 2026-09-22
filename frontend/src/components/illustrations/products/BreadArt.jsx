import React from 'react';

/** Boulangerie : pain de campagne au levain, grigné et fariné. */
const BreadArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#F4EEE4" />
        <circle cx="62" cy="48" r="46" fill="#E7DFD1" opacity="0.8" />
        <circle cx="272" cy="182" r="54" fill="#E8D5B5" opacity="0.5" />
        <circle cx="268" cy="42" r="7" fill="#C9AE87" opacity="0.6" />
        <circle cx="42" cy="168" r="5" fill="#C9AE87" opacity="0.5" />

        <g transform="translate(0 4)">
            <ellipse cx="160" cy="170" rx="96" ry="13" fill="#C9AE87" opacity="0.3" />

            {/* Miche */}
            <ellipse cx="160" cy="118" rx="98" ry="62" fill="#D8A860" />
            <ellipse cx="160" cy="112" rx="98" ry="60" fill="#E3BC7C" />
            <ellipse cx="160" cy="112" rx="98" ry="60" fill="none" stroke="#B5813D" strokeWidth="3" />

            {/* Grignes */}
            <path d="M104 96c14-12 30-18 56-18s42 6 56 18" stroke="#B5813D" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M96 118c16-10 36-15 64-15s48 5 64 15" stroke="#B5813D" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M110 140c14-8 30-12 50-12s36 4 50 12" stroke="#B5813D" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Farine */}
            <circle cx="128" cy="86" r="3.5" fill="#FBF8F3" opacity="0.85" />
            <circle cx="196" cy="92" r="3" fill="#FBF8F3" opacity="0.7" />
            <circle cx="160" cy="78" r="4" fill="#FBF8F3" opacity="0.8" />

            {/* Épi de blé */}
            <g transform="translate(284 150) rotate(14 0 0)">
                <path d="M0 26V-44" stroke="#C9AE87" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <g fill="#D8A860">
                    <ellipse cx="9" cy="-14" rx="5.5" ry="9" transform="rotate(28 9 -14)" />
                    <ellipse cx="-9" cy="-14" rx="5.5" ry="9" transform="rotate(-28 -9 -14)" />
                    <ellipse cx="9" cy="-28" rx="5.5" ry="9" transform="rotate(28 9 -28)" />
                    <ellipse cx="-9" cy="-28" rx="5.5" ry="9" transform="rotate(-28 -9 -28)" />
                    <ellipse cx="0" cy="-44" rx="5.5" ry="10" />
                </g>
            </g>
        </g>
    </svg>
);

export default BreadArt;
