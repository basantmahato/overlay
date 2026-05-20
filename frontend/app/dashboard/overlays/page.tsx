'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import api from '@/lib/api';
import { NewOverlayModal } from '@/components/dashboard/overlay/modals/NewOverlayModal';
import { getDashboardComponent } from '@/lib/componentRegistry';
import { Pencil, Trash2, Check, X } from 'lucide-react';

import { MatchState, Overlay, Template } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function OverlaysPage() {
  const socketRef = useRef<Socket | null>(null);

  const [overlays, setOverlays]       = useState<Overlay[]>([]);
  const [templates, setTemplates]     = useState<Template[]>([]);
  const [activeId, setActiveId]       = useState<string | null>(null);
  const [state, setState]             = useState<MatchState>({});
  const [loading, setLoading]         = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName]         = useState('');
  const [newTemplateId, setNewTemplateId] = useState('');
  const [modalErr, setModalErr]       = useState('');
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editName, setEditName]       = useState('');

  const activeOverlay = overlays.find(o => o.id === activeId);

  // ── Socket ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = s;
    return () => { s.disconnect(); };
  }, []);

  const joinDashboard = (id: string) => socketRef.current?.emit('joinDashboard', id);

  const selectOverlay = async (ov: Overlay) => {
    setActiveId(ov.id);
    joinDashboard(ov.id);
    
    // Fetch latest state from server (includes template defaults merged with saved state)
    try {
      const res = await api.get(`/overlays/${ov.id}/state`);
      setState(res.data.state);
    } catch {
      setState(ov.renderedConfigJson || {});
    }
  };

  // ── Data load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [ovRes, tpRes] = await Promise.all([api.get('/overlays'), api.get('/templates')]);
        setOverlays(ovRes.data);
        setTemplates(tpRes.data);
        if (tpRes.data.length) setNewTemplateId(tpRes.data[0].id);
        if (ovRes.data.length) selectOverlay(ovRes.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── CRUD Ops ─────────────────────────────────────────────────────────────────
  const push = useCallback(async (patch: Partial<MatchState>) => {
    if (!activeId) return;
    setState(prev => ({ ...prev, ...patch }));
    try {
      await api.patch(`/overlays/${activeId}/state`, patch);
    } catch { /* silent fail */ }
  }, [activeId]);


  const createOverlay = async () => {
    setModalErr('');
    if (!newName.trim()) { setModalErr('Name is required'); return; }
    if (!newTemplateId)  { setModalErr('Pick a template'); return; }
    try {
      const res = await api.post('/overlays', { name: newName.trim(), templateId: newTemplateId });
      const newOv: Overlay = res.data;
      setOverlays(prev => [newOv, ...prev]);
      selectOverlay(newOv);
      setShowNewModal(false);
      setNewName('');
    } catch (e: any) { 
      setModalErr(e.response?.data?.message || 'Failed');
    }
  };

  const deleteOverlay = async (id: string) => {
    if (!confirm('Delete this overlay?')) return;
    try {
      await api.delete(`/overlays/${id}`);
      setOverlays(prev => prev.filter(o => o.id !== id));
      if (activeId === id) setActiveId(null);
    } catch { alert('Failed'); }
  };

  const startEditing = (ov: Overlay) => {
    setEditingId(ov.id);
    setEditName(ov.name);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const res = await api.put(`/overlays/${editingId}`, { name: editName.trim() });
      setOverlays(prev => prev.map(o => o.id === editingId ? { ...o, name: res.data.name } : o));
    } catch { alert('Failed to rename'); }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const obsUrl = activeId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/overlay/${activeId}` : '';

  if (loading) return null;

  // Show template-specific dashboard
  if (activeOverlay) {
    // Get dashboard component name from template config
    const dashboardComponentName = activeOverlay.template.configJson?.dashboardComponent;
    const DashboardComponent = dashboardComponentName 
      ? getDashboardComponent(dashboardComponentName)
      : undefined;

    if (!DashboardComponent) {
      return (
        <div className="p-6">
          <button onClick={() => setActiveId(null)} className="text-zinc-400 hover:text-white mb-4">
            ← Back
          </button>
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-red-400">
            <h2 className="font-bold mb-2">Dashboard Not Found</h2>
            <p className="text-sm">Dashboard component &quot;{dashboardComponentName || 'undefined'}&quot; is not registered for template &quot;{activeOverlay.template.name}&quot;.</p>
          </div>
        </div>
      );
    }

    return (
      <DashboardComponent
        state={state}
        setState={setState}
        onPush={push}
        obsUrl={obsUrl}
        onBack={() => setActiveId(null)}
      />
    );
  }

  // Show overlay list when none selected
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10">
      {/* Header & List */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">My Overlays</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage and control your live broadcast sources with zero latency.</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-full font-bold transition-all hover:opacity-90 shadow-xl shadow-black/5"
        >
          <span className="text-xl">+</span> New Overlay
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/30">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Active Overlays</span>
            </div>
            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {overlays.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-sm italic font-medium">No overlays created yet.</div>
              ) : (
                overlays.map(ov => (
                  <div key={ov.id} className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${
                    activeId === ov.id 
                      ? 'bg-primary/5 border-primary/30 text-foreground' 
                      : 'hover:bg-muted border-transparent text-muted-foreground'
                  }`}>
                    {editingId === ov.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          placeholder="Overlay name"
                          aria-label="Overlay name"
                          className="flex-1 bg-background border border-primary/50 rounded-xl px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button 
                          onClick={saveEdit}
                          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                          title="Save"
                          aria-label="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Cancel"
                          aria-label="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => selectOverlay(ov)}
                          className="flex-1 text-left"
                        >
                          <div className={`font-bold text-[15px] truncate ${activeId === ov.id ? 'text-foreground' : 'text-foreground/80'}`}>{ov.name}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">{ov.template.name}</div>
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEditing(ov)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                            title="Rename"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => deleteOverlay(ov.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-background rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Empty State */}
        <div className="lg:col-span-8">
          <div className="h-[500px] bg-card border-2 border-border border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground group">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8 opacity-40 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-foreground mb-2">Ready to broadcast?</p>
            <p className="text-sm font-medium text-muted-foreground/60">Select an overlay from the list to start controlling your stream.</p>
          </div>
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
