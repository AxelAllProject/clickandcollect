import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Fenetre glissante de 5 numeros de page autour de la page courante.
const pageWindow = (page, totalPages) => {
    const start = Math.max(0, Math.min(page - 2, totalPages - 5));
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);
};

const Pagination = ({ page, totalPages, totalElements, onPageChange, label = 'résultat', accent = 'indigo' }) => {
    if (totalPages <= 1) return null;

    const activeClass = accent === 'orange'
        ? 'bg-orange-600 text-white border-orange-600'
        : 'bg-indigo-600 text-white border-indigo-600';

    // Changer de page ramene en haut de la liste, sinon on reste au niveau
    // du navigateur de pages et la nouvelle page semble vide.
    const goTo = (target) => {
        onPageChange(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navClass = 'flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors';

    return (
        <nav className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3" aria-label="Pagination">
            <p className="text-sm text-slate-400">
                Page {page + 1} sur {totalPages} · {totalElements} {label}{totalElements > 1 ? 's' : ''}
            </p>

            <div className="flex items-center gap-1.5 sm:ml-auto">
                <button
                    type="button"
                    onClick={() => goTo(page - 1)}
                    disabled={page === 0}
                    className={navClass}
                >
                    <ChevronLeft size={15} />
                    Précédent
                </button>

                {pageWindow(page, totalPages).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => goTo(p)}
                        aria-current={p === page ? 'page' : undefined}
                        className={`w-9 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                            p === page ? activeClass : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {p + 1}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => goTo(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={navClass}
                >
                    Suivant
                    <ChevronRight size={15} />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
