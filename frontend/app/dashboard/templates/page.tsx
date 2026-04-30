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

  const getThumb = () => '/temp2_thumb.png';

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
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Template Gallery</h1>
          <p className="text-zinc-500 mt-1">Choose a visual style for your next broadcast.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <div 
            key={t.id}
            className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="relative h-48 w-full bg-zinc-950">
              <Image 
                src={getThumb()} 
                alt={t.name}
                fill
                className="object-cover opacity-50 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white mb-2 inline-block bg-indigo-600">
                  Premium
                </span>
                <h3 className="text-xl font-bold text-white">{t.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                A high-fidelity glassmorphism overlay designed for professional football/soccer broadcasts. Includes competition and venue markers.
              </p>
              <Button onClick={() => handleCreateClick(t.id)} className="w-full py-3 rounded-xl">
                <Plus size={16} /> Use Template
              </Button>
            </div>
          </div>
        ))}

        {/* Placeholder for future templates */}
        <div className="border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-zinc-600">
          <Layout size={32} className="mb-3 opacity-20" />
          <p className="text-sm font-medium">New Templates Coming Soon</p>
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
