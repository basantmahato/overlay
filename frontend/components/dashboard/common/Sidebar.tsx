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
  ];

  const SidebarContent = (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col relative z-50">
      <div className="p-6 flex items-center justify-between md:hidden">
        <button 
          onClick={onClose} 
          className="text-muted-foreground hover:text-foreground p-1 transition-colors ml-auto"
          title="Close Sidebar"
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-foreground text-background shadow-lg shadow-black/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <div className={isActive ? 'text-background' : 'text-muted-foreground'}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Pro Plan</p>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">You have unlimited access to all templates and overlays.</p>
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
