import React from 'react';

/**
 * Illustration principale de la landing page : la devanture de l'épicerie avec
 * un sac de courses préparé posé devant. Tout est vectoriel (aucune image
 * binaire à charger) et utilise directement les couleurs de la palette.
 */
const StorefrontScene = ({ className = '' }) => (
    <svg
        viewBox="0 0 520 440"
        className={className}
        role="img"
        aria-label="Devanture d'épicerie avec un sac de courses prêt à être retiré"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <clipPath id="storefront-awning">
                <path d="M96 130a16 16 0 0 1 16-16h296a16 16 0 0 1 16 16v34H96z" />
                <circle cx="116" cy="164" r="20" />
                <circle cx="156" cy="164" r="20" />
                <circle cx="196" cy="164" r="20" />
                <circle cx="236" cy="164" r="20" />
                <circle cx="276" cy="164" r="20" />
                <circle cx="316" cy="164" r="20" />
                <circle cx="356" cy="164" r="20" />
                <circle cx="396" cy="164" r="20" />
            </clipPath>
            <linearGradient id="storefront-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DCE9DF" />
                <stop offset="100%" stopColor="#F0F5F1" />
            </linearGradient>
        </defs>

        {/* Fond : halo et anneau pointillé */}
        <circle cx="260" cy="205" r="190" fill="url(#storefront-sky)" />
        <circle
            cx="260"
            cy="205"
            r="205"
            fill="none"
            stroke="#B7D2BF"
            strokeWidth="2"
            strokeDasharray="3 12"
            strokeLinecap="round"
        />
        <circle cx="428" cy="96" r="11" fill="#F4C7A0" />
        <circle cx="86" cy="266" r="7" fill="#8CB699" />
        <circle cx="448" cy="284" r="5" fill="#E58C48" />

        {/* Façade */}
        <rect x="108" y="62" width="304" height="272" rx="18" fill="#FBF8F3" />
        <rect
            x="108"
            y="62"
            width="304"
            height="272"
            rx="18"
            fill="none"
            stroke="#E7DFD1"
            strokeWidth="3"
        />

        {/* Enseigne */}
        <rect x="176" y="76" width="168" height="30" rx="10" fill="#244936" />
        <text
            x="260"
            y="97"
            textAnchor="middle"
            fontFamily="Fraunces, serif"
            fontSize="17"
            fontWeight="600"
            fill="#F0F5F1"
        >
            Épicerie
        </text>

        {/* Store banne rayé */}
        <g clipPath="url(#storefront-awning)">
            <rect x="96" y="114" width="320" height="72" fill="#EFE3D2" />
            <rect x="96" y="114" width="40" height="72" fill="#2E5C44" />
            <rect x="176" y="114" width="40" height="72" fill="#2E5C44" />
            <rect x="256" y="114" width="40" height="72" fill="#2E5C44" />
            <rect x="336" y="114" width="40" height="72" fill="#2E5C44" />
        </g>
        <rect x="96" y="110" width="320" height="10" rx="5" fill="#1C3A2B" />

        {/* Vitrine gauche : cagettes de produits */}
        <rect x="140" y="196" width="82" height="76" rx="10" fill="#EAF1EC" />
        <rect x="140" y="196" width="82" height="76" rx="10" fill="none" stroke="#D2C7B5" strokeWidth="2.5" />
        <rect x="150" y="236" width="62" height="28" rx="5" fill="#E8D5B5" />
        <path d="M150 246h62" stroke="#D2BB95" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="163" cy="228" r="10" fill="#C4452F" />
        <circle cx="184" cy="224" r="12" fill="#E58C48" />
        <circle cx="204" cy="229" r="9" fill="#8CB699" />

        {/* Vitrine droite : miches de pain */}
        <rect x="298" y="196" width="82" height="76" rx="10" fill="#EAF1EC" />
        <rect x="298" y="196" width="82" height="76" rx="10" fill="none" stroke="#D2C7B5" strokeWidth="2.5" />
        <rect x="308" y="236" width="62" height="28" rx="5" fill="#E8D5B5" />
        <path d="M308 246h62" stroke="#D2BB95" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="310" y="214" width="58" height="17" rx="8.5" fill="#D9A56A" />
        <rect x="316" y="200" width="46" height="15" rx="7.5" fill="#E5BC8A" />

        {/* Porte */}
        <rect x="232" y="204" width="56" height="130" rx="10" fill="#2E5C44" />
        <rect x="240" y="214" width="40" height="46" rx="8" fill="#4B7C60" />
        <circle cx="276" cy="286" r="4" fill="#DCE9DF" />

        {/* Marche */}
        <rect x="100" y="330" width="320" height="14" rx="7" fill="#E7DFD1" />

        {/* Ombre portée du sac */}
        <ellipse cx="262" cy="396" rx="112" ry="15" fill="#D2C7B5" opacity="0.55" />

        {/* Sac de courses en papier kraft */}
        <path d="M186 262h152l-14 124a10 10 0 0 1-10 9H210a10 10 0 0 1-10-9z" fill="#E8D5B5" />
        <path d="M262 262h76l-14 124a10 10 0 0 1-10 9h-52z" fill="#DCC5A2" />
        <path
            d="M222 276l-7 116M302 276l7 116"
            fill="none"
            stroke="#D2BB95"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
        />
        {/* Contenu qui dépasse : baguette, bouteille, salade */}
        <rect
            x="196"
            y="176"
            width="20"
            height="86"
            rx="10"
            fill="#D9A56A"
            transform="rotate(-16 206 219)"
        />
        <path
            d="M191 196l6-4M197 209l6-4M203 222l6-4"
            stroke="#B5834B"
            strokeWidth="3"
            strokeLinecap="round"
        />
        <rect x="234" y="200" width="24" height="62" rx="9" fill="#4B7C60" />
        <rect x="240" y="192" width="12" height="16" rx="6" fill="#2E5C44" />
        <circle cx="288" cy="222" r="20" fill="#8CB699" />
        <circle cx="308" cy="234" r="15" fill="#A9C7B2" />
        <circle cx="274" cy="238" r="13" fill="#A9C7B2" />
        <path d="M288 222v40" stroke="#4B7C60" strokeWidth="4" strokeLinecap="round" />

        {/* Rabat du sac : dessiné après le contenu pour que les produits
            sortent bien de l'intérieur du sac */}
        <rect x="182" y="246" width="160" height="26" rx="9" fill="#F2E6D0" />
        <path d="M188 272h146" stroke="#D2BB95" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

        {/* Étiquette "prêt" sur le sac */}
        <circle cx="240" cy="322" r="22" fill="#FBF8F3" />
        <path
            d="M230 322l7 8 14-16"
            fill="none"
            stroke="#2E5C44"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Pomme posée au sol */}
        <circle cx="378" cy="378" r="20" fill="#C4452F" />
        <path d="M378 358c6-8 14-9 18-7-2 7-9 10-18 7z" fill="#8CB699" />
        <ellipse cx="378" cy="396" rx="24" ry="5" fill="#D2C7B5" opacity="0.6" />
    </svg>
);

export default StorefrontScene;
