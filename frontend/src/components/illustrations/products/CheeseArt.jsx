import React from 'react';

/** Crèmerie : plateau de fromages fermiers. */
const CheeseArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#F4EEE4" />
        <circle cx="58" cy="48" r="42" fill="#E7DFD1" opacity="0.9" />
        <circle cx="272" cy="180" r="46" fill="#E8D5B5" opacity="0.5" />
        <circle cx="274" cy="44" r="6" fill="#C9AE87" opacity="0.6" />

        <g>
            {/* Planche */}
            <rect x="44" y="152" width="232" height="24" rx="12" fill="#C9AE87" />
            <rect x="44" y="152" width="232" height="24" rx="12" fill="none" stroke="#9E7C46" strokeWidth="3" />
            <path d="M72 164h176" stroke="#9E7C46" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

            {/* Grosse part de meule */}
            <path d="M104 152L206 56c14 22 20 42 20 60 0 14-2 26-6 36z" fill="#F0D08C" stroke="#C98F3C" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M206 56c14 22 20 42 20 60 0 14-2 26-6 36l-14 4c5-13 8-27 8-42 0-20-4-39-12-56z" fill="#E3BC7C" stroke="#C98F3C" strokeWidth="3.5" strokeLinejoin="round" />
            <g fill="#D9B061">
                <circle cx="160" cy="122" r="9" />
                <circle cx="186" cy="94" r="6" />
                <circle cx="134" cy="140" r="5.5" />
                <circle cx="188" cy="130" r="7" />
            </g>

            {/* Part posée devant */}
            <path d="M136 152l56-16 10 16z" fill="#FBF8F3" stroke="#C9AE87" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M170 144l8 4" stroke="#D2C7B5" strokeWidth="3" strokeLinecap="round" />

            {/* Raisins */}
            <g fill="#629674">
                <circle cx="66" cy="138" r="9" />
                <circle cx="82" cy="132" r="8" />
                <circle cx="78" cy="148" r="8" />
                <circle cx="62" cy="152" r="7" />
            </g>
            <path d="M76 122c4-7 11-9 18-7" stroke="#427658" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Noix */}
            <circle cx="248" cy="142" r="10" fill="#C9AE87" stroke="#9E7C46" strokeWidth="2.5" />
            <path d="M248 133v18M242 137c4 4 4 10 0 14M254 137c-4 4-4 10 0 14" stroke="#9E7C46" strokeWidth="2" fill="none" />
        </g>
    </svg>
);

export default CheeseArt;
