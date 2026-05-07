import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tv } from 'lucide-react';
import api from '../lib/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', res.data.accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
            <Tv className="text-background" size={24} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">Overlay Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          </div>
        </div>

        <div className="shadcn-card p-6">
          {error && (
            <div className="mb-4 p-3 rounded border border-destructive/20 bg-destructive/10 text-destructive text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="shadcn-input h-10"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="shadcn-input h-10"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full shadcn-button h-10 bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          Protected Environment
        </p>
      </motion.div>
    </div>
  );
}
