import React from 'react';

const STATUS_STYLES = {
    PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    READY: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    COMPLETED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export const STATUS_OPTIONS = ['PENDING', 'READY', 'COMPLETED', 'CANCELLED'];

const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
        {status}
    </span>
);

export default StatusBadge;
