import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Layout as TemplateIcon, 
  Tv, LogOut, Settings, Bell, Search, Menu
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
      ${isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200'}
    `}
  >
    <Icon size={20} />
    <span className="font-semibold text-sm">{label}</span>
  </NavLink>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-bg-dark">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-4">
          
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/users" icon={Users} label="User Management" />
          <SidebarItem to="/templates" icon={TemplateIcon} label="Templates" />
          <SidebarItem to="/overlays" icon={Tv} label="Global Overlays" />
          <div className="mt-auto pt-6 border-t border-white/5">
            <SidebarItem to="/settings" icon={Settings} label="Settings" />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-2"
            >
              <LogOut size={20} />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-bg-dark/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Nav elements removed */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
