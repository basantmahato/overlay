import { ComponentType } from 'react';
import { DashboardProps, OverlayProps } from '@/types';

// Import types from templateRegistry
import { TemplateMeta, TemplateEntry } from './templateRegistry';
export type { TemplateMeta, TemplateEntry };

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD COMPONENT IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════
import { Temp2Dashboard, Temp2Meta } from '@/components/template/temp2';

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY COMPONENT IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════
import { Temp2Overlay } from '@/components/template/temp2';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT REGISTRIES - Maps component names from template config
// ═══════════════════════════════════════════════════════════════════════════════

export const dashboardRegistry: Record<string, ComponentType<DashboardProps>> = {
  // Football templates
  FootballBroadcastDashboard: Temp2Dashboard,
};

export const overlayRegistry: Record<string, ComponentType<OverlayProps>> = {
  // Football templates
  FootballBroadcastOverlay: Temp2Overlay,
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY TEMPLATE REGISTRY - For backwards compatibility during transition
// ═══════════════════════════════════════════════════════════════════════════════

export const templateRegistry: Record<string, TemplateEntry> = {
  [Temp2Meta.id]: {
    meta: Temp2Meta,
    dashboard: Temp2Dashboard as ComponentType<DashboardProps>,
    overlay: Temp2Overlay as ComponentType<OverlayProps>,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getDashboardComponent(name: string): ComponentType<DashboardProps> | undefined {
  return dashboardRegistry[name];
}

export function getOverlayComponent(name: string): ComponentType<OverlayProps> | undefined {
  return overlayRegistry[name];
}

export function hasDashboardComponent(name: string): boolean {
  return name in dashboardRegistry;
}

export function hasOverlayComponent(name: string): boolean {
  return name in overlayRegistry;
}

export function listRegisteredDashboards(): string[] {
  return Object.keys(dashboardRegistry);
}

export function listRegisteredOverlays(): string[] {
  return Object.keys(overlayRegistry);
}
