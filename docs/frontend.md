# Frontend Architecture

## Overview
The frontend is built with **Next.js 16**, **React**, **TypeScript**, and **Tailwind CSS**. It provides a dashboard for managing overlays and dynamic overlay rendering for OBS Browser Sources.

## Key Features

### 🧩 Dynamic Component Loading
- **Component Registry** - Maps template component names to actual React components
- No hardcoded imports in pages - components loaded dynamically based on template config
- Scalable for 50+ templates

### 📊 Flexible State Management
- **MatchState** type is `Record<string, any>` - supports arbitrary fields per template
- Each template can have different fields without type conflicts

### 🔌 Real-time Synchronization
- Socket.io client for instant updates between dashboard and overlay
- Automatic state syncing via `liveUpdate` and `stateUpdated` events

## Project Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── overlays/
│   │   │   └── page.tsx         # Overlay management & dynamic dashboard
│   │   └── templates/
│   │       └── page.tsx         # Template gallery
│   └── overlay/
│       └── [overlayId]/
│           └── page.tsx          # Dynamic overlay renderer
├── components/
│   └── template/
│       └── temp2/               # Template-specific components
│           ├── dashboard.tsx    # Dashboard UI
│           ├── overlay.tsx      # Overlay UI
│           └── index.ts         # Exports & metadata
├── lib/
│   ├── componentRegistry.ts    # Dynamic component registry
│   └── api.ts                  # API client
└── types/
    └── index.ts                # TypeScript interfaces (flexible MatchState)
```

## Component Registry

`lib/componentRegistry.ts` maps template component names to React components:

```typescript
export const dashboardRegistry: Record<string, ComponentType<DashboardProps>> = {
  FootballBroadcastDashboard: Temp2Dashboard,
  FootballModernDashboard: Temp1Dashboard,
  // Add new templates here...
};

export const overlayRegistry: Record<string, ComponentType<OverlayProps>> = {
  FootballBroadcastOverlay: Temp2Overlay,
  FootballModernOverlay: Temp1Overlay,
  // Add new templates here...
};
```

## Dynamic Loading Flow

### Dashboard Page (`dashboard/overlays/page.tsx`)
1. Fetches template from API
2. Gets `dashboardComponent` name from `template.configJson`
3. Looks up component in `dashboardRegistry`
4. Renders dynamic component with state props

### Overlay Page (`overlay/[overlayId]/page.tsx`)
1. Fetches overlay state from API
2. Gets `overlayComponent` name from template config
3. Looks up component in `overlayRegistry`
4. Renders dynamic overlay component

## Template Component Structure

Each template must export:
```typescript
// index.ts
export const Temp2Meta = {
  id: 'football-broadcast-pro',  // Matches template.id in database
  name: 'Football Broadcast Pro',
  description: '...',
  sport: 'football',
};

export { Temp2Dashboard, Temp2Overlay };
```

## Adding a New Template

1. Create component folder:
   ```
   components/template/{sport}/{style}/
   ├── dashboard.tsx
   ├── overlay.tsx
   └── index.ts
   ```

2. Register in `lib/componentRegistry.ts`:
   ```typescript
   import { NewDashboard, NewOverlay } from '@/components/template/{sport}/{style}';
   dashboardRegistry['NewDashboard'] = NewDashboard;
   overlayRegistry['NewOverlay'] = NewOverlay;
   ```

3. Add to `backend/prisma/seeds/templateSeed.js`

4. Run `npm run seed:templates` in backend

5. Add thumbnail mapping in `app/dashboard/templates/page.tsx`

## Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Type System

See `types/index.ts` for:
- `MatchState` - Flexible `Record<string, any>` for template-specific fields
- `Template` - Template with `configJson`
- `Overlay` - Overlay instance with `renderedConfigJson`
- `DashboardProps` / `OverlayProps` - Component prop interfaces
