'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { getOverlayComponent } from '@/lib/componentRegistry';
import { MatchState } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const API_BASE   = process.env.NEXT_PUBLIC_API_URL    || 'http://localhost:5000/api/v1';

export default function OverlayPage() {
  const { overlayId } = useParams<{ overlayId: string }>();
  const [state, setState] = useState<MatchState | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [eventText, setEventText] = useState('');
  
  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevScoreA = useRef(0);
  const prevScoreB = useRef(0);
  const [bumpA, setBumpA] = useState(false);
  const [bumpB, setBumpB] = useState(false);

  useEffect(() => {
    if (!overlayId) return;
    axios.get(`${API_BASE}/overlays/${overlayId}/state`)
      .then(r => {
        setState(r.data.state);
        setTemplate(r.data.template);
      })
      .catch(() => {});
  }, [overlayId]);

  useEffect(() => {
    if (!overlayId) return;
    const socket: Socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect',    () => { setConnected(true); socket.emit('joinOverlay', overlayId); });
    socket.on('disconnect', () => setConnected(false));

    socket.on('stateUpdated', (incoming: MatchState) => {
      setState((prev: MatchState | null) => {
        const next = { ...(prev ?? {}), ...incoming };
        // Check for score changes (works with any template's score field)
        if (incoming.teamA_score !== undefined && incoming.teamA_score !== prevScoreA.current) {
          prevScoreA.current = incoming.teamA_score;
          setBumpA(true); setTimeout(() => setBumpA(false), 400);
        }
        if (incoming.teamB_score !== undefined && incoming.teamB_score !== prevScoreB.current) {
          prevScoreB.current = incoming.teamB_score;
          setBumpB(true); setTimeout(() => setBumpB(false), 400);
        }
        if (incoming.event?.text) {
          setEventText(incoming.event.text);
          setShowEvent(true);
          if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
          eventTimerRef.current = setTimeout(() => setShowEvent(false), 4000);
        }
        return next;
      });
    });

    return () => { socket.disconnect(); };
  }, [overlayId]);

  if (!template || !state) return null;

  // ── Template Rendering ─────────────────────────────────────────────────
  const renderLayout = () => {
    // Get overlay component name from template config
    const overlayComponentName = template.configJson?.overlayComponent;
    const OverlayComponent = overlayComponentName
      ? getOverlayComponent(overlayComponentName)
      : undefined;

    if (!OverlayComponent) {
      return (
        <div className="fixed inset-0 flex items-center justify-center text-red-400">
          <div className="text-center">
            <p className="font-bold">Overlay Not Found</p>
            <p className="text-sm text-zinc-500">{overlayComponentName || 'undefined'}</p>
          </div>
        </div>
      );
    }

    return <OverlayComponent state={state} bumpA={bumpA} bumpB={bumpB} />;
  };

  return (
    <>
      <style>{`
        body { background: transparent !important; overflow: hidden; margin: 0; padding: 0; }
        .conn { position:fixed; top:8px; right:8px; width:7px; height:7px; border-radius:50%; z-index: 100; }
        .event-popup {
          position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%);
          background: rgba(15,18,26,.97); border-left: 5px solid #e63946;
          padding: 10px 28px; font-family: 'Teko',sans-serif;
          font-size: 26px; font-weight: 700; color: white;
          border-radius: 4px; box-shadow: 0 6px 20px rgba(0,0,0,.6);
          white-space: nowrap; pointer-events: none;
          animation: slideUp 4s ease forwards;
          z-index: 90;
        }
        @keyframes slideUp {
          0%   { opacity:0; transform:translate(-50%,16px); }
          10%  { opacity:1; transform:translate(-50%,0); }
          80%  { opacity:1; transform:translate(-50%,0); }
          100% { opacity:0; transform:translate(-50%,-12px); }
        }
      `}</style>

      <div className={`conn ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
      
      {renderLayout()}

      {showEvent && <div className="event-popup">{eventText}</div>}
    </>
  );
}
