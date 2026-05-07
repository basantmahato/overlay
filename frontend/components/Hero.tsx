'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-[80px] font-bold leading-[1.05] tracking-tight text-zinc-900 mb-8">
              Stay ahead of the <br />
              game with our <br />
              real-time overlays
            </h1>
            
            <p className="text-zinc-500 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-medium">
              The ultimate management system for professional streamers. Control your scoreboards, alerts, and dynamic content with zero latency.
            </p>

            <div className="flex flex-wrap items-center gap-8 mb-16">
              <Link 
                href="/register" 
                className="px-10 py-5 rounded-full bg-[#0f172a] text-white font-bold text-lg hover:bg-black transition-all flex items-center gap-3 group shadow-xl shadow-black/5"
              >
                Start Streaming
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/templates" 
                className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-900 pb-0.5 hover:text-zinc-600 hover:border-zinc-400 transition-all"
              >
                Explore Templates
              </Link>
            </div>

            {/* Trusted Brands */}
            <div className="pt-8 border-t border-zinc-100">
              <p className="text-sm font-bold text-zinc-400 mb-6 uppercase tracking-wider">Trusted by the world's biggest broadcasters</p>
              <div className="flex flex-wrap items-center gap-10 opacity-60 grayscale brightness-0">
                <span className="text-2xl font-black tracking-tighter">TWITCH</span>
                <span className="text-2xl font-black tracking-tighter">YOUTUBE</span>
                <span className="text-2xl font-black tracking-tighter">KICK</span>
                <span className="text-2xl font-black tracking-tighter italic font-serif">OBS</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-12 gap-6 items-end">
              {/* Top Left: Quarter Circle */}
              <div className="col-span-7 relative">
                <div className="aspect-square bg-zinc-200 rounded-tr-[100%] relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                    className="absolute -top-6 -right-6 w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center text-[#a3e635] shadow-2xl"
                  >
                    <TrendingUp size={32} />
                  </motion.div>
                </div>
              </div>

              {/* Top Right: Statistics Card */}
              <div className="col-span-5">
                <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 shadow-sm">
                  <span className="text-5xl font-bold text-zinc-900 mb-4 block tracking-tighter">500+</span>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6">
                    premium templates used by top creators every day
                  </p>
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-zinc-900" 
                    />
                  </div>
                </div>
              </div>

              {/* Bottom: Rectangular Card */}
              <div className="col-span-12">
                <div className="bg-[#09090b] p-8 rounded-[2.5rem] flex items-center justify-between overflow-hidden relative group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-px bg-zinc-600" />
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Real-time Stream Control</span>
                    </div>
                    <h3 className="text-white text-4xl font-bold tracking-tight leading-tight">
                      Control more events <br />
                      and professional overlays
                    </h3>
                  </div>

                  {/* Bar Chart Visual */}
                  <div className="flex items-end gap-3 h-24 relative z-10">
                    <motion.div 
                      initial={{ height: 0 }} 
                      whileInView={{ height: "40%" }} 
                      className="w-10 bg-[#a3e635] rounded-t-sm" 
                    />
                    <motion.div 
                      initial={{ height: 0 }} 
                      whileInView={{ height: "70%" }} 
                      className="w-10 bg-[#a3e635] rounded-t-sm" 
                    />
                    <motion.div 
                      initial={{ height: 0 }} 
                      whileInView={{ height: "100%" }} 
                      className="w-10 bg-[#a3e635] rounded-t-sm" 
                    />
                  </div>
                  
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
