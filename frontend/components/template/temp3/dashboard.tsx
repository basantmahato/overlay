'use client';

import React, { useState } from 'react';
import { Trophy, Users, Target, Plus, Minus, Clock, ChevronLeft } from 'lucide-react';
import { MatchState } from '@/types';

// Dashboard props matching the registry interface
export interface Temp3DashboardProps {
  state: MatchState;
  setState: React.Dispatch<React.SetStateAction<MatchState>>;
  onPush: (patch: Partial<MatchState>) => void;
  obsUrl: string;
  onBack: () => void;
}

export const Temp3Dashboard: React.FC<Temp3DashboardProps> = ({
  state, setState, onPush, obsUrl, onBack
}) => {
  const [selectedPoints, setSelectedPoints] = useState<2 | 3 | 1>(2);

  // Basketball-specific helpers
  const updateScore = (team: 'h' | 'a', points: number) => {
    const key = team === 'h' ? 'teamA_score' : 'teamB_score';
    const current = (state[key as keyof MatchState] as number) || 0;
    const newVal = Math.max(0, current + points);
    onPush({ [key]: newVal });
  };

  const updatePeriod = (delta: number) => {
    const current = (state.match_phase || 'Q1').replace('Q', '');
    const newPeriod = Math.max(1, Math.min(4, parseInt(current) + delta));
    onPush({ match_phase: `Q${newPeriod}` });
  };

  const copyOverlay = () => {
    navigator.clipboard.writeText(obsUrl);
  };

  const periodButtons = ['Q1', 'Q2', 'Q3', 'Q4', 'OT'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={20} /> Back to Overlays
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-orange-500" size={24} />
            Basketball Scoreboard Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">Professional basketball overlay controls</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Panel */}
        <div className="space-y-6">
          {/* Period & Shot Clock */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Clock size={18} className="text-orange-500" /> Game Clock
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                  Period
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePeriod(-1)}
                    aria-label="Previous Period"
                    className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center text-2xl font-bold bg-zinc-800 rounded-lg py-2">
                    {state.match_phase || 'Q1'}
                  </span>
                  <button
                    onClick={() => updatePeriod(1)}
                    aria-label="Next Period"
                    className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label 
                  htmlFor="game-time"
                  className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block"
                >
                  Game Time
                </label>
                <input
                  id="game-time"
                  type="text"
                  value={state.match_time || '12:00'}
                  onChange={(e) => onPush({ match_time: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-center text-xl font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Team Configuration */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Users size={18} className="text-orange-500" /> Team Configuration
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Home Team */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Home Team</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={state.teamA_name}
                    onChange={(e) => setState(s => ({ ...s, teamA_name: e.target.value }))}
                    placeholder="Team Name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={state.teamA_abbr}
                      onChange={(e) => setState(s => ({ ...s, teamA_abbr: e.target.value }))}
                      placeholder="CODE"
                      className="w-20 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="color"
                      value={state.teamA_color}
                      onChange={(e) => setState(s => ({ ...s, teamA_color: e.target.value }))}
                      aria-label="Home team color"
                      className="w-14 h-12 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>
              {/* Away Team */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Away Team</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={state.teamB_name}
                    onChange={(e) => setState(s => ({ ...s, teamB_name: e.target.value }))}
                    placeholder="Team Name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={state.teamB_abbr}
                      onChange={(e) => setState(s => ({ ...s, teamB_abbr: e.target.value }))}
                      placeholder="CODE"
                      className="w-20 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="color"
                      value={state.teamB_color}
                      onChange={(e) => setState(s => ({ ...s, teamB_color: e.target.value }))}
                      aria-label="Away team color"
                      className="w-14 h-12 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Score Center */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Target size={18} className="text-orange-500" /> Live Score Center
            </h2>
            
            {/* Point Selector */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((points) => (
                <button
                  key={points}
                  onClick={() => setSelectedPoints(points as 2 | 3 | 1)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    selectedPoints === points
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {points}PT
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Home Score */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">{state.teamA_name}</h3>
                <div className="flex items-center justify-center gap-4 bg-zinc-800 rounded-2xl p-4">
                  <button
                    onClick={() => updateScore('h', -selectedPoints)}
                    className="w-12 h-12 rounded-full bg-zinc-700 hover:bg-orange-500 flex items-center justify-center transition-all"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>
                  <span className="text-5xl font-black font-mono w-16 text-center">{state.teamA_score}</span>
                  <button
                    onClick={() => updateScore('h', selectedPoints)}
                    className="w-12 h-12 rounded-full bg-zinc-700 hover:bg-orange-500 flex items-center justify-center transition-all"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>
              </div>
              {/* Away Score */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">{state.teamB_name}</h3>
                <div className="flex items-center justify-center gap-4 bg-zinc-800 rounded-2xl p-4">
                  <button
                    onClick={() => updateScore('a', -selectedPoints)}
                    className="w-12 h-12 rounded-full bg-zinc-700 hover:bg-orange-500 flex items-center justify-center transition-all"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>
                  <span className="text-5xl font-black font-mono w-16 text-center">{state.teamB_score}</span>
                  <button
                    onClick={() => updateScore('a', selectedPoints)}
                    className="w-12 h-12 rounded-full bg-zinc-700 hover:bg-orange-500 flex items-center justify-center transition-all"
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
          {/* Period Quick Select */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Period</h3>
            <div className="grid grid-cols-3 gap-2">
              {periodButtons.map((period) => (
                <button
                  key={period}
                  onClick={() => onPush({ match_phase: period })}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    state.match_phase === period
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <button
              onClick={copyOverlay}
              className="w-full py-3 border border-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              Copy OBS URL
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 border border-zinc-700 rounded-xl text-sm font-semibold text-red-400 hover:bg-zinc-800 transition-all"
            >
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp3Dashboard;
