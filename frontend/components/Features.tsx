'use client';

import { motion } from 'framer-motion';
import { Layout, Zap, Cpu, Monitor, Shield, Users } from 'lucide-react';

const features = [
  {
    title: 'Visual Dashboard',
    desc: 'Manage all your overlay data from a single, intuitive control panel.',
    icon: Layout,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Ultra Low Latency',
    desc: 'Powered by WebSockets for instantaneous updates across your stream.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'OBS Ready',
    desc: 'Simply copy and paste your unique URL into any browser source.',
    icon: Monitor,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Custom Logic',
    desc: 'Inject dynamic events like touchdowns, yellow cards, or goal alerts.',
    icon: Cpu,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    title: 'Team Sync',
    desc: 'Allow multiple moderators to control the score simultaneously.',
    icon: Users,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
  {
    title: 'Enterprise Security',
    desc: 'Authenticated access ensures only you control your broadcast data.',
    icon: Shield,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-indigo-500 tracking-[0.3em] uppercase mb-4">Core Capabilities</h2>
          <h3 className="text-3xl md:text-5xl font-bold">Built for the Modern Streamer</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass-card hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon className={f.color} size={24} />
              </div>
              <h4 className="text-xl font-bold mb-3">{f.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
