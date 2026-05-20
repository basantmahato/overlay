'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchState } from '@/types';

// Match Event interface
interface MatchEvent {
  type: string;
  team: 'h' | 'a';
  player: string;
  min: string;
  timestamp?: number;
}

// Helper functions for event popup
const getEventClass = (text: string): string => {
  if (text.includes('Goal')) return 'goal';
  if (text.includes('Yellow Card')) return 'card-yellow';
  if (text.includes('Red Card')) return 'card-red';
  if (text.includes('Substitution')) return 'sub';
  return 'goal';
};

const extractEventType = (text: string): string => {
  if (text.includes('Goal')) return 'Goal';
  if (text.includes('Yellow Card')) return 'Yellow Card';
  if (text.includes('Red Card')) return 'Red Card';
  if (text.includes('Substitution')) return 'Substitution';
  return 'Goal';
};

const formatEventText = (text: string): string => {
  // Clean up event text for display
  return text.replace(/^Event: /, '');
};

const getContrastColor = (hexcolor: string) => {
  if (!hexcolor || hexcolor === 'transparent') return '#ffffff';
  // Remove # if present
  const color = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;
  if (color.length !== 6) return '#ffffff';
  
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

// Event Type Icons Component
const EventIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 16 }) => {
  const icons: Record<string, React.ReactNode> = {
    'Goal': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    'Yellow Card': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
        <rect x="6" y="4" width="12" height="16" rx="2" />
      </svg>
    ),
    'Red Card': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#ef4444" stroke="none">
        <rect x="6" y="4" width="12" height="16" rx="2" />
      </svg>
    ),
    'Substitution': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
        <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0-12l4 4m-4-4l-4 4" />
      </svg>
    ),
  };
  return icons[type] || <span>{type}</span>;
};

export interface Temp2OverlayProps {
  state: MatchState;
  bumpA?: boolean;
  bumpB?: boolean;
}

