'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Tv, Menu } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/common/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSideBarOpen(true)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          <Tv size={20} className="text-indigo-400" />
          <span className="font-bold text-lg tracking-tight">Overlay<span className="text-indigo-400">.io</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors">
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
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
