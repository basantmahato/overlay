'use client';

import { Tv, CodeXml, Bird, Link2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Tv className="text-indigo-500 w-6 h-6" />
              <span className="text-lg font-bold tracking-tighter">Overlay.io</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Empowering streamers with professional-grade broadcast tools. Built by creators, for creators.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-300">Product</h5>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-300">Resources</h5>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-300">Connect</h5>
            <div className="flex gap-4">
              <a href="#" title="Twitter / X" aria-label="Twitter / X" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                <Bird size={18} />
              </a>
              <a href="#" title="GitHub" aria-label="GitHub" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                <CodeXml size={18} />
              </a>
              <a href="#" title="LinkedIn" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                <Link2 size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Overlay.io Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
