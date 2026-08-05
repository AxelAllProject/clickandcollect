import React from 'react';

/**
 * Carte stylisée de la section "points relais". Les épingles sont animées via
 * la classe animate-float appliquée depuis la page (décalage par index).
 */
const PickupMapArt = ({ className = '' }) => (
    <svg
        viewBox="0 0 440 320"
        className={className}
        role="img"
        aria-label="Carte stylisée avec les points relais de retrait"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <clipPath id="pickup-map-frame">
                <rect x="10" y="10" width="420" height="300" rx="26" />
            </clipPath>
        </defs>

        <g clipPath="url(#pickup-map-frame)">
            <rect x="10" y="10" width="420" height="300" fill="#F0F5F1" />

            {/* Parcs */}
            <rect x="26" y="30" width="120" height="86" rx="18" fill="#DCE9DF" />
            <rect x="288" y="196" width="132" height="100" rx="20" fill="#DCE9DF" />
            <circle cx="86" cy="73" r="16" fill="#B7D2BF" />
            <circle cx="352" cy="244" r="20" fill="#B7D2BF" />

            {/* Rivière */}
            <path
                d="M-10 232c70-14 104 22 168 8s96-52 160-34 92 6 132-6"
                fill="none"
                stroke="#B7D2BF"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.7"
            />

            {/* Routes */}
            <path d="M10 148h420M168 10v300M312 10v300M10 74h150M250 258h180" fill="none" stroke="#FBF8F3" strokeWidth="16" />
            <path
                d="M10 148h420M168 10v300"
                fill="none"
                stroke="#D2C7B5"
                strokeWidth="2.5"
                strokeDasharray="10 12"
            />

            {/* Îlots de bâtiments */}
            <rect x="192" y="42" width="42" height="34" rx="7" fill="#E7DFD1" />
            <rect x="244" y="52" width="52" height="24" rx="7" fill="#E7DFD1" />
            <rect x="196" y="96" width="96" height="30" rx="8" fill="#E7DFD1" />
            <rect x="36" y="176" width="102" height="42" rx="10" fill="#E7DFD1" />
            <rect x="36" y="238" width="60" height="34" rx="9" fill="#E7DFD1" />
            <rect x="336" y="42" width="72" height="82" rx="12" fill="#E7DFD1" />
        </g>

        <rect x="10" y="10" width="420" height="300" rx="26" fill="none" stroke="#E7DFD1" strokeWidth="3" />
    </svg>
);

/** Épingle réutilisable, positionnée en absolu au-dessus de la carte. */
export const MapPin = ({ className = '', active = false, ...props }) => (
    <svg viewBox="0 0 40 52" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" {...props}>
        <ellipse cx="20" cy="48" rx="10" ry="3.5" fill="#4D453A" opacity="0.22" />
        <path
            d="M20 2c9.94 0 18 7.9 18 17.65C38 32.3 24.6 43.4 21.5 45.8a2.5 2.5 0 0 1-3 0C15.4 43.4 2 32.3 2 19.65 2 9.9 10.06 2 20 2z"
            fill={active ? '#BE5B1C' : '#2E5C44'}
        />
        <circle cx="20" cy="19" r="7.5" fill="#FBF8F3" />
    </svg>
);

export default PickupMapArt;
