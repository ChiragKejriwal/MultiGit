const express = require('express');
const objectRouter = express.Router();
const objectController = require('../controllers/object.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// CHECK OBJECTS
/**
 * @route POST /api/objects/:id/objects/check
 * @desc Check if objects with given hashes exist in the repository
 * @access Private
 */
objectRouter.post('/:id/check', authMiddleware.authUser, objectController.checkExistingObjects);

// UPLOAD OBJECT
/**
 * @route POST /api/objects/:id/upload
 * @desc Upload an object to the repository
 * @access Private
 */
objectRouter.post('/:id/upload', authMiddleware.authUser, objectController.uploadObject);

// DOWNLOAD OBJECT
/**
 * @route GET /api/objects/:id/:hash
 * @desc Get an object by its hash from the repository
 * @access Private
 */
objectRouter.get('/:id/:hash', authMiddleware.authUser, objectController.getObjectByHash);

module.exports = objectRouter;