import React, { useEffect, useRef, useState } from 'react';

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Compteur qui s'incrémente une seule fois, au moment où il entre à l'écran.
 * Utilisé dans la bande de chiffres de la landing page.
 */
const CountUp = ({ to, duration = 1400, decimals = 0, suffix = '', prefix = '', className = '' }) => {
    const ref = useRef(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const reduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduced || typeof IntersectionObserver === 'undefined') {
            setValue(to);
            return;
        }

        let frame = null;
        let start = null;

        const step = (timestamp) => {
            if (start === null) start = timestamp;
            const elapsed = timestamp - start;
            const ratio = Math.min(1, elapsed / duration);
            setValue(to * easeOut(ratio));
            if (ratio < 1) frame = window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    observer.disconnect();
                    frame = window.requestAnimationFrame(step);
                }
            },
            { threshold: 0.4 }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, [to, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {value.toLocaleString('fr-FR', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    );
};

export default CountUp;
