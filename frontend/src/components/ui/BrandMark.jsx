import React from 'react';

/**
 * Monogramme de la marque : le cabas de retrait coché, repris du favicon.
 * Dessiné en currentColor pour se poser indifféremment sur la pastille verte
 * de la navbar, le footer sombre ou un fond crème.
 */
const BrandMark = ({ size = 18, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        role="img"
        aria-label="Click & Collect"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.5 8h15l-1.4 11.1a2.6 2.6 0 0 1-2.6 2.3H8.5a2.6 2.6 0 0 1-2.6-2.3z"
            fill="currentColor"
            opacity="0.18"
        />
        <path
            d="M4.5 8h15l-1.4 11.1a2.6 2.6 0 0 1-2.6 2.3H8.5a2.6 2.6 0 0 1-2.6-2.3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
        <path
            d="M8.8 9V6.4a3.2 3.2 0 0 1 6.4 0V9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />
        <path
            d="M9.3 14.6l2 2.1 3.6-3.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default BrandMark;
