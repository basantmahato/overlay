import { MatchState, MatchEvent } from '@/types';

// Basketball-specific state extensions
export interface BasketballState extends MatchState {
  // Basketball uses periods instead of match_time/match_phase
  period: number;
  periodTime: string;
  shotClock: number;
  
  // Team stats
  homeFouls: number;
  awayFouls: number;
  homeTimeouts: number;
  awayTimeouts: number;
  
  // Game state (extends base possession field)
  hasPossession: 'home' | 'away' | null;
  bonus: {
    home: boolean;
    away: boolean;
  };
}

// Basketball events
export interface BasketballEvent extends MatchEvent {
  type: '2PT' | '3PT' | 'FT' | 'FOUL' | 'TIMEOUT' | 'SUB';
  points?: number;
}

// Default basketball state
export const DEFAULT_BASKETBALL_STATE: Partial<BasketballState> = {
  teamA_name: 'HOME',
  teamA_abbr: 'HOU',
  teamA_color: '#ff6600',
  teamA_score: 0,
  teamB_name: 'AWAY',
  teamB_abbr: 'LAL',
  teamB_color: '#0066ff',
  teamB_score: 0,
  period: 1,
  periodTime: '12:00',
  shotClock: 24,
  match_time: '12:00', // For compatibility with MatchState
  match_phase: 'Q1',
  homeFouls: 0,
  awayFouls: 0,
  homeTimeouts: 7,
  awayTimeouts: 7,
  possession: 'A',
  hasPossession: null,
  bonus: { home: false, away: false },
};
