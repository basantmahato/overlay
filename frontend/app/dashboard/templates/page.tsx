'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Layout, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NewOverlayModal } from '@/components/dashboard/overlay/modals/NewOverlayModal';
import { useRouter } from 'next/navigation';

import { Template } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTemplateId, setNewTemplateId] = useState('');
  const [newName, setNewName] = useState('');
  const [modalErr, setModalErr] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/templates');
        setTemplates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getThumb = (id: string) => {
    // New scalable template IDs
    if (id === 'football-broadcast-pro') return '/temp2_thumb.png';
    if (id === 'football-modern-glass') return '/temp1_thumb.png';
    if (id === 'basketball-modern') return '/temp3_thumb.png';
    if (id === 'basketball-classic') return '/temp3_thumb.png';
    if (id === 'tennis-scoreboard') return '/temp4_thumb.png';
    if (id === 'cricket-t20') return '/temp2_thumb.png';
    // Legacy IDs (backwards compatibility)
    if (id === 'broadcast-pro-football-modern-id') return '/temp1_thumb.png';
    if (id === 'broadcast-pro-football-id') return '/temp2_thumb.png';
    return '/temp2_thumb.png';
  };

  const getDesc = (template: Template) => {
    return template.configJson?.sport 
      ? `Professional ${template.configJson.sport} broadcast overlay.`
      : 'Professional broadcast overlay.';
  };

  const handleCreateClick = (id: string) => {
    setNewTemplateId(id);
    setShowNewModal(true);
  };

  const createOverlay = async () => {
    setModalErr('');
    if (!newName.trim()) { setModalErr('Name is required'); return; }
    try {
      await api.post('/overlays', { name: newName.trim(), templateId: newTemplateId });
      router.push('/dashboard/overlays');
    } catch (e: any) { 
      setModalErr(e.response?.data?.message || 'Failed');
    }
  };

  if (loading) return null;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Template Gallery</h1>
          <p className="text-muted-foreground mt-2 font-medium">Choose a visual style for your next broadcast.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((t) => (
          <div 
            key={t.id}
            className="group bg-card border border-border rounded-xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-black/5"
          >
            <div className="relative h-56 w-full bg-muted">
              <Image 
                src={getThumb(t.id)} 
                alt={t.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black mb-3 inline-block bg-primary">
                  Premium
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">{t.name}</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed font-medium">
                {getDesc(t)}
              </p>
              <button 
                onClick={() => handleCreateClick(t.id)} 
                className="w-full py-4 rounded-lg bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/5"
              >
                <Plus size={18} /> Use Template
              </button>
            </div>
          </div>
        ))}

        {/* Placeholder for future templates */}
        <div className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground/40 group">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            <Layout size={32} className="opacity-40" />
          </div>
          <p className="text-sm font-bold tracking-tight text-foreground/40 uppercase tracking-[0.2em]">New Templates Coming Soon</p>
        </div>
      </div>

      <NewOverlayModal 
        isOpen={showNewModal} onClose={() => setShowNewModal(false)}
        newName={newName} setNewName={setNewName}
        newTemplateId={newTemplateId} setNewTemplateId={setNewTemplateId}
        templates={templates} modalErr={modalErr} onCreate={createOverlay}
      />
    </div>
  );
}
