const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

// @desc    Get all users with counts
// @route   GET /api/v1/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { overlays: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
};

// @desc    Create a user
// @route   POST /api/v1/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role }
  });
  res.status(201).json(user);
};

// @desc    Update user (email, role, password)
// @route   PATCH /api/v1/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { email, role, password } = req.body;
  const data = { email, role };
  
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data
  });
  res.json(user);
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
};

// @desc    Get all overlays
// @route   GET /api/v1/admin/overlays
// @access  Private/Admin
const getAllOverlays = async (req, res) => {
  const overlays = await prisma.overlay.findMany({
    include: {
      user: { select: { email: true } },
      template: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(overlays);
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllOverlays
};
