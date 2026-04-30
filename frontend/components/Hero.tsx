'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Play, LayoutDashboard } from 'lucide-react';

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8">
            <Zap size={14} />
            Next-Gen Broadcast Tools
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Real-Time Overlays for <br />
            <span className="premium-text-gradient">Professional Streamers</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10 leading-relaxed">
            Take your production to the next level with interactive, data-driven overlays. 
            Built for OBS, Vix, and major streaming platforms. Zero lag, full control.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href={isLoggedIn ? "/dashboard" : "/register"} 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started for Free'}
              {isLoggedIn ? <LayoutDashboard size={18} /> : <Play size={18} className="group-hover:translate-x-1 transition-transform" />}
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 font-bold hover:bg-zinc-800 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>
 
        {/* Hero Image Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10" />
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/10">
            <Image 
              src="/hero.png" 
              alt="Overlay Dashboard Mockup" 
              width={1200} 
              height={800}
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
