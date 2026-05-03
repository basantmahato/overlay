'use client';

import React from 'react';
import { MatchState } from '@/types';
import { formatTennisPoint } from './types';

export interface Temp4OverlayProps {
  state: MatchState;
  bumpA?: boolean;
  bumpB?: boolean;
}

export const Temp4Overlay: React.FC<Temp4OverlayProps> = ({ state, bumpA, bumpB }) => {
  const homeSets = (state.homeSets as number) || 0;
  const awaySets = (state.awaySets as number) || 0;
  const homeGames = (state.homeGames as number) || 0;
  const awayGames = (state.awayGames as number) || 0;
  const homePoints = formatTennisPoint((state.teamA_score as number) || 0);
  const awayPoints = formatTennisPoint((state.teamB_score as number) || 0);
  const server = (state.server as 'home' | 'away') || 'home';
  const surface = (state.surface as string) || 'HARD';
  const round = (state.round as string) || 'Final';

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .score-change { animation: pulse 0.5s ease-out; }
        
        @keyframes serve {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .serving { animation: serve 1.5s ease-in-out infinite; }
        .overlay-container-temp4 {
          --team-a-color: ${state.teamA_color || '#22c55e'};
          --team-b-color: ${state.teamB_color || '#3b82f6'};
        }
      `}</style>

      {/* Tennis Scoreboard */}
      <div className="fixed top-8 right-8 overlay-container-temp4">
        <div className="bg-gradient-to-b from-zinc-900 to-black rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden min-w-[320px]">
          {/* Header - Surface & Round */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{surface}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{round}</span>
          </div>

          {/* Score Table */}
          <div className="p-4">
            {/* Player 1 Row */}
            <div className={`flex items-center justify-between py-3 border-b border-zinc-800 ${bumpA ? 'score-change' : ''}`}>
              <div className="flex items-center gap-3">
                {/* Server indicator */}
                <div className={`w-3 h-3 rounded-full ${server === 'home' ? 'bg-green-500 serving' : 'bg-transparent'}`} />
                <div 
                  className="w-1 h-8 rounded-full bg-[var(--team-a-color)]"
                />
                <span className="font-bold text-lg">{state.teamA_abbr || 'P1'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-400 w-8 text-center">{homeSets}</span>
                <span className="text-2xl font-black text-zinc-400 w-8 text-center">{homeGames}</span>
                <span className="text-3xl font-black text-green-400 w-12 text-center">{homePoints}</span>
              </div>
            </div>

            {/* Player 2 Row */}
            <div className={`flex items-center justify-between py-3 ${bumpB ? 'score-change' : ''}`}>
              <div className="flex items-center gap-3">
                {/* Server indicator */}
                <div className={`w-3 h-3 rounded-full ${server === 'away' ? 'bg-green-500 serving' : 'bg-transparent'}`} />
                <div 
                  className="w-1 h-8 rounded-full bg-[var(--team-b-color)]"
                />
                <span className="font-bold text-lg">{state.teamB_abbr || 'P2'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-400 w-8 text-center">{awaySets}</span>
                <span className="text-2xl font-black text-zinc-400 w-8 text-center">{awayGames}</span>
                <span className="text-3xl font-black text-green-400 w-12 text-center">{awayPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Temp4Overlay;
