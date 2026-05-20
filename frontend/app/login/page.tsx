'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      router.push('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed top-8 right-8 w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all z-50 shadow-sm"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="relative w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#0f172a] rounded-full" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">MAC</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Log in to manage your broadcast overlays</p>
        </div>

        <div className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground transition-all placeholder:text-muted-foreground/40 font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-sm font-bold text-foreground">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:opacity-80 transition-opacity">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground transition-all placeholder:text-muted-foreground/40 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-foreground text-background font-bold rounded-2xl transition-all shadow-xl shadow-black/5 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Processing...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-[15px] font-medium text-muted-foreground">
            New to MAC? <Link href="/register" className="text-primary font-bold hover:underline">Create an account</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
