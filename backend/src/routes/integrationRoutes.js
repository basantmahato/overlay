const express = require('express');
const router = express.Router();
const {
  getLiveMatches,
  getLiveMatchByOverlayId,
} = require('../controllers/integrationController');
const { integrationAuth } = require('../middleware/integrationAuthMiddleware');

router.use(integrationAuth);

router.get('/live-matches', getLiveMatches);
router.get('/live-matches/:overlayId', getLiveMatchByOverlayId);

module.exports = router;
