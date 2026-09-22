import React from 'react';

/** Boissons chaudes : gobelet à emporter. */
const CoffeeArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#F4EEE4" />
        <circle cx="62" cy="52" r="44" fill="#E7DFD1" opacity="0.9" />
        <circle cx="268" cy="184" r="44" fill="#E8D5B5" opacity="0.5" />
        <circle cx="272" cy="46" r="6" fill="#C9AE87" opacity="0.6" />

        <g>
            <ellipse cx="160" cy="184" rx="66" ry="10" fill="#C9AE87" opacity="0.3" />

            {/* Vapeur */}
            <g stroke="#C9AE87" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.55">
                <path d="M140 46c8-8 0-16 6-24" />
                <path d="M162 40c8-8 0-16 6-24" />
                <path d="M184 46c8-8 0-16 6-24" />
            </g>

            {/* Gobelet */}
            <path d="M112 90h96l-12 88a10 10 0 0 1-10 9h-52a10 10 0 0 1-10-9z" fill="#FBF8F3" stroke="#2E5C44" strokeWidth="4" strokeLinejoin="round" />
            <rect x="106" y="74" width="108" height="20" rx="8" fill="#2E5C44" />
            <rect x="122" y="66" width="76" height="12" rx="6" fill="#427658" />

            {/* Manchon carton */}
            <path d="M118 118h84l-5 34h-74z" fill="#E3BC7C" stroke="#B5813D" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="160" cy="135" r="11" fill="#2E5C44" />
            <path d="M155 135l4 4 7-8" stroke="#FBF8F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Grains */}
            <ellipse cx="248" cy="150" rx="11" ry="7.5" transform="rotate(-22 248 150)" fill="#79370F" opacity="0.5" />
            <ellipse cx="70" cy="140" rx="10" ry="7" transform="rotate(18 70 140)" fill="#79370F" opacity="0.4" />
        </g>
    </svg>
);

export default CoffeeArt;
