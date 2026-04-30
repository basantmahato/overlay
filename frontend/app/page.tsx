'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Trusted By Section */}
        <div className="py-10 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mb-6">Trusted by 10,000+ broadcasters</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale brightness-200">
              <span className="text-xl font-black italic tracking-tighter">TWITCH</span>
              <span className="text-xl font-black italic tracking-tighter">YOUTUBE</span>
              <span className="text-xl font-black italic tracking-tighter">FACEBOOK</span>
              <span className="text-xl font-black italic tracking-tighter">KICK</span>
              <span className="text-xl font-black italic tracking-tighter">OBS STUDIO</span>
            </div>
          </div>
        </div>

        <Features />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 -z-10" />
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your stream?</h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Join thousands of creators who are already using Overlay.io to engage their audience like never before.
            </p>
            <a 
              href="/login" 
              className="inline-flex px-10 py-5 rounded-2xl premium-gradient text-white font-extrabold text-xl shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-transform"
            >
              Start Free Today
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
