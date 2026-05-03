'use client';

import React from 'react';
import { MatchState } from '@/types';

export interface Temp3OverlayProps {
  state: MatchState;
  bumpA?: boolean;
  bumpB?: boolean;
}

export const Temp3Overlay: React.FC<Temp3OverlayProps> = ({ state, bumpA, bumpB }) => {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); color: #f97316; }
          100% { transform: scale(1); }
        }
        .score-change { animation: pulse 0.5s ease-out; }
        .overlay-container-temp3 {
          --team-a-color: ${state.teamA_color || '#ff6600'};
          --team-b-color: ${state.teamB_color || '#0066ff'};
        }
      `}</style>

      {/* Basketball Scoreboard - Center Bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 overlay-container-temp3">
        <div className="flex items-stretch h-20 bg-gradient-to-b from-zinc-900 to-black rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden">
          
          {/* Home Team */}
          <div className="flex items-center px-6 gap-4 relative">
            <div 
              className="absolute left-0 top-0 w-1.5 h-full bg-[var(--team-a-color)]"
            />
            <div className="text-right">
              <span className="text-3xl font-black tracking-tight">
                {state.teamA_abbr || 'HOU'}
              </span>
            </div>
            <span className={`text-5xl font-black w-14 text-center ${bumpA ? 'score-change' : ''}`}>
              {state.teamA_score}
            </span>
          </div>

          {/* Center - Period & Time */}
          <div className="flex flex-col items-center justify-center min-w-[120px] bg-zinc-800/50 px-6 border-x border-zinc-700">
            <span className="text-2xl font-black text-orange-500 leading-none">
              {state.match_phase || 'Q1'}
            </span>
            <span className="text-3xl font-black leading-none mt-1 font-mono">
              {state.match_time || '12:00'}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center px-6 gap-4 relative">
            <span className={`text-5xl font-black w-14 text-center ${bumpB ? 'score-change' : ''}`}>
              {state.teamB_score}
            </span>
            <div className="text-left">
              <span className="text-3xl font-black tracking-tight">
                {state.teamB_abbr || 'LAL'}
              </span>
            </div>
            <div 
              className="absolute right-0 top-0 w-1.5 h-full bg-[var(--team-b-color)]"
            />
          </div>
        </div>

        {/* Possession Indicator */}
        <div className="flex justify-center mt-2 gap-4">
          <div 
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              state.possession === 'A' 
                ? 'bg-orange-500 text-white' 
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            ▶ HOME
          </div>
          <div 
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              state.possession === 'B' 
                ? 'bg-orange-500 text-white' 
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            AWAY ◀
          </div>
        </div>
      </div>
    </>
  );
};

export default Temp3Overlay;
