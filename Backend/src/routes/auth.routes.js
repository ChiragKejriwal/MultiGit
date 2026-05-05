const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

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
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
authRouter.post('/logout',authMiddleware.authUser, authController.logoutUser);

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
authRouter.get('/profile', authMiddleware.authUser, authController.getUserProfile);

/**
 * @route DELETE /api/auth/:id
 * @desc Delete user account
 * @access Private
 */
authRouter.delete('/:id', authMiddleware.authUser, authController.deleteUserAccount);
 

/**
 * @route PUT /api/auth/getAllUsers
 * @desc Get all users (admin only)
 * @access Private
 */
authRouter.get('/getAllUsers',authMiddleware.authUser, authController.getAllUsers);

/**
 * @route PUT /api/auth/updateUser/:id
 * @desc Update user information
 * @access Private
 */

authRouter.put('/updateUser/:id', authMiddleware.authUser, authController.updateUserInfo);

module.exports = authRouter;