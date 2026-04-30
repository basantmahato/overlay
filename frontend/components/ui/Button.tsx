'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'warn' | 'success';
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base = 'px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    ghost: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700',
    danger: 'bg-red-600/80 hover:bg-red-500 text-white',
    warn: 'bg-amber-500 hover:bg-amber-400 text-black',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white'
  };

  return (
    <button 
      {...props} 
      className={`${base} ${variants[variant]} ${className}`} 
    />
  );
};
