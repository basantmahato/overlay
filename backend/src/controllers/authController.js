const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const accessToken = generateAccessToken('temp_id'); // Placeholder until user created
  const refreshToken = generateRefreshToken('temp_id');

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      refreshToken: refreshToken,
    },
  });

  if (user) {
    // Regenerate tokens with actual ID
    const actualAccessToken = generateAccessToken(user.id);
    const actualRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: actualRefreshToken },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      accessToken: actualAccessToken,
      refreshToken: actualRefreshToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.json({
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_123');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Rotate refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { refreshToken: null },
  });

  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  getMe,
  logoutUser,
};
