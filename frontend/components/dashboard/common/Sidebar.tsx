'use client';

import Link from 'next/link';
import { Layout, Settings, Layers, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}

export const Sidebar = ({ 
  isOpen,
  onClose,
  activePath
}: SidebarProps) => {
  
  const navItems = [
    { name: 'Overlays', icon: <Layers size={18} />, href: '/dashboard/overlays' },
    { name: 'Templates', icon: <Layout size={18} />, href: '/dashboard/templates' },
    { name: 'Settings', icon: <Settings size={18} />, href: '/dashboard/settings' },
  ];

  const SidebarContent = (
    <div className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col relative z-50">
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Main Menu</span>
        <button 
          onClick={onClose} 
          className="md:hidden text-zinc-500 hover:text-white p-1"
          title="Close Sidebar"
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {item.icon}
              <span className="font-semibold text-sm">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Pro Plan</p>
          <p className="text-xs text-zinc-500 leading-relaxed">You have unlimited access to all templates.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] md:hidden"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {SidebarContent}
      </div>
    </>
  );
};
