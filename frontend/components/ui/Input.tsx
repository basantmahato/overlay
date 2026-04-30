'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
      {label}
    </label>
    <input
      {...props}
      className={`px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors ${props.className ?? ''}`}
    />
  </div>
);
