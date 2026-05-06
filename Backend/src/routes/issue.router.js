const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issue.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route POST /api/issues
 * @desc Create a new issue
 * @access Private
 */
router.post('/', authMiddleware.authUser, issueController.createIssue);

/**
 * @route GET /api/issues
 * @desc Get all issues for the authenticated user
 * @access Private
 */
router.get('/', authMiddleware.authUser, issueController.getIssues);

/**
 * @route GET /api/issues/:id
 * @desc Get a specific issue by ID
 * @access Private
 */
router.get('/:id', authMiddleware.authUser, issueController.getIssueById);

/**
 * @route PUT /api/issues/:id
 * @desc Update an issue by ID
 * @access Private
 */
router.put('/:id', authMiddleware.authUser, issueController.updateIssue);

/**
 * @route DELETE /api/issues/:id
 * @desc Delete an issue by ID
 * @access Private
 */
router.delete('/:id', authMiddleware.authUser, issueController.deleteIssue);

/**
 * toggle the status of an issue by ID
 * @route POST /api/issues/:id/toggle-status
 * @desc Toggle the status of an issue by ID
 * @access Private
 */
router.post('/:id/toggle-status', authMiddleware.authUser, issueController.toggleIssueStatus);


module.exports = router;