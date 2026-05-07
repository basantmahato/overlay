'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown } from 'lucide-react';

const NavItem = ({ label, hasDropdown = true }: { label: string, hasDropdown?: boolean }) => (
  <div className="flex items-center gap-1 cursor-pointer group">
    <span className="text-[14px] font-medium text-zinc-600 group-hover:text-black transition-colors">
      {label}
    </span>
    {hasDropdown && <ChevronDown size={14} className="text-zinc-400 group-hover:text-black transition-colors" />}
  </div>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-zinc-100' : 'bg-white'}`}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-7 h-7 bg-[#a3e635] rounded-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0f172a] rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0f172a]">
              MAC
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavItem label="Service" />
            <NavItem label="Agency" />
            <NavItem label="Case study" />
            <NavItem label="Resources" />
            <NavItem label="Contact" hasDropdown={false} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"} 
              className="px-6 py-2 rounded-full text-[14px] font-semibold border border-zinc-300 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 transition-all"
            >
              {isLoggedIn ? 'Dashboard' : 'Sign In'}
            </Link>
            
            <button className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-white hover:bg-black transition-all shadow-md">
              <Bell size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
