'use client';

import React, { useState, useEffect, useRef } from 'react';

// Match Event interface
interface MatchEvent {
  type: string;
  team: 'h' | 'a';
  player: string;
  min: string;
  timestamp?: number;
}
import { 
  Info, Users, Target, Play, Pause, Plus, X, Copy, RefreshCw, 
  ChevronLeft, Trophy, Goal, Square, ArrowLeftRight, RotateCcw,
  List, UserPlus, Eye, EyeOff
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

export interface Temp2DashboardProps {
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
  const [newPlayerA, setNewPlayerA] = useState('');
  const [newPlayerB, setNewPlayerB] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
 
  // Migration: Auto-reset legacy 15:00 default to 0'
  useEffect(() => {
    if (state.match_time === '15:00') {
      onPush({ match_time: '0\'' });
    }
  }, [state.match_time, onPush]);

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
 
  const resetTimer = () => {
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    setState(s => ({ ...s, match_time: "0'" }));
    onPush({ match_time: "0'" });
  };

  const updateScore = (team: 'h' | 'a', delta: number) => {
    const key = team === 'h' ? 'teamA_score' : 'teamB_score';
    const newVal = Math.max(0, (state[key as keyof MatchState] as number || 0) + delta);
    onPush({ [key]: newVal });
  };

  const setStatus = (status: string) => {
    onPush({ match_phase: status });
  };

  const addPlayer = (team: 'h' | 'a') => {
    const name = team === 'h' ? newPlayerA : newPlayerB;
    if (!name.trim()) return;
    
    const key = team === 'h' ? 'teamA_players' : 'teamB_players';
    const current = state[key] || [];
    const updated = [...current, name.trim()];
    
    onPush({ [key]: updated });
    if (team === 'h') setNewPlayerA(''); else setNewPlayerB('');
  };

  const removePlayer = (team: 'h' | 'a', index: number) => {
    const key = team === 'h' ? 'teamA_players' : 'teamB_players';
    const updated = (state[key] || []).filter((_: any, i: number) => i !== index);
    onPush({ [key]: updated });
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
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all mb-6 font-medium group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Overlays
        </button>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              Pro Broadcast Control
            </h1>
            <p className="text-muted-foreground mt-2 font-medium text-sm sm:text-base">Professional soccer match overlay controls</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-card border border-border px-4 py-2 rounded-2xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">System Online</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Main Panel */}
        <div className="space-y-6 sm:space-y-8">
          {/* Match Information */}
          <div className="bg-card border border-border rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Info size={18} className="text-primary" /> Match Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label 
                  htmlFor="competition-input"
                  className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1"
                >
                  Competition / League
                </label>
                <input
                  id="competition-input"
                  type="text"
                  value={state.competition || ''}
                  onChange={(e) => setState(s => ({ ...s, competition: e.target.value }))}
                  onBlur={(e) => onPush({ competition: e.target.value })}
                  placeholder="e.g. Premier League"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor="venue-input"
                  className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1"
                >
                  Venue / Stadium
                </label>
                <input
                  id="venue-input"
                  type="text"
                  value={state.venue || ''}
                  onChange={(e) => setState(s => ({ ...s, venue: e.target.value }))}
                  onBlur={(e) => onPush({ venue: e.target.value })}
                  placeholder="e.g. Old Trafford"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Team Configuration */}
          <div className="bg-card border border-border rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Users size={18} className="text-primary" /> Team Configuration
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Home Team */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Home Team</h3>
                <div className="space-y-3">
                  <input
                    id="team-a-name"
                    type="text"
                    value={state.teamA_name || ''}
                    onChange={(e) => setState(s => ({ ...s, teamA_name: e.target.value }))}
                    onBlur={(e) => onPush({ teamA_name: e.target.value })}
                    placeholder="Team Name"
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all"
                  />
                  <div className="flex gap-3">
                    <input
                      id="team-a-abbr"
                      type="text"
                      value={state.teamA_abbr || ''}
                      onChange={(e) => setState(s => ({ ...s, teamA_abbr: e.target.value }))}
                      onBlur={(e) => onPush({ teamA_abbr: e.target.value })}
                      placeholder="Code"
                      maxLength={3}
                      className="w-24 bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-center focus:outline-none focus:border-primary transition-all uppercase"
                    />
                    <div className="flex-1 flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4">
                      <input
                        type="color"
                        value={state.teamA_color || '#a3e635'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setState(s => ({ ...s, teamA_color: val }));
                          onPush({ teamA_color: val });
                        }}
                        aria-label="Home team brand color"
                        title="Home team brand color"
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0"
                      />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Brand Color</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Away Team */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Away Team</h3>
                <div className="space-y-3">
                  <input
                    id="team-b-name"
                    type="text"
                    value={state.teamB_name || ''}
                    onChange={(e) => setState(s => ({ ...s, teamB_name: e.target.value }))}
                    onBlur={(e) => onPush({ teamB_name: e.target.value })}
                    placeholder="Team Name"
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-primary transition-all"
                  />
                  <div className="flex gap-3">
                    <input
                      id="team-b-abbr"
                      type="text"
                      value={state.teamB_abbr || ''}
                      onChange={(e) => setState(s => ({ ...s, teamB_abbr: e.target.value }))}
                      onBlur={(e) => onPush({ teamB_abbr: e.target.value })}
                      placeholder="Code"
                      maxLength={3}
                      className="w-24 bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-center focus:outline-none focus:border-primary transition-all uppercase"
                    />
                    <div className="flex-1 flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4">
                      <input
                        type="color"
                        value={state.teamB_color || '#f8fafc'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setState(s => ({ ...s, teamB_color: val }));
                          onPush({ teamB_color: val });
                        }}
                        aria-label="Away team brand color"
                        title="Away team brand color"
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0"
                      />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Brand Color</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Score Center */}
          <div className="bg-card border-4 border-foreground rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6">
              <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/30 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Broadcast
              </span>
            </div>
            <h2 className="text-xl font-black flex items-center gap-2 mb-10 tracking-tight">
              <Target size={22} className="text-primary" /> 
              Score Control
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4 px-0 sm:px-4">
              {/* Home Score */}
              <div className="flex-1 text-center space-y-4 sm:space-y-6 w-full">
                <h3 className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] truncate max-w-[150px] mx-auto">{state.teamA_name || 'Home'}</h3>
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <button
                    onClick={() => updateScore('h', -1)}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-muted border border-border hover:bg-foreground hover:text-background flex items-center justify-center transition-all shadow-md"
                  >
                    <span className="text-xl sm:text-2xl font-black">−</span>
                  </button>
                  <div className="relative">
                    <span className="text-6xl sm:text-8xl font-black font-mono tabular-nums tracking-tighter text-foreground drop-shadow-xl">{state.teamA_score}</span>
                  </div>
                  <button
                    onClick={() => updateScore('h', 1)}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary text-black border border-primary/20 flex items-center justify-center transition-all shadow-lg"
                  >
                    <span className="text-xl sm:text-2xl font-black">+</span>
                  </button>
                </div>
              </div>
 
              <div className="text-2xl sm:text-4xl font-black text-muted-foreground/20 hidden sm:block">VS</div>
 
              {/* Away Score */}
              <div className="flex-1 text-center space-y-4 sm:space-y-6 w-full">
                <h3 className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] truncate max-w-[150px] mx-auto">{state.teamB_name || 'Away'}</h3>
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <button
                    onClick={() => updateScore('a', -1)}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-muted border border-border hover:bg-foreground hover:text-background flex items-center justify-center transition-all shadow-md"
                  >
                    <span className="text-xl sm:text-2xl font-black">−</span>
                  </button>
                  <span className="text-6xl sm:text-8xl font-black font-mono tabular-nums tracking-tighter text-foreground drop-shadow-xl">{state.teamB_score}</span>
                  <button
                    onClick={() => updateScore('a', 1)}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary text-black border border-primary/20 flex items-center justify-center transition-all shadow-lg"
                  >
                    <span className="text-xl sm:text-2xl font-black">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Team Rosters */}
          <div className="bg-card border border-border rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <List size={18} className="text-primary" /> Team Rosters
              </h2>
              <button
                onClick={() => onPush({ showLineups: !state.showLineups })}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                  state.showLineups 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-muted border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {state.showLineups ? <EyeOff size={14} /> : <Eye size={14} />}
                {state.showLineups ? 'Live on Overlay' : 'Show on Overlay'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {/* Team A Roster */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">{state.teamA_name || 'Home'} Roster</h3>
                <div className="flex gap-2 min-w-0">
                  <input
                    type="text"
                    value={newPlayerA}
                    onChange={(e) => setNewPlayerA(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer('h')}
                    placeholder="Add player..."
                    className="flex-1 min-w-0 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => addPlayer('h')}
                    aria-label="Add player to home team"
                    title="Add player to home team"
                    className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center hover:bg-primary/90 transition-all shadow-md"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {(state.teamA_players || []).map((name: string, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-muted/30 border border-border/50 rounded-xl px-4 py-2 text-sm group">
                      <span className="font-bold text-foreground">{name}</span>
                      <button 
                        onClick={() => removePlayer('h', i)} 
                        aria-label={`Remove ${name} from roster`}
                        title={`Remove ${name} from roster`}
                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team B Roster */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">{state.teamB_name || 'Away'} Roster</h3>
                <div className="flex gap-2 min-w-0">
                  <input
                    type="text"
                    value={newPlayerB}
                    onChange={(e) => setNewPlayerB(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer('a')}
                    placeholder="Add player..."
                    className="flex-1 min-w-0 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => addPlayer('a')}
                    aria-label="Add player to away team"
                    title="Add player to away team"
                    className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center hover:bg-primary/90 transition-all shadow-md"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {(state.teamB_players || []).map((name: string, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-muted/30 border border-border/50 rounded-xl px-4 py-2 text-sm group">
                      <span className="font-bold text-foreground">{name}</span>
                      <button 
                        onClick={() => removePlayer('a', i)} 
                        aria-label={`Remove ${name} from roster`}
                        title={`Remove ${name} from roster`}
                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* Display Settings */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-1">Display Settings</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Scoreboard Position</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'top-center', label: 'Top Center' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'bottom-right', label: 'Bottom Right' }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => onPush({ position: pos.id })}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      (state.position || 'bottom-center') === pos.id 
                        ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                        : 'bg-muted/50 border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border mt-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Visibility Controls</label>
              <button
                onClick={() => onPush({ showLineups: !state.showLineups })}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  state.showLineups 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-muted/50 border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {state.showLineups ? <EyeOff size={16} /> : <Eye size={16} />}
                {state.showLineups ? 'Hide Lineups' : 'Show Lineups'}
              </button>
            </div>
          </div>

          {/* Match Status */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-1">Match Phase</h3>
            <div className="grid grid-cols-2 gap-3">
              {statusButtons.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`py-4 rounded-xl text-xs font-black transition-all tracking-widest ${
                    state.match_phase === key 
                      ? 'bg-foreground text-background shadow-lg shadow-black/10' 
                      : 'bg-muted/50 border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <label 
                htmlFor="current-minute"
                className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block px-1"
              >
                Match Timer
              </label>
              <div className="flex flex-col xl:flex-row gap-3">
                <input
                  id="current-minute"
                  type="text"
                  value={state.match_time || ''}
                  onChange={(e) => setState(s => ({ ...s, match_time: e.target.value }))}
                  onBlur={(e) => onPush({ match_time: e.target.value })}
                  placeholder="0'"
                  className="w-full xl:flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-lg font-black font-mono focus:outline-none focus:border-primary transition-all"
                />
                <div className="flex gap-2 justify-center xs:justify-start">
                  <button 
                    onClick={resetTimer}
                    aria-label="Reset timer"
                    title="Reset timer"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all shadow-md flex-shrink-0"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button 
                    onClick={toggleTimer}
                    aria-label={isTimerRunning ? "Pause timer" : "Start timer"}
                    title={isTimerRunning ? "Pause timer" : "Start timer"}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all shadow-lg flex-shrink-0 ${
                      isTimerRunning 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                        : 'bg-primary text-black hover:bg-primary/90 shadow-primary/20'
                    }`}
                  >
                    {isTimerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Match Events */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Events</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  aria-label="Select event type"
                  title="Select event type"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option>Goal</option>
                  <option>Yellow Card</option>
                  <option>Red Card</option>
                  <option>Substitution</option>
                </select>
                <select
                  value={eventTeam}
                  onChange={(e) => {
                    setEventTeam(e.target.value);
                    setEventPlayer(''); // Reset player when team changes
                  }}
                  aria-label="Select team for event"
                  title="Select team for event"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option value="h">{state.teamA_name || 'Home'}</option>
                  <option value="a">{state.teamB_name || 'Away'}</option>
                </select>
                <div className="flex gap-3">
                  {((eventTeam === 'h' ? state.teamA_players : state.teamB_players) || []).length > 0 ? (
                    <select
                      value={eventPlayer}
                      onChange={(e) => setEventPlayer(e.target.value)}
                      aria-label="Select player for event"
                      title="Select player for event"
                      className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="">Select Player...</option>
                      {((eventTeam === 'h' ? state.teamA_players : state.teamB_players) || []).map((name: string, idx: number) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                      <option value="custom">-- Type Name --</option>
                    </select>
                  ) : null}
                  
                  {(!((eventTeam === 'h' ? state.teamA_players : state.teamB_players) || []).length || eventPlayer === 'custom') && (
                    <input
                      type="text"
                      value={eventPlayer === 'custom' ? '' : eventPlayer}
                      onChange={(e) => setEventPlayer(e.target.value)}
                      placeholder="Player Name"
                      className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                    />
                  )}
                  
                  <select
                    value={eventMin}
                    onChange={(e) => setEventMin(e.target.value)}
                    aria-label="Select match minute"
                    title="Select match minute"
                    className="w-24 bg-muted/50 border border-border rounded-xl px-2 py-3.5 text-sm font-black text-center focus:outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="">Min</option>
                    {Array.from({ length: 95 }, (_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>{i + 1}'</option>
                    ))}
                    <option value="45+">45+'</option>
                    <option value="90+">90+'</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addEvent}
                className="w-full py-4 bg-foreground text-background rounded-xl text-sm font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5"
              >
                <Plus size={18} /> Register Event
              </button>
            </div>
            {/* Events List */}
            <div className="mt-8 space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {(state.events || []).slice().reverse().map((evt: MatchEvent, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-muted/30 border border-border/50 rounded-2xl px-4 py-3 text-xs group hover:bg-muted/80 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shadow-sm">
                    <EventIcon type={evt.type} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`font-black uppercase tracking-tighter ${evt.team === 'h' ? 'text-primary' : 'text-foreground'}`}>
                        {evt.team === 'h' ? 'Home' : 'Away'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-primary font-black">{evt.min}'</span>
                    </div>
                    <div className="text-foreground font-bold tracking-tight truncate max-w-[140px]">{evt.player}</div>
                  </div>
                  <button
                    onClick={() => removeEvent(i)}
                    aria-label="Remove event"
                    title="Remove event"
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all p-1.5 hover:bg-red-500/10 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-foreground text-background rounded-[2rem] p-8 space-y-4 shadow-2xl">
            <button
              onClick={copyOverlay}
              className="w-full py-4 bg-background text-foreground border border-border/10 rounded-xl text-sm font-black hover:bg-background/90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Copy size={18} /> Copy OBS URL
            </button>
            <button
              onClick={resetMatch}
              className="w-full py-4 text-background/60 hover:text-red-400 text-xs font-black transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Reset Match Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp2Dashboard;
