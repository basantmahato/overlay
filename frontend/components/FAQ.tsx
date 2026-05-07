'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "Why are professional overlays important for my stream?",
    answer: "Professional overlays allow creators to reach and engage with a wider audience, generate leads, drive stream traffic, and increase brand visibility. It provides measurable results, allows for targeted engagement efforts, and enables broadcasters to adapt and optimize their strategies based on real-time data and insights."
  },
  {
    question: "How can overlays help improve my stream's visibility?",
    answer: "Overlays provide visual hooks and professional polish that catch viewers' attention in browse pages. Interactive elements like goal bars and sub-alerts encourage sharing and longer watch times, which boosts your standing in platform algorithms."
  },
  {
    question: "How long does it take to set up my first overlay?",
    answer: "With MAC, you can go live with your first overlay in under 5 minutes. Simply choose a template, customize your data sources, and paste the browser source URL into OBS or your preferred broadcast software."
  },
  {
    question: "How do you measure the success of an overlay?",
    answer: "We provide built-in analytics that track viewer interaction, click-through rates on overlay elements, and overall engagement spikes during specific events. This data helps you understand what captures your audience's attention."
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
  <div className="border-t border-zinc-200 py-6 last:border-b">
    <button 
      onClick={onClick}
      className="w-full flex justify-between items-center text-left gap-8 group"
    >
      <span className="text-xl md:text-2xl font-bold text-zinc-900 group-hover:text-black transition-colors leading-tight">
        {question}
      </span>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isOpen ? <Minus size={24} className="text-zinc-900" /> : <Plus size={24} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="pt-6 text-zinc-500 text-base md:text-lg leading-relaxed max-w-3xl">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-white" id="faq">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 bg-zinc-50/30 rounded-[3rem] p-12 md:p-20 border border-zinc-100/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column */}
          <div className="lg:col-span-5">
            <h2 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-8 tracking-tight">
              Overlay & <br />Streaming FAQs
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-md">
              Everything you need to know about setting up and managing your professional overlays to elevate your broadcast.
            </p>
            
            <div className="flex items-center gap-8">
              <Link 
                href="/questions" 
                className="px-8 py-4 rounded-full border-2 border-zinc-200 text-zinc-900 font-bold hover:bg-zinc-50 transition-all shadow-sm"
              >
                More Questions
              </Link>
              <Link 
                href="/contact" 
                className="text-lg font-bold text-zinc-900 border-b-2 border-zinc-900 pb-0.5 hover:text-zinc-600 hover:border-zinc-400 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-7">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
