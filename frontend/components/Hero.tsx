'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-background">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-[80px] font-bold leading-[1.05] tracking-tight text-foreground mb-8">
              BROADCAST <br />
              FOOTBALL <br />
              LIKE A PRO
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-medium">
              Real-time football overlays for scoreboard, stats, goals, formations &amp; more. Built for OBS, vMix, eCamm — no downloads, zero latency.
            </p>

            <div className="flex flex-wrap items-center gap-8 mb-16">
              <Link 
                href="/register" 
                className="px-10 py-5 rounded-full bg-foreground text-background font-bold text-lg hover:opacity-90 transition-all flex items-center gap-3 group shadow-xl shadow-black/5"
              >
                Start Streaming
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/templates" 
                className="text-lg font-bold text-foreground border-b-2 border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-all"
              >
                Explore Templates
              </Link>
            </div>

            {/* Trusted Brands */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm font-bold text-muted-foreground/60 mb-6 uppercase tracking-wider">Trusted by the world's biggest broadcasters</p>
              <div className="flex flex-wrap items-center gap-10 opacity-60 grayscale dark:invert">
                <span className="text-2xl font-black tracking-tighter text-foreground">TWITCH</span>
                <span className="text-2xl font-black tracking-tighter text-foreground">YOUTUBE</span>
                <span className="text-2xl font-black tracking-tighter text-foreground">KICK</span>
                <span className="text-2xl font-black tracking-tighter italic font-serif text-foreground">OBS</span>
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
                <div className="aspect-square bg-muted rounded-tr-[100%] relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                    className="absolute -top-6 -right-6 w-20 h-20 bg-foreground rounded-full flex items-center justify-center text-primary shadow-2xl"
                  >
                    <TrendingUp size={32} />
                  </motion.div>
                </div>
              </div>

              {/* Top Right: Statistics Card */}
              <div className="col-span-5">
                <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                  <span className="text-5xl font-bold text-foreground mb-4 block tracking-tighter">500+</span>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6">
                    premium templates used by top creators every day
                  </p>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-foreground" 
                    />
                  </div>
                </div>
              </div>

              {/* Bottom: Rectangular Card */}
              <div className="col-span-12">
                <div className="bg-foreground p-8 rounded-[2.5rem] flex items-center justify-between overflow-hidden relative group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-px bg-muted-foreground/30" />
                      <span className="text-background/60 text-xs font-bold uppercase tracking-widest">Real-time Stream Control</span>
                    </div>
                    <h3 className="text-background text-4xl font-bold tracking-tight leading-tight">
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
