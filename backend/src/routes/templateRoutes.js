const express = require('express');
const router = express.Router();
const { 
  getTemplates, 
  getTemplateById
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTemplates);
router.get('/:id', getTemplateById);

module.exports = router;
