import { ComponentType } from 'react';
import { MatchState } from '@/types';

// Import temp1 (Broadcast Pro Football Modern)
// import {
//   Temp1Dashboard,
//   Temp1Overlay,
//   Temp1Meta,
//   Temp1DashboardProps,
//   Temp1OverlayProps,
// } from '@/components/template/temp1';

// Import temp2 (Broadcast Pro Football)
import {
  Temp2Dashboard,
  Temp2Overlay,
  Temp2Meta,
  Temp2DashboardProps,
  Temp2OverlayProps,
} from '@/components/template/temp2';

// Dashboard component props base type
export interface DashboardProps {
  state: MatchState;
  setState: React.Dispatch<React.SetStateAction<MatchState>>;
  onPush: (patch: Partial<MatchState>) => void;
  obsUrl: string;
  onBack: () => void;
}

// Overlay component props base type
export interface OverlayProps {
  state: MatchState;
  bumpA?: boolean;
  bumpB?: boolean;
}

// Template metadata
export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  sport: string;
}

// Template entry in registry
export interface TemplateEntry {
  meta: TemplateMeta;
  dashboard: ComponentType<DashboardProps>;
  overlay: ComponentType<OverlayProps>;
}

// Template Registry - maps template IDs to their components
export const templateRegistry: Record<string, TemplateEntry> = {
  // [Temp1Meta.id]: {
  //   meta: Temp1Meta,
  //   dashboard: Temp1Dashboard as ComponentType<DashboardProps>,
  //   overlay: Temp1Overlay as ComponentType<OverlayProps>,
  // },
  [Temp2Meta.id]: {
    meta: Temp2Meta,
    dashboard: Temp2Dashboard as ComponentType<DashboardProps>,
    overlay: Temp2Overlay as ComponentType<OverlayProps>,
  },
  // [Temp3Meta.id]: {
  //   meta: Temp3Meta,
  //   dashboard: Temp3Dashboard as ComponentType<DashboardProps>,
  //   overlay: Temp3Overlay as ComponentType<OverlayProps>,
  // },
  // [Temp4Meta.id]: {
  //   meta: Temp4Meta,
  //   dashboard: Temp4Dashboard as ComponentType<DashboardProps>,
  //   overlay: Temp4Overlay as ComponentType<OverlayProps>,
  // },
  // ═══════════════════════════════════════════════════════════════════════════════
  // ADD NEW TEMPLATES HERE
  // ═══════════════════════════════════════════════════════════════════════════════
};

// Helper to get template entry by ID
export function getTemplate(templateId: string): TemplateEntry | undefined {
  return templateRegistry[templateId];
}

// Helper to check if template exists
export function hasTemplate(templateId: string): boolean {
  return templateId in templateRegistry;
}

// Get all available templates metadata
export function getAllTemplates(): TemplateMeta[] {
  return Object.values(templateRegistry).map(entry => entry.meta);
}
