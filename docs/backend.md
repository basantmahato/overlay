# Backend Architecture

## Overview
The backend is built with **Express.js** and **Socket.io**, providing REST APIs and real-time state synchronization for the sports broadcast overlay platform.

## Key Features

### 🎯 Template-Driven Default State
- **No hardcoded states** - Each template defines its own `defaultState` in `configJson`
- Scalable for 50+ templates with different fields per sport
- Template configuration stored in database, fetched dynamically

### 🔌 Real-time Updates
- **Socket.io** for low-latency communication between Dashboard and OBS Browser Sources
- Dual update mechanism:
  - `liveUpdate` - Fast, non-persistent updates (play clock ticks)
  - `PATCH /state` - Persistent updates with database storage

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── overlayController.js      # Main overlay logic (template-driven defaults)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── overlayRoutes.js
│   │   └── templateRoutes.js
│   ├── sockets/
│   │   └── socketHandler.js          # WebSocket event handlers
│   └── server.js                     # Express + Socket.io setup
└── prisma/
    └── seeds/
        └── templateSeed.js           # Template configurations with defaultState
```

## Template Configuration

Each template in `templateSeed.js` defines:
```javascript
{
  id: 'football-broadcast-pro',
  name: 'Football Broadcast Pro',
  configJson: {
    sport: 'football',
    defaultState: {        // Template-specific default state
      teamA_name: 'HOME',
      teamA_score: 0,
      // ... other fields
    },
    dashboardComponent: 'FootballBroadcastDashboard',  // Frontend component name
    overlayComponent: 'FootballBroadcastOverlay',    // Frontend component name
  }
}
```

## Database Schema

See `schema.md` for full Prisma schema details.

Key tables:
- **Template** - Stores template configurations
- **Overlay** - User overlay instances with `renderedConfigJson` (live state)
- **User** - Authentication

## API Reference

See `routes.md` for complete REST API and WebSocket documentation.

## Commands

```bash
# Start development server
npm run dev

# Database operations
npm run db:migrate    # Run Prisma migrations
npm run db:generate   # Generate Prisma client
npm run db:studio     # Open Prisma Studio

# Seeding
npm run seed:templates              # Seed templates
npm run remove-all-templates        # Remove all templates
```

## Environment Variables

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
```
