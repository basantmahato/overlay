'use client';

import { Settings as SettingsIcon, Shield, User, Bell } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile Settings', icon: <User size={20} />, desc: 'Update your account details and profile picture.' },
    { title: 'Security', icon: <Shield size={20} />, desc: 'Manage your password and two-factor authentication.' },
    { title: 'Notifications', icon: <Bell size={20} />, desc: 'Configure how you receive alerts and updates.' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-4">
        {sections.map((s) => (
          <div key={s.title} className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6 hover:border-zinc-700 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors">
              {s.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-zinc-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
