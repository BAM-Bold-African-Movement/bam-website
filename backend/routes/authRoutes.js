const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { validateAuth } = require('../middleware/validate');
const auth = require('../middleware/auth');
const logger = require('../config/logger');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateAuth, register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateAuth, login);

// @route   GET api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', auth, getCurrentUser);

module.exports = router; 