'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tv, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Tv className="text-indigo-500 w-8 h-8" />
            <span className="text-xl font-bold tracking-tighter premium-text-gradient">
              Overlay.io
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#templates" className="hover:text-white transition-colors">Templates</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"} 
              className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 flex items-center gap-2"
            >
              {isLoggedIn ? <><LayoutDashboard size={16} /> Dashboard</> : 'Sign In'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
