const prisma = require('../config/prisma');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // ─── OBS Browser Source joins its overlay room ─────────────────────────
    // The template HTML calls: socket.emit('joinOverlay', overlayId)
    socket.on('joinOverlay', async (overlayId) => {
      socket.join(`overlay:${overlayId}`);
      console.log(`Socket ${socket.id} joined overlay room: overlay:${overlayId}`);

      // Send the current state immediately so OBS loads data right away
      try {
        const overlay = await prisma.overlay.findUnique({
          where: { id: overlayId },
        });
        if (overlay && overlay.renderedConfigJson) {
          socket.emit('stateUpdated', overlay.renderedConfigJson);
        }
      } catch (err) {
        console.error('Error fetching initial overlay state:', err.message);
      }
    });

    // ─── Dashboard joins its own admin room (to receive back-confirms) ──────
    socket.on('joinDashboard', (overlayId) => {
      socket.join(`dashboard:${overlayId}`);
      console.log(`Dashboard ${socket.id} managing overlay: ${overlayId}`);
    });

    // ─── Live state update from dashboard (no DB write — use REST for that) ─
    // The REST PATCH /api/v1/overlays/:id/state writes to DB AND emits.
    // This socket event is for ultra-fast, no-DB-write updates (e.g. play clock tick).
    socket.on('liveUpdate', ({ overlayId, patch }) => {
      if (!overlayId || !patch) return;
      // Broadcast to OBS browser source only (not back to dashboard)
      socket.to(`overlay:${overlayId}`).emit('stateUpdated', patch);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
