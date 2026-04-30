const express = require('express');
const router = express.Router();
const {
  getOverlays,
  getOverlayById,
  getOverlayState,
  createOverlay,
  updateOverlay,
  updateOverlayState,
  deleteOverlay,
} = require('../controllers/overlayController');
const { protect } = require('../middleware/authMiddleware');

// Public — used by the OBS browser source template HTML
router.get('/:id/state', getOverlayState);

// Private — dashboard
router.use(protect);
router.get('/', getOverlays);
router.get('/:id', getOverlayById);
router.post('/', createOverlay);
router.put('/:id', updateOverlay);
router.patch('/:id/state', updateOverlayState);
router.delete('/:id', deleteOverlay);

module.exports = router;
