import React, { useEffect, useRef, useState } from 'react';

/**
 * Révèle son contenu quand il entre dans le viewport.
 *
 * On s'appuie sur IntersectionObserver (natif, pas de librairie) : le CSS de
 * index.css gère l'opacité et la translation, ce composant se contente
 * d'ajouter .is-visible au bon moment.
 *
 *   <Reveal direction="left" delay={120}>...</Reveal>
 *
 * L'observation est retirée après le premier déclenchement : une section déjà
 * vue ne doit pas re-disparaître si l'utilisateur remonte.
 */
const Reveal = ({
    as: Tag = 'div',
    direction = 'up',
    delay = 0,
    threshold = 0.15,
    className = '',
    style,
    children,
    ...props
}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Garde-fou : navigateur sans IntersectionObserver -> on affiche tout.
        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);

    return (
        <Tag
            ref={ref}
            className={`reveal reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`}
            style={{ '--reveal-delay': `${delay}ms`, ...style }}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
