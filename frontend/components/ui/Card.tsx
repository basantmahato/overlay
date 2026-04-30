'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, title, icon, className = '' }: CardProps) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 ${className}`}>
      {title && (
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          {icon}
          {title}
        </p>
      )}
      {children}
    </div>
  );
};
