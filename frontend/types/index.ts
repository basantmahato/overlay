export interface MatchEvent {
  type: string;
  team: 'h' | 'a';
  player: string;
  min: string;
  timestamp?: number; // Unix timestamp when event was added
}

// Flexible MatchState - templates can have any fields
export type MatchState = Record<string, any>;

// Template configuration from backend
export interface TemplateConfig {
  sport: string;
  category: string;
  defaultState: MatchState;
  dashboardComponent: string;
  overlayComponent: string;
}

export interface Template {
  id: string;
  name: string;
  configJson?: TemplateConfig;
}

export interface Overlay {
  id: string;
  name: string;
  isActive: boolean;
  renderedConfigJson: MatchState;
  template: Template;
}

// Dashboard component props
export interface DashboardProps {
  state: MatchState;
  setState: React.Dispatch<React.SetStateAction<MatchState>>;
  onPush: (patch: Partial<MatchState>) => void;
  obsUrl: string;
  onBack: () => void;
}

// Overlay component props
export interface OverlayProps {
  state: MatchState;
  bumpA?: boolean;
  bumpB?: boolean;
}
