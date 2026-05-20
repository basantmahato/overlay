'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Tv, Menu, Sun, Moon } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/common/Sidebar';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center text-muted-foreground">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <nav className="flex items-center justify-between px-6 py-4 bg-card border-b border-border backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSideBarOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 bg-primary rounded-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0f172a] rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">MAC</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors">
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isOpen={sideBarOpen}
          onClose={() => setSideBarOpen(false)}
          activePath={pathname}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
