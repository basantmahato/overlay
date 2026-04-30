import React, { useEffect, useState } from 'react';
import { Tv, User, Layout as TemplateIcon, ExternalLink, Activity } from 'lucide-react';
import api from '../lib/api';

export default function OverlayManagement() {
  const [overlays, setOverlays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverlays = async () => {
    try {
      const res = await api.get('/admin/overlays');
      setOverlays(res.data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchOverlays(); }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Global Overlays</h1>
        <p className="text-zinc-500 mt-1">Live overview of all broadcast overlays across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overlays.map((ov) => (
          <div key={ov.id} className="glass-card p-6 border-white/5 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Tv size={24} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <Activity size={10} />
                LIVE
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold truncate">{ov.name}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">{ov.id}</p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <User size={14} className="text-zinc-600" />
                  <span className="truncate">{ov.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <TemplateIcon size={14} className="text-zinc-600" />
                  <span>{ov.template?.name}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <a 
                  href={`http://localhost:3000/overlay/${ov.id}`} 
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all"
                >
                  <ExternalLink size={14} />
                  View Overlay
                </a>
              </div>
            </div>
          </div>
        ))}

        {overlays.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
            <p className="text-zinc-500 font-medium">No active overlays found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
