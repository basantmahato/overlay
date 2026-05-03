import { MatchState, MatchEvent } from '@/types';

// Tennis-specific state extensions
export interface TennisState extends MatchState {
  // Tennis uses sets and games instead of score
  homeSets: number;
  awaySets: number;
  homeGames: number;
  awayGames: number;
  
  // Current game points (0, 15, 30, 40, AD)
  homePoints: number | 'AD';
  awayPoints: number | 'AD';
  
  // Match info
  matchFormat: '3SETS' | '5SETS';
  surface: 'HARD' | 'CLAY' | 'GRASS';
  round: string;
  
  // Server tracking
  server: 'home' | 'away';
  
  // Tiebreak
  isTiebreak: boolean;
  tiebreakHome: number;
  tiebreakAway: number;
}

// Tennis events
export interface TennisEvent extends MatchEvent {
  type: 'POINT' | 'BREAK' | 'SET' | 'MATCH' | 'ACE' | 'DF';
  description?: string;
}

// Tennis point values
export const TENNIS_POINTS = [0, 15, 30, 40, 'AD'] as const;

// Default tennis state
export const DEFAULT_TENNIS_STATE: Partial<TennisState> = {
  teamA_name: 'Player 1',
  teamA_abbr: 'P1',
  teamA_color: '#22c55e',
  teamA_score: 0, // Points in current game
  teamB_name: 'Player 2',
  teamB_abbr: 'P2',
  teamB_color: '#3b82f6',
  teamB_score: 0,
  homeSets: 0,
  awaySets: 0,
  homeGames: 0,
  awayGames: 0,
  homePoints: 0,
  awayPoints: 0,
  matchFormat: '3SETS',
  surface: 'HARD',
  round: 'Final',
  server: 'home',
  isTiebreak: false,
  tiebreakHome: 0,
  tiebreakAway: 0,
  match_time: 'Set 1',
  match_phase: 'Live',
};

// Helper to format tennis points
export function formatTennisPoint(point: number | 'AD'): string {
  if (point === 'AD') return 'AD';
  const values = ['0', '15', '30', '40'];
  return values[point] || '0';
}
