'use client';

import { motion } from 'framer-motion';
import { Layout, Zap, Cpu, Monitor, Shield, Users } from 'lucide-react';

const features = [
  {
    title: 'Visual Dashboard',
    desc: 'Manage all your overlay data from a single, intuitive control panel.',
    icon: Layout,
    color: 'text-black',
    bg: 'bg-zinc-100'
  },
  {
    title: 'Ultra Low Latency',
    desc: 'Powered by WebSockets for instantaneous updates across your stream.',
    icon: Zap,
    color: 'text-black',
    bg: 'bg-zinc-100'
  },
  {
    title: 'OBS Ready',
    desc: 'Simply copy and paste your unique URL into any browser source.',
    icon: Monitor,
    color: 'text-black',
    bg: 'bg-zinc-100'
  },
  {
    title: 'Custom Logic',
    desc: 'Inject dynamic events like touchdowns, yellow cards, or goal alerts.',
    icon: Cpu,
    color: 'text-black',
    bg: 'bg-zinc-100'
  },
  {
    title: 'Team Sync',
    desc: 'Allow multiple moderators to control the score simultaneously.',
    icon: Users,
    color: 'text-black',
    bg: 'bg-zinc-100'
  },
  {
    title: 'Enterprise Security',
    desc: 'Authenticated access ensures only you control your broadcast data.',
    icon: Shield,
    color: 'text-black',
    bg: 'bg-zinc-100'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4">Core Capabilities</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Built for the Modern Streamer</h3>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] border-2 border-border bg-card/30 hover:bg-card hover:border-primary/20 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon className={f.color} size={28} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-foreground tracking-tight">{f.title}</h4>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
