'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Process from '@/components/Process';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Insights from '@/components/Insights';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        
        <Process />
        
        <Features />

        <Pricing />

        <Insights />

        <FAQ />

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-zinc-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your stream?</h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Join thousands of creators who are already using Overlay.io to engage their audience like never before.
            </p>
            <a 
              href="/login" 
              className="inline-flex px-10 py-5 rounded-2xl bg-[#a3e635] text-[#0f172a] font-extrabold text-xl shadow-2xl shadow-[#a3e635]/20 hover:scale-105 transition-transform"
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
