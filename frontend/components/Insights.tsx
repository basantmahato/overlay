'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const insights = [
  {
    title: "How Professional Overlays Can Boost Your Stream",
    desc: "We are the top overlay provider for professional broadcasters. We offer a full range of templates...",
    readTime: "5 min read",
    dotColor: "bg-blue-500",
    darkButton: true
  },
  {
    title: "The Latest Trends in Stream Engagement & Interaction",
    desc: "Working with professional overlays has been a true partnership for many top creators. They have taken...",
    readTime: "5 min read",
    dotColor: "bg-orange-500",
    darkButton: false
  },
  {
    title: "Maximizing Viewer Retention with Professional Graphics",
    desc: "What sets professional graphics apart is their commitment to transparency and viewer engagement...",
    readTime: "5 min read",
    dotColor: "bg-purple-500",
    darkButton: false
  }
];

export default function Insights() {
  return (
    <section className="py-32 bg-background" id="insights">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.1] max-w-2xl">
            Advanced Broadcast Tools That Grow Audience & Increase Engagement
          </h2>
          <div className="max-w-lg pt-2">
            <p className="text-muted-foreground text-[15px] font-medium leading-relaxed mb-8">
              We are the top overlay provider for professional streamers. We offer a full range of services to help creators improve their broadcast quality and drive more engagement to their streams.
            </p>
            <Link 
              href="/blog" 
              className="px-8 py-3 rounded-full border border-foreground text-foreground font-bold text-sm hover:bg-foreground hover:text-background transition-all"
            >
              See more
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-card border border-border shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full min-h-[400px] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] transition-all group"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div className={`w-3 h-3 rounded-full ${item.dotColor}`} />
                  <span className="text-[13px] font-bold text-muted-foreground/60 uppercase tracking-widest">{item.readTime}</span>
                </div>
                
                <h4 className="text-2xl font-bold text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                
                <p className="text-muted-foreground text-[15px] leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="flex justify-end mt-8">
                <button 
                  aria-label="Read more"
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${item.darkButton ? 'bg-foreground text-background hover:opacity-90' : 'bg-card border border-border text-foreground hover:border-primary'}`}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
