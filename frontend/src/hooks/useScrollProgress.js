import { useEffect, useRef, useState } from 'react';

/**
 * Renvoie [ref, progress] où progress ∈ [0, 1] décrit l'avancée du scroll
 * à travers l'élément référencé : 0 quand son haut touche le bas du viewport,
 * 1 quand son bas touche le haut du viewport.
 *
 * Sert à "dessiner" la ligne de progression de la section "Comment ça marche".
 * Le calcul est throttlé par requestAnimationFrame pour ne pas déclencher un
 * re-render à chaque événement scroll.
 */
export const useScrollProgress = () => {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        let frame = null;

        const compute = () => {
            frame = null;
            const rect = node.getBoundingClientRect();
            const viewport = window.innerHeight;
            const total = rect.height + viewport;
            if (total <= 0) return;

            const scrolled = viewport - rect.top;
            const ratio = Math.min(1, Math.max(0, scrolled / total));
            setProgress(ratio);
        };

        const onScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(compute);
        };

        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, []);

    return [ref, progress];
};

export default useScrollProgress;
