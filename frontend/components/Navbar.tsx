'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, Sun, Moon } from 'lucide-react';

const NavItem = ({ label, sectionId, hasDropdown = true, onClick }: { label: string, sectionId?: string, hasDropdown?: boolean, onClick?: (id: string) => void }) => (
  <button 
    onClick={() => sectionId && onClick?.(sectionId)}
    className="flex items-center gap-1 cursor-pointer group outline-none"
  >
    <span className="text-[14px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
      {label}
    </span>
    {hasDropdown && <ChevronDown size={14} className="text-muted-foreground/60 group-hover:text-foreground transition-colors" />}
  </button>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-7 h-7 bg-primary rounded-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0f172a] rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              MAC
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavItem label="Agency" sectionId="process" onClick={scrollToSection} />
            <NavItem label="Service" sectionId="features" onClick={scrollToSection} />
            <NavItem label="Pricing" sectionId="pricing" hasDropdown={false} onClick={scrollToSection} />
            <NavItem label="Case study" sectionId="insights" onClick={scrollToSection} />
            <NavItem label="Resources" sectionId="faq" onClick={scrollToSection} />
            <NavItem label="Contact" sectionId="contact" hasDropdown={false} onClick={scrollToSection} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link 
              href={isLoggedIn ? "/dashboard" : "/login"} 
              className="px-6 py-2 rounded-full text-[14px] font-semibold border border-border text-foreground hover:bg-muted transition-all"
            >
              {isLoggedIn ? 'Dashboard' : 'Sign In'}
            </Link>
            
            <button 
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-white hover:bg-black transition-all shadow-md"
            >
              <Bell size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
