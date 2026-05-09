
const repoService = require("../services/repoServices");

// CREATE REPO
async function createRepo(req, res) {
  try {

    if(!req.body.name || !req.body.description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const repoData = {
      ...req.body,
      owner: req.user.sub,
    };

    const { data, error } = await repoService.createRepo(repoData);

    if (error) {
      return res
        .status(400)
        .json({ message: "Failed to create repository", error });
    }

    res.status(201).json({ message: "Repository created successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET ALL REPOS
async function getAllRepos(req, res) {
  try {
    const { data, error } = await repoService.getAllRepos();

    if (error)
      return res
        .status(400)
        .json({ message: "Failed to fetch repositories", error });

    res.json({ message: "Repositories fetched successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET REPO BY ID
async function getRepoById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    const { data, error } = await repoService.getRepoById(id);

    if (error)
      return res.status(404).json({ message: "Repository not found", error });

    res.json({ message: "Repository fetched successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET REPO BY NAME
async function getRepoByName(req, res) {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    const { data, error } = await repoService.getRepoByName(name);

    if (error)
      return res.status(404).json({ message: "Repository not found", error });

    res.json({ message: "Repository fetched successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET REPOS FOR USER
async function getReposForUser(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }


    const { data, error } = await repoService.getReposForUser(userId);

    if(!data || data.length === 0) {
      return res.status(404).json({ message: "No repositories found for this user" });
    }
    
    if (error)
      return res
        .status(400)
        .json({ message: "Failed to fetch repositories", error });

    res.json({ message: "Repositories fetched successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// UPDATE REPO
async function updateRepo(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({ message: "At least one field (title or description) is required to update" });
    }
    const { data, error } = await repoService.updateRepo(id, { title, description });

    if (error)
      return res
        .status(400)
        .json({ message: "Failed to update repository", error });

    res.json({ message: "Repository updated successfully", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// DELETE REPO
async function deleteRepo(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    const { error } = await repoService.deleteRepo(id);

    if (error)
      return res
        .status(400)
        .json({ message: "Failed to delete repository", error });

    res.json({
      message: "Repository deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function toggleRepoVisibility(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Repository ID is required"
      });
    }

    // GET REPO
    const { data: repo, error } =
      await repoService.getRepoById(id);

    if (error || !repo) {
      return res.status(404).json({
        message: "Repository not found"
      });
    }

    // OWNER CHECK
    if (repo.owner !== req.user.sub) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    // TOGGLE VISIBILITY
    const newVisibility =
      repo.visibility === "public"
        ? "private"
        : "public";

    // UPDATE
    const {
      data: updatedRepo,
      error: updateError
    } = await repoService.toggleRepoVisibility(
      id,
      newVisibility
    );

    if (updateError) {
      return res.status(400).json({
        message: "Failed to update visibility",
        error: updateError
      });
    }

    res.json({
      message: `Repository is now ${newVisibility}`,
      data: updatedRepo
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

module.exports = {
  createRepo,
  getAllRepos,
  getRepoById,
  getRepoByName,
  getReposForUser,
  updateRepo,
  deleteRepo,
  toggleRepoVisibility,
};
