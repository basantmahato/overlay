# Database Schema

## Prisma Models

### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  overlays  Overlay[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Template
Stores template configurations with scalable template-driven state.

```prisma
model Template {
  id          String   @id
  name        String
  description String?
  isActive    Boolean  @default(true)
  configJson  Json     // Template configuration
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  overlays    Overlay[]
}
```

**configJson structure:**
```json
{
  "sport": "football",
  "category": "broadcast",
  "defaultState": {
    "teamA_name": "HOME",
    "teamA_score": 0,
    "teamB_name": "AWAY",
    "teamB_score": 0,
    "match_time": "0'",
    "match_phase": "1st Half",
    "events": []
  },
  "dashboardComponent": "FootballBroadcastDashboard",
  "overlayComponent": "FootballBroadcastOverlay"
}
```

### Overlay
User overlay instances with live state.

```prisma
model Overlay {
  id                 String   @id @default(uuid())
  name               String
  customSettingsJson Json?    // User customizations
  renderedConfigJson Json?    // Live match state
  isActive           Boolean  @default(true)
  userId             String
  templateId         String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  user     User     @relation(fields: [userId], references: [id])
  template Template  @relation(fields: [templateId], references: [id])
}
```

**renderedConfigJson (live state):**
```json
{
  "teamA_name": "Manchester United",
  "teamA_score": 2,
  "teamB_name": "Liverpool",
  "teamB_score": 1,
  "match_time": "67'",
  "match_phase": "2nd Half",
  "events": [
    { "type": "Goal", "team": "h", "player": "Rashford", "min": "23", "timestamp": 1234567890 }
  ]
}
```

## Enums

```prisma
enum Role {
  USER
  ADMIN
}
```

## Relationships

```
User (1) ───< (N) Overlay (N) >─── (1) Template
```

- One user can have many overlays
- One template can be used by many overlays
- Each overlay belongs to one user and one template

## Key Design Decisions

### Template-Driven State
- No hardcoded default states in code
- Each template defines its own `defaultState` in `configJson`
- `renderedConfigJson` stores the live mutable state per overlay

### Flexible Schema
- Uses `Json` type for `configJson` and `renderedConfigJson`
- Allows different fields per sport/template without schema migrations
- Supports 50+ templates with varying structures

## Migrations

```bash
# Create migration
npx prisma migrate dev --name add_feature

# Generate client
npx prisma generate

# View database
npx prisma studio
```
