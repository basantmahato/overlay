import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Layout as TemplateIcon, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import api from '../lib/api';

const StatCard = ({ label, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 border-white/5 flex flex-col gap-4"
  >
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
        <ArrowUpRight size={14} />
        +12%
      </div>
    </div>
    <div>
      <p className="text-zinc-500 text-sm font-semibold">{label}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
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
      console.error('Error details:', error.response?.data || error.message);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">System Overview</h1>
        <p className="text-zinc-500 mt-1">Global statistics and health monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats.users} icon={Users} color="bg-blue-500" delay={0.1} />
        <StatCard label="Active Templates" value={stats.templates} icon={TemplateIcon} color="bg-purple-500" delay={0.2} />
        <StatCard label="Daily Active Sessions" value="1,284" icon={Activity} color="bg-emerald-500" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Mockup */}
        <div className="lg:col-span-2 glass-card p-8 border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Recent System Activity</h3>
            <button className="text-xs font-bold text-primary hover:underline">View All Logs</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                  <TrendingUp size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">New template "E-Sports Pro" published</p>
                  <p className="text-xs text-zinc-500">2 minutes ago • System Admin</p>
                </div>
                <div className="text-xs font-bold text-zinc-600 px-3 py-1 rounded-full border border-white/5">
                  SUCCESS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-8 border-white/5">
          <h3 className="text-xl font-bold mb-8">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
              Broadcast System Message
            </button>
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
              Server Maintenance Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
