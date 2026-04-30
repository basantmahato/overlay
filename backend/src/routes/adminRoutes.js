const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  createUser,
  updateUser, 
  deleteUser, 
  getAllOverlays 
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/overlays', getAllOverlays);

module.exports = router;
