export interface MatchEvent {
  type: string;
  team: 'h' | 'a';
  player: string;
  min: string;
  timestamp?: number; // Unix timestamp when event was added
}

export interface MatchState {
  teamA_name: string;
  teamA_abbr: string;
  teamA_color: string;
  teamA_score: number;
  teamB_name: string;
  teamB_abbr: string;
  teamB_color: string;
  teamB_score: number;
  match_time: string;
  match_phase: string;
  match_date?: string;
  kickoff_time?: string;
  play_clock: number;
  down_distance: string;
  possession: string;
  competition?: string;
  venue?: string;
  event?: { text: string; timestamp: number } | null;
  events?: MatchEvent[];
  teamA_players?: string[];
  teamB_players?: string[];
  // Match Statistics
  teamA_shots?: number;
  teamA_shots_on_target?: number;
  teamA_corners?: number;
  teamA_fouls?: number;
  teamB_shots?: number;
  teamB_shots_on_target?: number;
  teamB_corners?: number;
  teamB_fouls?: number;
  possession_A?: number; // Percentage 0-100
  // Event Display Settings
  eventDisplayMinutes?: number; // How long events show in ticker (default 1 min)
}

export interface Template {
  id: string;
  name: string;
}

export interface Overlay {
  id: string;
  name: string;
  isActive: boolean;
  renderedConfigJson: MatchState;
  template: Template;
}
