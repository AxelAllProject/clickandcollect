import React from 'react';

const VARIANTS = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm disabled:hover:bg-orange-600',
    secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:hover:bg-white',
    ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:hover:bg-transparent',
    danger: 'text-red-600 hover:bg-red-50 disabled:hover:bg-transparent',
};

const SIZES = {
    sm: 'text-sm px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 rounded-lg',
    lg: 'text-base px-6 py-3 rounded-xl',
};

const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => (
    <button
        className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default Button;
