'use client';

import React, { useEffect, useState } from 'react';
import { MatchState } from '@/types';

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

interface Temp2OverlayProps {
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
      const recent = events.filter(e => !e.timestamp || e.timestamp >= cutoffTime);
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
          background: rgba(15, 18, 26, 0.98);
          backdrop-filter: blur(10px);
          border-left: 4px solid;
          padding: 20px 40px;
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #10b981;
          border-radius: 12px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.6);
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
      `}</style>

      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Top Bar - Competition & Venue */}
        {(state.competition || state.venue) && (
          <div className="bg-[rgba(15,17,26,0.95)] backdrop-blur-[10px] px-4 py-1 rounded-t-lg border border-[rgba(255,255,255,0.1)] border-b-0">
            <div className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[2px] text-[#94a3b8]">
              {state.competition && <span>{state.competition}</span>}
              {state.competition && state.venue && <span className="text-[rgba(255,255,255,0.2)]">|</span>}
              {state.venue && <span>{state.venue}</span>}
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div 
          className="flex items-stretch h-16 bg-[rgba(15,17,26,0.95)] backdrop-blur-[10px] rounded-b-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.1)] overflow-hidden"
          style={{ borderTopLeftRadius: state.competition || state.venue ? 0 : '12px' }}
        >
          {/* Home Team */}
          <div className="flex items-center px-6 gap-4 relative border-r border-[rgba(255,255,255,0.1)]">
            <div 
              className="absolute left-0 top-0 w-1 h-full"
              style={{ backgroundColor: state.teamA_color || '#1a4a8a' }}
            />
            <span className="text-2xl font-extrabold tracking-tight">
              {state.teamA_abbr || 'HOME'}
            </span>
            <span className={`text-[42px] font-black w-10 text-center leading-none mt-1 ${bumpA ? 'score-change' : ''}`}>
              {state.teamA_score}
            </span>
          </div>

          {/* Center Info */}
          <div className="flex flex-col items-center justify-center min-w-[100px] bg-[rgba(255,255,255,0.03)] border-x border-[rgba(255,255,255,0.1)] px-5">
            <span className="text-xl font-extrabold leading-none">{state.match_time}</span>
            <span className="text-[10px] font-extrabold uppercase text-[#6366f1] tracking-wider mt-0.5">
              {state.match_phase}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center px-6 gap-4 relative border-l border-[rgba(255,255,255,0.1)]">
            <span className={`text-[42px] font-black w-10 text-center leading-none mt-1 ${bumpB ? 'score-change' : ''}`}>
              {state.teamB_score}
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              {state.teamB_abbr || 'AWAY'}
            </span>
            <div 
              className="absolute right-0 top-0 w-1 h-full"
              style={{ backgroundColor: state.teamB_color || '#cc0000' }}
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
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-[#0f111a] via-[#1a1f2e] to-[#0f111a] border-t border-[rgba(255,255,255,0.1)] overflow-hidden">
          <div className="ticker-wrap">
            <div className="ticker-content">
              <span className="ticker-label mr-6">
                <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded uppercase tracking-wider">Latest Events</span>
              </span>
              {/* Duplicate events 4x for truly seamless infinite loop */}
              {[...filteredEvents, ...filteredEvents, ...filteredEvents, ...filteredEvents].map((evt, i) => (
                <span key={i} className="ticker-item">
                  <EventIcon type={evt.type} size={14} />
                  <span className={`font-bold ml-2 ${evt.team === 'h' ? 'text-[#3b82f6]' : 'text-[#e63946]'}`}>
                    {evt.team === 'h' ? 'HOME' : 'AWAY'}
                  </span>
                  <span className="text-emerald-400 font-bold ml-2">{evt.min}'</span>
                  <span className="text-white ml-2">{evt.player}</span>
                  <span className="text-[#475569] mx-6">|</span>
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
              100% { transform: translateX(-50%); }
            }
            .ticker-wrap:hover .ticker-content {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Temp2Overlay;
