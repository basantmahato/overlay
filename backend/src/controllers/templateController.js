const prisma = require('../config/prisma');

// @desc    Get all active templates
// @route   GET /api/v1/templates
// @access  Private
const getTemplates = async (req, res) => {
  const templates = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(templates);
};

// @desc    Get single template
// @route   GET /api/v1/templates/:id
// @access  Private
const getTemplateById = async (req, res) => {
  const template = await prisma.template.findUnique({
    where: { id: req.params.id },
  });

  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  res.json(template);
};

module.exports = { 
  getTemplates, 
  getTemplateById
};