export const Temp2Overlay: React.FC<Temp2OverlayProps> = ({ state, bumpA, bumpB }) => {
  const [showEvent, setShowEvent] = useState(false);
  const [eventText, setEventText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<typeof state.events>([]);

  // Filter events by age (default 1 minute)
  useEffect(() => {
    const filterEvents = () => {
      const displayMinutes = state.eventDisplayMinutes || 1;
      const cutoffTime = Date.now() - (displayMinutes * 60 * 1000);
      const events = state.events || [];
      // Keep events with no timestamp (backward compat) or recent ones
      const recent = events.filter((e: MatchEvent) => !e.timestamp || e.timestamp >= cutoffTime);
      setFilteredEvents(recent);
    };

    filterEvents();
    const interval = setInterval(filterEvents, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [state.events, state.eventDisplayMinutes]);

  useEffect(() => {
    if (state.event?.text) {
      setEventText(state.event.text);
      setShowEvent(true);
      const timer = setTimeout(() => setShowEvent(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state.event]);

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top-left': return 'top-10 left-10';
      case 'top-center': return 'top-10 left-1/2 -translate-x-1/2';
      case 'top-right': return 'top-10 right-10';
      case 'bottom-left': return 'bottom-[72px] left-10';
      case 'bottom-right': return 'bottom-[72px] right-10';
      case 'bottom-center':
      default: return 'bottom-[72px] left-1/2 -translate-x-1/2';
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); color: #6366f1; }
          100% { transform: scale(1); }
        }
        .score-change { animation: pulse 0.5s ease-out; }

        @keyframes popUpCenter {
          0%   { opacity:0; transform:translate(-50%,-40%); }
          10%  { opacity:1; transform:translate(-50%,-50%); }
          80%  { opacity:1; transform:translate(-50%,-50%); }
          100% { opacity:0; transform:translate(-50%,-60%); }
        }
        .event-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-left: 4px solid;
          padding: 20px 40px;
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #059669;
          border-radius: 12px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.15);
          white-space: nowrap;
          pointer-events: none;
          animation: popUpCenter 5s ease forwards;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .event-popup.goal { border-color: #10b981; }
        .event-popup.card-yellow { border-color: #fbbf24; }
        .event-popup.card-red { border-color: #ef4444; }
        .event-popup.sub { border-color: #3b82f6; }
        
        .lineup-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 100%);
          backdrop-filter: blur(12px);
          z-index: 200;
          font-family: 'Outfit', sans-serif;
        }
        .lineup-card {
          width: 95%;
          max-width: 1200px;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
        }
        .lineup-header {
          background: #0f172a;
          padding: 40px;
          text-align: center;
          position: relative;
          border-bottom: 8px solid #facc15;
        }
        .lineup-body {
          padding: 40px;
          display: grid;
          grid-cols: 2;
          gap: 40px;
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .team-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .team-header {
          padding: 20px 30px;
          transform: skewX(-12deg);
          margin-left: 10px;
          margin-right: 10px;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
        }
        .team-header-content {
          transform: skewX(12deg);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .player-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .player-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }
        .player-item:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        .player-number {
          font-weight: 900;
          color: #94a3b8;
          font-size: 14px;
          font-variant-numeric: tabular-nums;
        }
        .player-name {
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .overlay-container-temp2 {
          --team-a-color: ${state.teamA_color || '#1a4a8a'};
          --team-b-color: ${state.teamB_color || '#cc0000'};
          --border-top-radius: ${state.competition || state.venue ? '0px' : '12px'};
        }
      `}</style>

      <div className={`fixed flex flex-col items-center overlay-container-temp2 transition-all duration-500 ${getPositionClasses(state.position || 'bottom-center')}`}>
        {/* Top Bar - Competition & Venue */}
        {(state.competition || state.venue) && (
          <div className="bg-white/95 backdrop-blur-[10px] px-4 py-1 rounded-t-lg border border-black/10 border-b-0">
            <div className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[2px] text-slate-500">
              {state.competition && <span>{state.competition}</span>}
              {state.competition && state.venue && <span className="text-black/10">|</span>}
              {state.venue && <span>{state.venue}</span>}
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div 
          className="flex items-stretch h-16 bg-white/98 backdrop-blur-[10px] rounded-b-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/10 overflow-hidden rounded-tl-[var(--border-top-radius)] text-slate-900"
        >
          {/* Home Team */}
          <div className="flex items-center px-6 gap-4 relative border-r border-black/5">
            <div 
              className="absolute left-0 top-0 w-1.5 h-full bg-[var(--team-a-color)]"
            />
            <span className="text-2xl font-black tracking-tight">
              {state.teamA_abbr || 'HOME'}
            </span>
            <span className={`text-[42px] font-black w-10 text-center leading-none mt-1 ${bumpA ? 'score-change' : ''}`}>
              {state.teamA_score}
            </span>
          </div>

          {/* Center Info */}
          <div className="flex flex-col items-center justify-center min-w-[100px] bg-slate-50 border-x border-black/5 px-5">
            <span className="text-xl font-black leading-none">{state.match_time}</span>
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider mt-1">
              {state.match_phase}
            </span>
          </div>
 
          {/* Away Team */}
          <div className="flex items-center px-6 gap-4 relative border-l border-black/5">
            <span className={`text-[42px] font-black w-10 text-center leading-none mt-1 ${bumpB ? 'score-change' : ''}`}>
              {state.teamB_score}
            </span>
            <span className="text-2xl font-black tracking-tight">
              {state.teamB_abbr || 'AWAY'}
            </span>
            <div 
              className="absolute right-0 top-0 w-1.5 h-full bg-[var(--team-b-color)]"
            />
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {showEvent && state.event && (
        <div className={`event-popup ${getEventClass(state.event.text)}`}>
          <EventIcon type={extractEventType(state.event.text)} size={20} />
          <span>{formatEventText(state.event.text)}</span>
        </div>
      )}

      {/* Match Events Ticker */}
      {(filteredEvents && filteredEvents.length > 0) && (
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-black/5 overflow-hidden">
          <div className="ticker-wrap">
            <div className="ticker-content">
              <span className="ticker-label mr-6">
                <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded uppercase tracking-wider">Latest Events</span>
              </span>
              {/* Duplicate events 4x for truly seamless infinite loop */}
              {filteredEvents.map((evt: MatchEvent, i: number) => (
                <span key={i} className="ticker-item">
                  <EventIcon type={evt.type} size={14} />
                  <span className={`font-bold ml-2 ${evt.team === 'h' ? 'text-[#3b82f6]' : 'text-[#e63946]'}`}>
                    {evt.team === 'h' ? 'HOME' : 'AWAY'}
                  </span>
                  <span className="text-emerald-600 font-bold ml-2">{evt.min}'</span>
                  <span className="text-slate-700 ml-2">{evt.player}</span>
                  <span className="text-slate-300 mx-6">|</span>
                </span>
              ))}
            </div>
          </div>
          <style>{`
            .ticker-wrap {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            .ticker-content {
              display: inline-flex;
              white-space: nowrap;
              padding-left: 100%;
              animation: ticker-scroll 40s linear infinite;
              height: 100%;
              align-items: center;
            }
            .ticker-item {
              font-family: 'Outfit', sans-serif;
              font-size: 14px;
              font-weight: 600;
            }
            .ticker-label {
              display: inline-flex;
              align-items: center;
            }
            @keyframes ticker-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .ticker-wrap:hover .ticker-content {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}
      {/* Lineups Overlay */}
      <AnimatePresence mode="wait">
        {state.showLineups && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lineup-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="lineup-card"
            >
              <div className="lineup-header">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-[12px] font-black uppercase tracking-[0.6em] text-indigo-400 mb-2 block">Matchday Protocol</span>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Starting Lineups</h2>
              </div>
              
              <div className="lineup-body grid grid-cols-2">
                {/* Team A */}
                <div className="team-column">
                  <div 
                    className="team-header"
                    style={{ backgroundColor: state.teamA_color || '#1e40af' }}
                  >
                    <div className="team-header-content">
                      <span className="text-xl font-black italic tracking-tighter" style={{ color: getContrastColor(state.teamA_color || '#1e40af') }}>
                        {state.teamA_name || 'HOME TEAM'}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-black" style={{ color: getContrastColor(state.teamA_color || '#1e40af') }}>XI</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="player-grid">
                    {(state.teamA_players || []).map((name: string, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 + 0.3 }}
                        key={i} 
                        className="player-item"
                      >
                        <span className="player-number">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className="player-name">{name}</span>
                      </motion.div>
                    ))}
                    {(!state.teamA_players || state.teamA_players.length === 0) && (
                      <div className="col-span-full py-8 text-center text-slate-400 text-sm italic font-medium">No players registered</div>
                    )}
                  </div>
                </div>

                {/* Team B */}
                <div className="team-column">
                  <div 
                    className="team-header"
                    style={{ backgroundColor: state.teamB_color || '#991b1b' }}
                  >
                    <div className="team-header-content">
                      <span className="text-xl font-black italic tracking-tighter" style={{ color: getContrastColor(state.teamB_color || '#991b1b') }}>
                        {state.teamB_name || 'AWAY TEAM'}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-black" style={{ color: getContrastColor(state.teamB_color || '#991b1b') }}>XI</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="player-grid">
                    {(state.teamB_players || []).map((name: string, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 + 0.3 }}
                        key={i} 
                        className="player-item"
                      >
                        <span className="player-number">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className="player-name">{name}</span>
                      </motion.div>
                    ))}
                    {(!state.teamB_players || state.teamB_players.length === 0) && (
                      <div className="col-span-full py-8 text-center text-slate-400 text-sm italic font-medium">No players registered</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-8">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Official Stream</span>
                 </div>
                 {state.venue && (
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-l border-slate-200 pl-8">{state.venue}</span>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Temp2Overlay;
