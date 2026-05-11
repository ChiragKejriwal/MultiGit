const express = require('express');
const router = express.Router();
const commitController = require('../controllers/commit.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/** * @route POST /api/repo/commits/:id/create
 * @desc Create a new commit
 * @access Private
 */
router.post('/:id/create', authMiddleware.authUser, commitController.createCommit);

/**
 * @route GET /api/repo/commits/:id/all
 * @desc Get all commits for a repository
 * @access Private
 */
router.get('/:id/all', authMiddleware.authUser, commitController.getRepoCommits);

/**
 * @route GET /api/repo/commits/:id/:commitId
 * @desc Get a specific commit by ID
 * @access Private
 */
router.get('/:id/:commitId', authMiddleware.authUser, commitController.getCommitById);


/**
 * @route GET /api/repo/commits/:id/tree
 * @desc Get the commit tree for a repository
 * @access Private
 */
router.get('/:id/tree', authMiddleware.authUser, commitController.getCommitTree);

/**
 * @route POST /api/repo/commits/check
 * @desc Check existing commits by IDs
 * @access Private
 */
router.post('/check', authMiddleware.authUser, commitController.checkExistingCommits);