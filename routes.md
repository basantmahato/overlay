# Backend API & Real-time Documentation

The backend is built with Express.js and Socket.io, providing a robust REST API under the `/api/v1` prefix and real-time state synchronization via WebSockets.

---

## 🌐 REST API Endpoints

### Base Route
- `GET /`
  - **Description**: API health check.
  - **Public**: Yes
  - **Response**: `Overlay API v1 is running...`

---

### 🔐 Authentication (`/api/v1/auth`)
*Managed in `backend/src/routes/authRoutes.js`*

- `POST /register`
  - **Description**: Creates a new user account.
  - **Body**: `{ "email": "...", "password": "..." }`
  - **Public**: Yes

- `POST /login`
  - **Description**: Authenticates user and returns JWT.
  - **Body**: `{ "email": "...", "password": "..." }`
  - **Public**: Yes

- `POST /refresh`
  - **Description**: Refreshes the access token using a refresh token (if implemented).
  - **Public**: Yes

- `POST /logout`
  - **Description**: Invalidate current session.
  - **Protected**: Yes

- `GET /me`
  - **Description**: Get current user profile.
  - **Protected**: Yes

---

### 📺 Overlays (`/api/v1/overlays`)
*Managed in `backend/src/routes/overlayRoutes.js`*

- `GET /`
  - **Description**: List all overlays owned by the user.
  - **Protected**: Yes

- `POST /`
  - **Description**: Create a new overlay instance.
  - **Body**: `{ "name": "...", "templateId": "...", "customSettingsJson": {} }`
  - **Protected**: Yes

- `GET /:id`
  - **Description**: Get specific overlay details (includes template).
  - **Protected**: Yes

- `PUT /:id`
  - **Description**: Update overlay configuration (name, colors, isActive).
  - **Body**: `{ "name": "...", "customSettingsJson": "...", "isActive": boolean }`
  - **Protected**: Yes

- `DELETE /:id`
  - **Description**: Remove an overlay.
  - **Protected**: Yes

- `GET /:id/state`
  - **Description**: Public endpoint for OBS sources to fetch initial state.
  - **Public**: Yes (No auth required)

- `PATCH /:id/state`
  - **Description**: Update the live match state (score, time, etc.). Broadcasts to connected sockets.
  - **Body**: `{ "teamA_score": 10, "match_time": "12:34", ... }`
  - **Protected**: Yes

---

### 🎨 Templates (`/api/v1/templates`)
*Managed in `backend/src/routes/templateRoutes.js`*

- `GET /`
  - **Description**: Fetch all available active templates.
  - **Protected**: Yes

- `GET /:id`
  - **Description**: Get detailed template config.
  - **Protected**: Yes

- `POST /`
  - **Description**: Create a new global template.
  - **Protected**: Yes (Admin Only)

- `PATCH /:id`
  - **Description**: Modify template default configuration.
  - **Protected**: Yes (Admin Only)

---

### 🛠️ Admin (`/api/v1/admin`)
*Managed in `backend/src/routes/adminRoutes.js`*

- `GET /users` - List all system users.
- `POST /users` - Manually create a user.
- `PATCH /users/:id` - Update user role or credentials.
- `DELETE /users/:id` - Remove a user.
- `GET /overlays` - View all overlays across the entire platform.

---

## ⚡ Real-time (WebSockets)
The server uses Socket.io for low-latency updates between the Dashboard and OBS Browser Sources.

### 📥 Incoming Events (Client to Server)

- `joinOverlay(overlayId)`
  - **Usage**: Called by OBS Browser Source.
  - **Effect**: Joins a room named `overlay:{overlayId}` and receives the current state immediately.

- `joinDashboard(overlayId)`
  - **Usage**: Called by the Admin Dashboard.
  - **Effect**: Joins a room named `dashboard:{overlayId}` for administrative tracking.

- `liveUpdate({ overlayId, patch })`
  - **Usage**: Rapid-fire updates (e.g., play clock) that don't require database persistence.
  - **Effect**: Broadcasts `stateUpdated` event to all clients in the overlay room.

### 📤 Outgoing Events (Server to Client)

- `stateUpdated(newState)`
  - **Payload**: The updated match state object.
  - **Description**: Sent whenever a `PATCH /state` REST call is made or a `liveUpdate` socket event is received.


