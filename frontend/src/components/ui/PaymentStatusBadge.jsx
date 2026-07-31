import React from 'react';

const PAYMENT_STATUS_STYLES = {
    AWAITING_PAYMENT: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    PAID: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    FAILED: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const PAYMENT_STATUS_LABELS = {
    AWAITING_PAYMENT: 'Paiement en attente',
    PAID: 'Payé',
    FAILED: 'Paiement échoué',
};

const PaymentStatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${PAYMENT_STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
        {PAYMENT_STATUS_LABELS[status] || status}
    </span>
);

export default PaymentStatusBadge;
