const prisma = require('../config/prisma');

// Default live match state shape
const defaultMatchState = {
  teamA_name: 'HOME',
  teamA_score: 0,
  teamB_name: 'AWAY',
  teamB_score: 0,
  match_time: '15:00',
  match_phase: '1st',
  play_clock: 40,
  down_distance: '1st & 10',
  possession: 'A', // 'A' = home has ball, 'B' = away has ball
  isRunning: false,
  event: null,    // { text: 'TOUCHDOWN!', timestamp: ... }
};

// @desc    Get all overlays for the logged-in user
// @route   GET /api/v1/overlays
// @access  Private
const getOverlays = async (req, res) => {
  const overlays = await prisma.overlay.findMany({
    where: { userId: req.user.id },
    include: { template: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(overlays);
};

// @desc    Get a single overlay by ID
// @route   GET /api/v1/overlays/:id
// @access  Private
const getOverlayById = async (req, res) => {
  const overlay = await prisma.overlay.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { template: true },
  });

  if (!overlay) {
    res.status(404);
    throw new Error('Overlay not found');
  }

  res.json(overlay);
};

// @desc    Get overlay state publicly (for the template HTML, no auth needed)
// @route   GET /api/v1/overlays/:id/state
// @access  Public
const getOverlayState = async (req, res) => {
  const overlay = await prisma.overlay.findUnique({
    where: { id: req.params.id },
    include: { template: true }
  });

  if (!overlay) {
    return res.status(404).json({ message: 'Overlay not found' });
  }

  // Return current rendered config (live match state) AND template info
  const state = overlay.renderedConfigJson || defaultMatchState;
  res.json({
    state,
    template: {
      id: overlay.template.id,
      name: overlay.template.name
    }
  });
};

// @desc    Create a new overlay for the logged-in user
// @route   POST /api/v1/overlays
// @access  Private
const createOverlay = async (req, res) => {
  const { name, templateId, customSettingsJson } = req.body;

  if (!name || !templateId) {
    res.status(400);
    throw new Error('Name and templateId are required');
  }

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const overlay = await prisma.overlay.create({
    data: {
      name,
      userId: req.user.id,
      templateId,
      customSettingsJson: customSettingsJson || {},
      renderedConfigJson: defaultMatchState,
    },
    include: { template: true },
  });

  res.status(201).json(overlay);
};

// @desc    Update overlay custom settings (name, colours, etc.)
// @route   PUT /api/v1/overlays/:id
// @access  Private
const updateOverlay = async (req, res) => {
  const { name, customSettingsJson, isActive } = req.body;

  const overlay = await prisma.overlay.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!overlay) {
    res.status(404);
    throw new Error('Overlay not found');
  }

  const updated = await prisma.overlay.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(customSettingsJson !== undefined && { customSettingsJson }),
      ...(isActive !== undefined && { isActive }),
    },
    include: { template: true },
  });

  res.json(updated);
};

// @desc    Update live match state and broadcast via Socket.io
// @route   PATCH /api/v1/overlays/:id/state
// @access  Private
const updateOverlayState = async (req, res) => {
  const overlay = await prisma.overlay.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!overlay) {
    res.status(404);
    throw new Error('Overlay not found');
  }

  // Merge incoming partial state over existing state
  const currentState = overlay.renderedConfigJson || defaultMatchState;
  const newState = { ...currentState, ...req.body };

  const updated = await prisma.overlay.update({
    where: { id: req.params.id },
    data: { renderedConfigJson: newState },
  });

  // Broadcast to all OBS browser sources connected to this overlay room
  const io = req.app.get('socketio');
  io.to(`overlay:${req.params.id}`).emit('stateUpdated', newState);

  res.json({ state: newState });
};

// @desc    Delete an overlay
// @route   DELETE /api/v1/overlays/:id
// @access  Private
const deleteOverlay = async (req, res) => {
  const overlay = await prisma.overlay.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!overlay) {
    res.status(404);
    throw new Error('Overlay not found');
  }

  await prisma.overlay.delete({ where: { id: req.params.id } });
  res.json({ message: 'Overlay deleted' });
};

module.exports = {
  getOverlays,
  getOverlayById,
  getOverlayState,
  createOverlay,
  updateOverlay,
  updateOverlayState,
  deleteOverlay,
};
