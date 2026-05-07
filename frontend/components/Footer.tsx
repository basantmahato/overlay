'use client';

import { Tv, CodeXml, Bird, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-24 border-t border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8 group">
              <div className="relative w-7 h-7 bg-[#a3e635] rounded-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0f172a] rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f172a]">MAC</span>
            </div>
            <p className="text-[15px] text-zinc-500 leading-relaxed font-medium">
              Empowering streamers with professional-grade broadcast tools. Built by creators, for creators.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-8 text-[13px] uppercase tracking-[0.2em] text-zinc-900">Product</h5>
            <ul className="space-y-4 text-[15px] text-zinc-500 font-medium">
              <li><Link href="#features" className="hover:text-black transition-colors">Features</Link></li>
              <li><Link href="/templates" className="hover:text-black transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8 text-[13px] uppercase tracking-[0.2em] text-zinc-900">Resources</h5>
            <ul className="space-y-4 text-[15px] text-zinc-500 font-medium">
              <li><Link href="#" className="hover:text-black transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8 text-[13px] uppercase tracking-[0.2em] text-zinc-900">Connect</h5>
            <div className="flex gap-4">
              <a href="#" className="w-11 h-11 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-600 hover:text-black hover:border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm">
                <Bird size={18} />
              </a>
              <a href="#" className="w-11 h-11 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-600 hover:text-black hover:border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm">
                <CodeXml size={18} />
              </a>
              <a href="#" className="w-11 h-11 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-600 hover:text-black hover:border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm">
                <Link2 size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-zinc-400 font-medium">
          <div>© {new Date().getFullYear()} MAC Overlay Inc. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
