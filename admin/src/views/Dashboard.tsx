import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Layout as TemplateIcon, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import api from '../lib/api';

const StatCard = ({ label, value, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="shadcn-card p-6"
  >
    <div className="flex justify-between items-start">
      <div className="p-2 rounded-md bg-secondary text-secondary-foreground border border-border">
        <Icon size={20} />
      </div>
      <div className="flex items-center gap-1 text-foreground text-[10px] font-bold border border-border px-1.5 py-0.5 rounded uppercase tracking-wider">
        +12%
      </div>
    </div>
    <div className="mt-4">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold mt-1 tabular-nums">{value}</h3>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, templates: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/templates')
    ]).then(([u, t]) => {
      setStats({
        users: u.data.length,
        templates: t.data.length
      });
    }).catch((error) => {
      console.error('Dashboard fetch error:', error);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">System performance and user engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats.users} icon={Users} delay={0.1} />
        <StatCard label="Active Templates" value={stats.templates} icon={TemplateIcon} delay={0.2} />
        <StatCard label="Daily Sessions" value="1,284" icon={Activity} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 shadcn-card overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider">Recent Activity</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-2 py-1 border border-border rounded">View All</button>
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                <div className="w-8 h-8 rounded border border-border bg-background flex items-center justify-center text-muted-foreground">
                  <TrendingUp size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New template "E-Sports Pro" published</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago • System Admin</p>
                </div>
                <div className="text-[10px] font-bold text-foreground border border-border px-2 py-0.5 rounded bg-background">
                  SUCCESS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="shadcn-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full shadcn-button bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-widest">
              Broadcast Message
            </button>
            <button className="w-full shadcn-button border border-border text-foreground hover:bg-secondary font-bold text-xs uppercase tracking-widest">
              Maintenance Mode
            </button>
            <button className="w-full shadcn-button border border-border text-foreground hover:bg-secondary font-bold text-xs uppercase tracking-widest">
              System Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
