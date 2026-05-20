'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Process() {
  return (
    <section id="process" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-xl">
            Provide the best broadcast experience with out of the box overlays
          </h2>
          <p className="text-muted-foreground text-[15px] font-medium leading-relaxed max-w-lg pt-2">
            We are a passionate team of streaming enthusiasts dedicated to helping creators succeed in the digital world. With years of experience and a deep understanding of the ever-evolving broadcast landscape, we stay at the forefront of industry trends and technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-card rounded-[2.5rem] p-10 flex flex-col justify-between h-[400px] relative overflow-hidden group border border-border"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-6xl font-bold text-foreground tracking-tighter">920</span>
                <span className="text-6xl font-bold text-primary tracking-tighter">+</span>
              </div>
              <p className="text-muted-foreground text-lg font-medium">Streamers using MAC overlays</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-muted border-4 border-card" />
                ))}
              </div>
              <div className="w-12 h-12 rounded-full bg-transparent border-2 border-muted flex items-center justify-center text-foreground text-xl font-bold">
                +
              </div>
            </div>

            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-foreground/10 transition-colors" />
          </motion.div>

          {/* Video/Work Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-muted rounded-[2.5rem] h-[400px] relative flex items-center justify-center overflow-hidden group border border-border"
          >
            <span className="text-foreground text-6xl md:text-8xl font-black tracking-[0.2em] opacity-10 select-none">
              HOW WE WORK
            </span>

            <button 
              aria-label="Play video"
              className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-primary border-[10px] border-background flex items-center justify-center text-primary-foreground shadow-2xl hover:scale-110 transition-all group-hover:rotate-12"
            >
              <Play size={32} fill="currentColor" />
            </button>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-foreground/5 transition-colors" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
