import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Layout as TemplateIcon, 
  Tv, LogOut, Menu, Sun, Moon
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium
      ${isActive 
        ? 'bg-secondary text-secondary-foreground' 
        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}
    `}
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4 flex flex-col gap-6 sticky top-0 h-screen bg-card">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
            <Tv className="text-background" size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">Overlay Admin</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Main Menu</div>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/users" icon={Users} label="Users" />
          <SidebarItem to="/templates" icon={TemplateIcon} label="Templates" />
          <SidebarItem to="/overlays" icon={Tv} label="Global Overlays" />
          
          <div className="mt-auto pt-4 border-t border-border flex flex-col gap-1">
            <div className="px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System</div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card sticky top-0 z-30">
          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md bg-secondary/50"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
