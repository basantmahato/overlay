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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Global Overlays</h1>
        <p className="text-muted-foreground text-sm">Real-time overview of all broadcast instances across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overlays.map((ov) => (
          <div key={ov.id} className="shadcn-card p-5 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded border border-border bg-secondary/50 flex items-center justify-center text-foreground">
                <Tv size={18} />
              </div>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-foreground border border-foreground/20 px-2 py-0.5 rounded-full bg-background uppercase tracking-tighter">
                <Activity size={8} className="animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold truncate tracking-tight">{ov.name}</h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase tracking-tighter">{ov.id}</p>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User size={12} className="text-muted-foreground/60" />
                  <span className="truncate">{ov.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TemplateIcon size={12} className="text-muted-foreground/60" />
                  <span>{ov.template?.name}</span>
                </div>
              </div>

              <div className="pt-2">
                <a 
                  href={`http://localhost:3000/overlay/${ov.id}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full shadcn-button h-9 border border-border bg-background hover:bg-secondary text-[10px] font-bold uppercase tracking-widest gap-2"
                >
                  <ExternalLink size={12} />
                  Open Viewer
                </a>
              </div>
            </div>
          </div>
        ))}

        {overlays.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center shadcn-card bg-secondary/5 border-dashed">
            <p className="text-muted-foreground text-sm font-medium">No active broadcast instances found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
