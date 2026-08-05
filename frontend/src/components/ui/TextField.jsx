import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Champ de formulaire unifié : label, aide, action à droite du label
 * (ex. "Mot de passe oublié ?") et bouton œil automatique sur les mots de passe.
 */
const TextField = ({ label, hint, action, type = 'text', className = '', ...props }) => {
    const id = useId();
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && visible ? 'text' : type;

    return (
        <div className="flex flex-col gap-1.5">
            {(label || action) && (
                <div className="flex items-center justify-between gap-3">
                    {label && (
                        <label htmlFor={id} className="text-sm font-medium text-slate-700">
                            {label}
                        </label>
                    )}
                    {action}
                </div>
            )}

            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-shadow focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 ${isPassword ? 'pr-12' : ''} ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>

            {hint && <span className="text-xs text-slate-400">{hint}</span>}
        </div>
    );
};

export default TextField;
