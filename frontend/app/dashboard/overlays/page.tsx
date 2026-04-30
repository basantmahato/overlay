'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import api from '@/lib/api';
import { NewOverlayModal } from '@/components/dashboard/overlay/modals/NewOverlayModal';
import { Temp2Dashboard } from '@/components/template/temp2/dashboard';
import { Pencil, Trash2, Check, X } from 'lucide-react';

import { MatchState, Overlay, Template } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

const DEFAULT_STATE: MatchState = {
  teamA_name: 'HOME', teamA_abbr: 'HOME', teamA_color: '#3b82f6', teamA_score: 0,
  teamB_name: 'AWAY', teamB_abbr: 'AWAY', teamB_color: '#ef4444', teamB_score: 0,
  match_time: '15:00', match_phase: '1st',
  play_clock: 40, down_distance: '1st & 10',
  possession: 'A', event: null,
  competition: '', venue: '',
  // Stats
  teamA_shots: 0, teamA_shots_on_target: 0, teamA_corners: 0, teamA_fouls: 0,
  teamB_shots: 0, teamB_shots_on_target: 0, teamB_corners: 0, teamB_fouls: 0,
  possession_A: 50,
};

export default function OverlaysPage() {
  const socketRef = useRef<Socket | null>(null);

  const [overlays, setOverlays]       = useState<Overlay[]>([]);
  const [templates, setTemplates]     = useState<Template[]>([]);
  const [activeId, setActiveId]       = useState<string | null>(null);
  const [state, setState]             = useState<MatchState>(DEFAULT_STATE);
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

  const selectOverlay = (ov: Overlay) => {
    setActiveId(ov.id);
    setState(ov.renderedConfigJson ?? DEFAULT_STATE);
    joinDashboard(ov.id);
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

  // Show Pro Broadcast dashboard for all overlays
  if (activeOverlay) {
    return (
      <Temp2Dashboard 
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & List */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Overlays</h1>
          <p className="text-zinc-500 mt-1">Manage and control your live broadcast sources.</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
        >
          + New Overlay
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Overlays</span>
            </div>
            <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
              {overlays.length === 0 ? (
                <div className="p-8 text-center text-zinc-600 text-sm italic">No overlays created yet.</div>
              ) : (
                overlays.map(ov => (
                  <div key={ov.id} className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    activeId === ov.id 
                      ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-300' 
                      : 'hover:bg-zinc-800 text-zinc-400'
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
                          className="flex-1 bg-zinc-950 border border-indigo-500/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                        />
                        <button 
                          onClick={saveEdit}
                          className="p-1.5 text-emerald-400 hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Save"
                          aria-label="Save"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="p-1.5 text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Cancel"
                          aria-label="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => selectOverlay(ov)}
                          className="flex-1 text-left"
                        >
                          <div className="font-bold text-sm truncate">{ov.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{ov.template.name}</div>
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEditing(ov)}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Rename"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => deleteOverlay(ov.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
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
        <div className="lg:col-span-2">
          <div className="h-64 bg-zinc-900/40 border border-zinc-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-zinc-600">
            <svg className="w-8 h-8 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Select an overlay to control it</p>
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
