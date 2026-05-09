const express = require("express");
const repoRouter = express.Router();
const repoController = require("../controllers/repo.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @route POST /api/repos/create
 * @desc Create a new repository
 * @access Private
 */
repoRouter.post("/create", authMiddleware.authUser, repoController.createRepo);

/**
 * @route GET /api/repos
 * @desc Get all repositories
 * @access Public
 */
repoRouter.get("/", repoController.getAllRepos);

/**
 * @route GET /api/repos/:id
 * @desc Get repository by ID
 * @access Public
 */
repoRouter.get("/:id", repoController.getRepoById);

/**
 * @route GET /api/repos/name/:name
 * @desc Get repository by name
 * @access Public
 */
repoRouter.get("/name/:name", repoController.getRepoByName);

/**
 * @route GET /api/repos/user/:userId
 * @desc Get repositories for a specific user
 * @access Private
 */
repoRouter.get("/user/:userId", authMiddleware.authUser, repoController.getReposForUser);

/**
 * @route PUT /api/repos/:id
 * @desc Update repository information
 * @access Private
 */
repoRouter.put("/:id", authMiddleware.authUser, repoController.updateRepo);

/**
 * @route DELETE /api/repos/:id
 * @desc Delete a repository
 * @access Private
 */
repoRouter.delete("/:id", authMiddleware.authUser, repoController.deleteRepo);

/**
 * @route PATCH /api/repos/toggle-visibility/:id
 * @desc Toggle repository visibility (public/private)
 * @access Private
 */
repoRouter.patch("/toggle-visibility/:id", authMiddleware.authUser, repoController.toggleRepoVisibility);

module.exports = repoRouter;