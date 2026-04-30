'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Info, Users, Target, Play, Pause, Plus, X, Copy, RefreshCw, 
  ChevronLeft, Trophy, Goal, Square, ArrowLeftRight
} from 'lucide-react';
import { MatchState } from '@/types';

// Event Icon Component for Dashboard
const EventIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 14 }) => {
  const iconClass = "flex-shrink-0";
  switch (type) {
    case 'Goal':
      return <Goal size={size} className={`${iconClass} text-emerald-400`} />;
    case 'Yellow Card':
      return <Square size={size} className={`${iconClass} text-yellow-400 fill-yellow-400`} />;
    case 'Red Card':
      return <Square size={size} className={`${iconClass} text-red-500 fill-red-500`} />;
    case 'Substitution':
      return <ArrowLeftRight size={size} className={`${iconClass} text-blue-400`} />;
    default:
      return null;
  }
};

interface Temp2DashboardProps {
  state: MatchState;
  setState: React.Dispatch<React.SetStateAction<MatchState>>;
  onPush: (patch: Partial<MatchState>) => void;
  obsUrl: string;
  onBack: () => void;
}

export const Temp2Dashboard: React.FC<Temp2DashboardProps> = ({
  state, setState, onPush, obsUrl, onBack
}) => {
  const [eventType, setEventType] = useState('Goal');
  const [eventTeam, setEventTeam] = useState('h');
  const [eventPlayer, setEventPlayer] = useState('');
  const [eventMin, setEventMin] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer functionality: strictly updates local state
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Sync elapsedSeconds to parent state (outside of render/updater phase)
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timeString = seconds > 0 ? `${minutes}'${seconds.toString().padStart(2, '0')}` : `${minutes}'`;
    
    // Only update if changed to avoid unnecessary re-renders
    if (state.match_time !== timeString) {
      setState(s => ({ ...s, match_time: timeString }));
      onPush({ match_time: timeString });
    }
  }, [elapsedSeconds, isTimerRunning, onPush, setState, state.match_time]);

  // Initialize/Sync elapsedSeconds from parent match_time
  useEffect(() => {
    if (isTimerRunning) return;
    
    const timeStr = state.match_time || '0\'';
    let totalSeconds = 0;
    
    if (timeStr.includes("'")) {
      const parts = timeStr.split("'");
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      totalSeconds = mins * 60 + secs;
    } else if (timeStr.includes(":")) {
      const parts = timeStr.split(":");
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      totalSeconds = mins * 60 + secs;
    } else {
      totalSeconds = (parseInt(timeStr) || 0) * 60;
    }
    
    if (totalSeconds !== elapsedSeconds) {
      setElapsedSeconds(totalSeconds);
    }
  }, [state.match_time, isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const updateScore = (team: 'h' | 'a', delta: number) => {
    const key = team === 'h' ? 'teamA_score' : 'teamB_score';
    const newVal = Math.max(0, (state[key as keyof MatchState] as number || 0) + delta);
    onPush({ [key]: newVal });
  };

  const setStatus = (status: string) => {
    onPush({ match_phase: status });
  };

  const addEvent = () => {
    if (!eventPlayer || !eventMin) return;
    const newEvent = {
      type: eventType,
      team: eventTeam as 'h' | 'a',
      player: eventPlayer,
      min: eventMin,
      timestamp: Date.now()
    };
    const events = [...(state.events || []), newEvent];
    onPush({ events });
    setEventPlayer('');
    setEventMin('');
  };

  const removeEvent = (index: number) => {
    const events = [...(state.events || [])];
    // Reverse the index since we display reversed
    const actualIndex = events.length - 1 - index;
    events.splice(actualIndex, 1);
    onPush({ events });
  };

  const copyOverlay = () => {
    navigator.clipboard.writeText(obsUrl);
  };

  const resetMatch = () => {
    if (confirm('Reset all match data?')) {
      window.location.reload();
    }
  };

  const statusButtons = [
    { key: 'Pre-Match', label: 'PRE' },
    { key: 'Live', label: 'LIVE' },
    { key: 'Half Time', label: 'HT' },
    { key: '2nd Half', label: '2H' },
    { key: 'Extra Time', label: 'ET' },
    { key: 'Full Time', label: 'FT' },
  ];

  return (
    <div className="min-h-screen bg-[#03040b] text-[#f8fafc] p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={20} /> Back to Overlays
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-500" size={24} />
            Pro Broadcast Dashboard
          </h1>
          <p className="text-[#94a3b8] mt-1">Professional soccer match overlay controls</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Panel */}
        <div className="space-y-6">
          {/* Match Information */}
          <div className="bg-[#0d111d] border border-[#1e293b] rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Info size={18} className="text-[#3b82f6]" /> Match Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2 block">
                  Competition / League
                </label>
                <input
                  type="text"
                  value={state.competition || ''}
                  onChange={(e) => setState(s => ({ ...s, competition: e.target.value }))}
                  placeholder="e.g. Premier League"
                  className="w-full bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2 block">
                  Venue / Stadium
                </label>
                <input
                  type="text"
                  value={state.venue || ''}
                  onChange={(e) => setState(s => ({ ...s, venue: e.target.value }))}
                  placeholder="e.g. Old Trafford"
                  className="w-full bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Team Configuration */}
          <div className="bg-[#0d111d] border border-[#1e293b] rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Users size={18} className="text-[#3b82f6]" /> Team Configuration
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Home Team */}
              <div>
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">Home Team</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={state.teamA_name}
                    onChange={(e) => setState(s => ({ ...s, teamA_name: e.target.value }))}
                    placeholder="Team Name"
                    className="w-full bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={state.teamA_abbr}
                      onChange={(e) => setState(s => ({ ...s, teamA_abbr: e.target.value }))}
                      placeholder="Code"
                      className="w-20 bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-[#3b82f6] transition-all"
                    />
                    <input
                      type="color"
                      value={state.teamA_color}
                      onChange={(e) => setState(s => ({ ...s, teamA_color: e.target.value }))}
                      aria-label="Home team color"
                      className="w-14 h-12 bg-[#1a1f2e] border border-[#1e293b] rounded-xl cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>
              {/* Away Team */}
              <div>
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">Away Team</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={state.teamB_name}
                    onChange={(e) => setState(s => ({ ...s, teamB_name: e.target.value }))}
                    placeholder="Team Name"
                    className="w-full bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={state.teamB_abbr}
                      onChange={(e) => setState(s => ({ ...s, teamB_abbr: e.target.value }))}
                      placeholder="Code"
                      className="w-20 bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-[#3b82f6] transition-all"
                    />
                    <input
                      type="color"
                      value={state.teamB_color}
                      onChange={(e) => setState(s => ({ ...s, teamB_color: e.target.value }))}
                      aria-label="Away team color"
                      className="w-14 h-12 bg-[#1a1f2e] border border-[#1e293b] rounded-xl cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Score Center */}
          <div className="bg-[#0d111d] border border-[#1e293b] rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Target size={18} className="text-[#3b82f6]" /> 
              Live Score Center 
              <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                LIVE
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Home Score */}
              <div>
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">{state.teamA_name}</h3>
                <div className="flex items-center justify-center gap-4 bg-[#1a1f2e] rounded-2xl p-4">
                  <button
                    onClick={() => updateScore('h', -1)}
                    aria-label="Decrease home score"
                    className="w-12 h-12 rounded-full bg-[#1e293b] hover:bg-[#3b82f6] flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>
                  <span className="text-5xl font-black font-mono w-16 text-center">{state.teamA_score}</span>
                  <button
                    onClick={() => updateScore('h', 1)}
                    aria-label="Increase home score"
                    className="w-12 h-12 rounded-full bg-[#1e293b] hover:bg-[#3b82f6] flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>
              </div>
              {/* Away Score */}
              <div>
                <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">{state.teamB_name}</h3>
                <div className="flex items-center justify-center gap-4 bg-[#1a1f2e] rounded-2xl p-4">
                  <button
                    onClick={() => updateScore('a', -1)}
                    aria-label="Decrease away score"
                    className="w-12 h-12 rounded-full bg-[#1e293b] hover:bg-[#3b82f6] flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>
                  <span className="text-5xl font-black font-mono w-16 text-center">{state.teamB_score}</span>
                  <button
                    onClick={() => updateScore('a', 1)}
                    aria-label="Increase away score"
                    className="w-12 h-12 rounded-full bg-[#1e293b] hover:bg-[#3b82f6] flex items-center justify-center transition-all hover:scale-110"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Match Status */}
          <div className="bg-[#0d111d] border border-[#1e293b] rounded-2xl p-6">
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4">Match Status</h3>
            <div className="grid grid-cols-3 gap-2">
              {statusButtons.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    state.match_phase === key 
                      ? 'bg-[#3b82f6] text-white' 
                      : 'bg-[#1a1f2e] border border-[#1e293b] text-[#94a3b8] hover:border-[#3b82f6]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2 block">
                Current Minute
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.match_time}
                  onChange={(e) => setState(s => ({ ...s, match_time: e.target.value }))}
                  placeholder="45'"
                  className="flex-1 bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-[#3b82f6] transition-all"
                />
                <button 
                  onClick={toggleTimer}
                  aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isTimerRunning 
                      ? 'bg-[#3b82f6] hover:bg-[#2563eb]' 
                      : 'bg-[#1e293b] hover:bg-[#3b82f6]'
                  }`}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Match Events */}
          <div className="bg-[#0d111d] border border-[#1e293b] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Match Events</h3>
              <div className="flex items-center gap-2">
                <select
                  value={state.eventDisplayMinutes || 1}
                  onChange={(e) => onPush({ eventDisplayMinutes: parseInt(e.target.value) })}
                  aria-label="Event display duration"
                  className="bg-[#1a1f2e] border border-[#1e293b] rounded-lg px-2 py-1 text-[10px] focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value={1}>1 min</option>
                  <option value={2}>2 min</option>
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                </select>
                <label className="text-[10px] text-[#64748b]">Show for</label>
              </div>
            </div>
            <div className="space-y-3">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                aria-label="Event type"
                className="w-full bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] transition-all"
              >
                <option>Goal</option>
                <option>Yellow Card</option>
                <option>Red Card</option>
                <option>Substitution</option>
              </select>
              <select
                value={eventTeam}
                onChange={(e) => setEventTeam(e.target.value)}
                aria-label="Event team"
                className="w-full bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] transition-all"
              >
                <option value="h">{state.teamA_name}</option>
                <option value="a">{state.teamB_name}</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={eventPlayer}
                  onChange={(e) => setEventPlayer(e.target.value)}
                  placeholder="Player name"
                  className="bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] transition-all"
                />
                <input
                  type="text"
                  value={eventMin}
                  onChange={(e) => setEventMin(e.target.value)}
                  placeholder="Min"
                  className="bg-[#1a1f2e] border border-[#1e293b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>
              <button
                onClick={addEvent}
                className="w-full py-3 border border-dashed border-[#1e293b] rounded-xl text-sm font-semibold hover:bg-[#1a1f2e] transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Event
              </button>
            </div>
            {/* Events List */}
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {(state.events || []).slice().reverse().map((evt, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#1a1f2e]/50 rounded-lg px-3 py-2 text-xs group hover:bg-[#1a1f2e] transition-colors">
                  <EventIcon type={evt.type} size={14} />
                  <span className={`font-bold ${evt.team === 'h' ? 'text-[#3b82f6]' : 'text-[#e63946]'}`}>
                    {evt.team === 'h' ? 'H' : 'A'}
                  </span>
                  <span className="text-emerald-400 font-bold">{evt.min}'</span>
                  <span className="text-[#94a3b8] truncate">{evt.player}</span>
                  <button
                    onClick={() => removeEvent(i)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all p-1 hover:bg-red-400/10 rounded"
                    title="Remove event"
                    aria-label="Remove event"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gradient-to-br from-[#0d111d] to-[#1a1d27] border border-[#1e293b] rounded-2xl p-6 space-y-3">
            <button
              onClick={copyOverlay}
              className="w-full py-3 border border-[#1e293b] rounded-xl text-sm font-semibold hover:bg-[#1a1f2e] transition-all flex items-center justify-center gap-2"
            >
              <Copy size={16} /> Copy OBS URL
            </button>
            <button
              onClick={resetMatch}
              className="w-full py-3 border border-[#1e293b] rounded-xl text-sm font-semibold text-red-400 hover:bg-[#1a1f2e] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Reset Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp2Dashboard;
