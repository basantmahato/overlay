'use client';

import { Tv, CodeXml, Bird, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8 group">
              <div className="relative w-7 h-7 bg-primary rounded-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0f172a] rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">MAC</span>
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed font-medium">
              Empowering streamers with professional-grade broadcast tools. Built by creators, for creators.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-8 text-[13px] uppercase tracking-[0.2em] text-foreground">Product</h5>
            <ul className="space-y-4 text-[15px] text-muted-foreground font-medium">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8 text-[13px] uppercase tracking-[0.2em] text-foreground">Resources</h5>
            <ul className="space-y-4 text-[15px] text-muted-foreground font-medium">
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-8 text-[13px] uppercase tracking-[0.2em] text-foreground">Connect</h5>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted transition-all shadow-sm">
                <Bird size={18} />
              </a>
              <a href="#" aria-label="GitHub" className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted transition-all shadow-sm">
                <CodeXml size={18} />
              </a>
              <a href="#" aria-label="Website" className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted transition-all shadow-sm">
                <Link2 size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-muted-foreground font-medium">
          <div>© {new Date().getFullYear()} MAC Overlay Inc. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
