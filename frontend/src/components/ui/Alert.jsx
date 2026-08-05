import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const TONES = {
    error: { className: 'bg-red-50 border-red-200 text-red-700', Icon: AlertCircle },
    success: { className: 'bg-brand-50 border-brand-200 text-brand-700', Icon: CheckCircle2 },
    info: { className: 'bg-orange-50 border-orange-200 text-orange-800', Icon: Info },
};

/** Bandeau d'information / d'erreur, partagé par les formulaires. */
const Alert = ({ tone = 'error', className = '', children }) => {
    const { className: toneClass, Icon } = TONES[tone] || TONES.error;

    return (
        <div className={`flex items-start gap-2.5 border rounded-xl p-3.5 text-sm ${toneClass} ${className}`}>
            <Icon size={16} className="flex-shrink-0 mt-0.5" />
            <span>{children}</span>
        </div>
    );
};

export default Alert;
