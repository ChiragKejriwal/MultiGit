const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

/** 
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
authRouter.post('/logout', authMiddleware.authUser, authController.logoutUser);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
authRouter.get('/profile', authMiddleware.authUser, authController.getUserProfile);

module.exports = authRouter;