const prisma = require('../config/prisma');

const toLiveMatchResponse = (overlay) => {
  const state = overlay.renderedConfigJson || {};
  const templateConfig = overlay.template?.configJson || {};

  return {
    id: overlay.id,
    overlayName: overlay.name,
    status: overlay.isActive ? 'LIVE' : 'INACTIVE',
    sport: templateConfig.sport || 'football',
    competition: state.competition || null,
    venue: state.venue || null,
    homeTeam: state.teamA_name || state.homeTeam || 'HOME',
    awayTeam: state.teamB_name || state.awayTeam || 'AWAY',
    homeAbbr: state.teamA_abbr || null,
    awayAbbr: state.teamB_abbr || null,
    homeScore: state.teamA_score ?? state.homeScore ?? 0,
    awayScore: state.teamB_score ?? state.awayScore ?? 0,
    minute: state.match_time || state.minute || null,
    phase: state.match_phase || state.phase || null,
    events: state.events || [],
    lastEvent: state.event || null,
    updatedAt: overlay.updatedAt,
  };
};

// @desc    Get active live matches for the news platform
// @route   GET /api/v1/integrations/live-matches
// @access  Private/Integration
const getLiveMatches = async (req, res) => {
  const overlays = await prisma.overlay.findMany({
    where: { isActive: true },
    include: { template: true },
    orderBy: { updatedAt: 'desc' },
  });

  res.json(overlays.map(toLiveMatchResponse));
};

// @desc    Get one live match for the news platform
// @route   GET /api/v1/integrations/live-matches/:overlayId
// @access  Private/Integration
const getLiveMatchByOverlayId = async (req, res) => {
  const overlay = await prisma.overlay.findFirst({
    where: {
      id: req.params.overlayId,
      isActive: true,
    },
    include: { template: true },
  });

  if (!overlay) {
    return res.status(404).json({ message: 'Live match not found' });
  }

  res.json(toLiveMatchResponse(overlay));
};

module.exports = {
  getLiveMatches,
  getLiveMatchByOverlayId,
};
