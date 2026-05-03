'use client';

import React, { useState } from 'react';
import { Trophy, User, Target, Plus, Minus, ChevronLeft } from 'lucide-react';
import { MatchState } from '@/types';
import { formatTennisPoint } from './types';

export interface Temp4DashboardProps {
  state: MatchState;
  setState: React.Dispatch<React.SetStateAction<MatchState>>;
  onPush: (patch: Partial<MatchState>) => void;
  obsUrl: string;
  onBack: () => void;
}

export const Temp4Dashboard: React.FC<Temp4DashboardProps> = ({
  state, setState, onPush, obsUrl, onBack
}) => {
  // Tennis-specific helpers
  const getPoints = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'teamA_score' : 'teamB_score';
    return (state[key as keyof MatchState] as number) || 0;
  };

  const addPoint = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'teamA_score' : 'teamB_score';
    const current = getPoints(team);
    let newPoints = current + 1;
    
    // Cap at 4 (AD)
    if (newPoints > 4) newPoints = 4;
    
    onPush({ [key]: newPoints });
  };

  const removePoint = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'teamA_score' : 'teamB_score';
    const current = getPoints(team);
    let newPoints = current - 1;
    
    if (newPoints < 0) newPoints = 0;
    
    onPush({ [key]: newPoints });
  };

  const addGame = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'homeGames' : 'awayGames';
    const current = (state[key as keyof MatchState] as number) || 0;
    onPush({ [key]: current + 1 });
    
    // Reset points after game
    onPush({ teamA_score: 0, teamB_score: 0 });
  };

  const removeGame = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'homeGames' : 'awayGames';
    const current = (state[key as keyof MatchState] as number) || 0;
    if (current > 0) {
      onPush({ [key]: current - 1 });
    }
  };

  const addSet = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'homeSets' : 'awaySets';
    const current = (state[key as keyof MatchState] as number) || 0;
    onPush({ [key]: current + 1 });
    
    // Reset games after set
    onPush({ homeGames: 0, awayGames: 0, teamA_score: 0, teamB_score: 0 });
  };

  const removeSet = (team: 'h' | 'a') => {
    const key = team === 'h' ? 'homeSets' : 'awaySets';
    const current = (state[key as keyof MatchState] as number) || 0;
    if (current > 0) {
      onPush({ [key]: current - 1 });
    }
  };

  const toggleServer = () => {
    const current = (state.server as 'home' | 'away') || 'home';
    onPush({ server: current === 'home' ? 'away' : 'home' });
  };

  const copyOverlay = () => {
    navigator.clipboard.writeText(obsUrl);
  };

  const surfaces = ['HARD', 'CLAY', 'GRASS'];
  const rounds = ['R128', 'R64', 'R32', 'R16', 'QF', 'SF', 'Final'];

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white p-6">
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
            <Trophy className="text-green-500" size={24} />
            Tennis Scoreboard Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">Professional tennis overlay controls</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Panel */}
        <div className="space-y-6">
          {/* Match Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Target size={18} className="text-green-500" /> Match Information
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label 
                  htmlFor="surface-select"
                  className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block"
                >
                  Surface
                </label>
                <select
                  id="surface-select"
                  value={state.surface || 'HARD'}
                  onChange={(e) => onPush({ surface: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                >
                  {surfaces.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label 
                  htmlFor="round-select"
                  className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block"
                >
                  Round
                </label>
                <select
                  id="round-select"
                  value={state.round || 'Final'}
                  onChange={(e) => onPush({ round: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                >
                  {rounds.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                  Server
                </label>
                <button
                  onClick={toggleServer}
                  className="w-full py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-all"
                >
                  {(state.server as string) || 'home'} ▼
                </button>
              </div>
            </div>
          </div>

          {/* Players Configuration */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <User size={18} className="text-green-500" /> Players
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Player 1 */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Player 1</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={state.teamA_name}
                    onChange={(e) => setState(s => ({ ...s, teamA_name: e.target.value }))}
                    placeholder="Player Name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={state.teamA_abbr}
                      onChange={(e) => setState(s => ({ ...s, teamA_abbr: e.target.value }))}
                      placeholder="ABC"
                      className="w-20 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="color"
                      value={state.teamA_color}
                      onChange={(e) => setState(s => ({ ...s, teamA_color: e.target.value }))}
                      aria-label="Player 1 color"
                      className="w-14 h-12 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>
              {/* Player 2 */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Player 2</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={state.teamB_name}
                    onChange={(e) => setState(s => ({ ...s, teamB_name: e.target.value }))}
                    placeholder="Player Name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={state.teamB_abbr}
                      onChange={(e) => setState(s => ({ ...s, teamB_abbr: e.target.value }))}
                      placeholder="XYZ"
                      className="w-20 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="color"
                      value={state.teamB_color}
                      onChange={(e) => setState(s => ({ ...s, teamB_color: e.target.value }))}
                      aria-label="Player 2 color"
                      className="w-14 h-12 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scoreboard Controls */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Target size={18} className="text-green-500" /> Scoreboard
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Player 1 Score */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">{state.teamA_name}</h3>
                
                {/* Sets */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3 mb-2">
                  <span className="text-zinc-400">Sets</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeSet('h')} 
                      aria-label="Decrease Player 1 sets"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-black w-8 text-center">{(state.homeSets as number) || 0}</span>
                    <button 
                      onClick={() => addSet('h')} 
                      aria-label="Increase Player 1 sets"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-green-500 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Games */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3 mb-2">
                  <span className="text-zinc-400">Games</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeGame('h')} 
                      aria-label="Decrease Player 1 games"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-black w-8 text-center">{(state.homeGames as number) || 0}</span>
                    <button 
                      onClick={() => addGame('h')} 
                      aria-label="Increase Player 1 games"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-green-500 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Points */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3">
                  <span className="text-zinc-400">Points</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removePoint('h')} 
                      aria-label="Decrease Player 1 points"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-black w-12 text-center">{formatTennisPoint(getPoints('h'))}</span>
                    <button 
                      onClick={() => addPoint('h')} 
                      aria-label="Increase Player 1 points"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-green-500 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Player 2 Score */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">{state.teamB_name}</h3>
                
                {/* Sets */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3 mb-2">
                  <span className="text-zinc-400">Sets</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeSet('a')} 
                      aria-label="Decrease Player 2 sets"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-black w-8 text-center">{(state.awaySets as number) || 0}</span>
                    <button 
                      onClick={() => addSet('a')} 
                      aria-label="Increase Player 2 sets"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-green-500 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Games */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3 mb-2">
                  <span className="text-zinc-400">Games</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeGame('a')} 
                      aria-label="Decrease Player 2 games"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-black w-8 text-center">{(state.awayGames as number) || 0}</span>
                    <button 
                      onClick={() => addGame('a')} 
                      aria-label="Increase Player 2 games"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-green-500 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Points */}
                <div className="flex items-center justify-between bg-zinc-800 rounded-xl p-3">
                  <span className="text-zinc-400">Points</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removePoint('a')} 
                      aria-label="Decrease Player 2 points"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-2xl font-black w-12 text-center">{formatTennisPoint(getPoints('a'))}</span>
                    <button 
                      onClick={() => addPoint('a')} 
                      aria-label="Increase Player 2 points"
                      className="w-8 h-8 rounded bg-zinc-700 hover:bg-green-500 flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
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
              Reset Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temp4Dashboard;
