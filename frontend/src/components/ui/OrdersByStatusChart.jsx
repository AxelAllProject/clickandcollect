import React from 'react';
import { STATUS_OPTIONS } from './StatusBadge';

const BAR_COLORS = {
    PENDING: 'bg-amber-500',
    READY: 'bg-emerald-500',
    COMPLETED: 'bg-blue-500',
    CANCELLED: 'bg-red-500',
};

const OrdersByStatusChart = ({ counts }) => {
    const max = Math.max(1, ...STATUS_OPTIONS.map((s) => counts[s] || 0));

    return (
        <div className="flex flex-col gap-3.5">
            {STATUS_OPTIONS.map((status) => {
                const value = counts[status] || 0;
                const widthPct = (value / max) * 100;
                return (
                    <div key={status} className="flex items-center gap-3">
                        <span className="w-24 text-xs font-semibold text-slate-500 flex-shrink-0">{status}</span>
                        <div className="flex-grow bg-slate-100 rounded-full h-5 relative overflow-hidden">
                            <div
                                className={`h-full rounded-full ${BAR_COLORS[status]} transition-all duration-500`}
                                style={{ width: `${Math.max(widthPct, value > 0 ? 4 : 0)}%` }}
                            />
                        </div>
                        <span className="w-6 text-sm font-semibold text-slate-800 text-right flex-shrink-0">{value}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default OrdersByStatusChart;
