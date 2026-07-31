import React from 'react';

const StatTile = ({ icon, label, value, accent = 'bg-orange-50 text-orange-600' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-display text-2xl font-semibold text-slate-900 truncate">{value}</p>
        </div>
    </div>
);

export default StatTile;
