import React from 'react';

/** Pâtisserie : tarte aux pommes vue de dessus, lamelles en rosace. */
const TartArt = ({ className = '' }) => (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="220" fill="#FDF4EC" />
        <circle cx="46" cy="42" r="40" fill="#FAE4CF" opacity="0.8" />
        <circle cx="286" cy="192" r="46" fill="#F4C7A0" opacity="0.4" />
        <circle cx="288" cy="40" r="6" fill="#E58C48" opacity="0.6" />

        <g transform="translate(160 112)">
            <circle cx="0" cy="8" r="92" fill="#C9AE87" opacity="0.3" />
            {/* Croûte cannelée */}
            <circle cx="0" cy="0" r="92" fill="#D8A860" />
            {Array.from({ length: 24 }).map((_, i) => (
                <circle
                    key={i}
                    cx={Math.cos((i * Math.PI) / 12) * 86}
                    cy={Math.sin((i * Math.PI) / 12) * 86}
                    r="9"
                    fill="#E3BC7C"
                />
            ))}
            <circle cx="0" cy="0" r="74" fill="#EDC98F" />
            <circle cx="0" cy="0" r="74" fill="none" stroke="#B5813D" strokeWidth="3" />

            {/* Lamelles de pommes */}
            {Array.from({ length: 10 }).map((_, i) => (
                <ellipse
                    key={i}
                    cx="0"
                    cy="-42"
                    rx="13"
                    ry="26"
                    fill="#F2D9A8"
                    stroke="#D9722B"
                    strokeWidth="2.5"
                    transform={`rotate(${i * 36})`}
                    opacity="0.95"
                />
            ))}
            <circle cx="0" cy="0" r="20" fill="#EDA870" />
            <circle cx="0" cy="0" r="20" fill="none" stroke="#BE5B1C" strokeWidth="2.5" />
            <circle cx="-5" cy="-5" r="5" fill="#FDF4EC" opacity="0.6" />
        </g>
    </svg>
);

export default TartArt;
