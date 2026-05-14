const commitService = require('../services/commitService');

// CREATE COMMIT
async function createCommit(req, res) {
  try {
    const { id } = req.params;

    const {
      message,
      parent_id,
      files
    } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Commit message is required" });
    }
    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    const commitData = {
      repo_id: id,
      author: req.user.id,
      message,
      parent_id,
      files
    };

    const { data, error } = await commitService.createCommit(commitData );

    if (error) {
      return res.status(400).json({ message: "Failed to create commit", error });
    }
    
    res.status(201).json({ message: "Commit created successfully", data });

    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// GET ALL COMMITS for a repository
async function getRepoCommits(req, res) {
  try {
    const { id } = req.params; // Repository ID
    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }
    const { data, error } = await commitService.getRepoCommits(id);

    if (error) {
      return res.status(400).json({ message: "Failed to fetch commits", error });
    }

    res.status(200).json({ message: "Commits fetched successfully", data });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// GET COMMIT BY ID
async function getCommitById(req, res) {
  try {
    const { id, commitId } = req.params; // Repository ID and Commit ID

    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    if (!commitId) {
      return res.status(400).json({ message: "Commit ID is required" });
    }

    const { data, error } = await commitService.getCommitById(id, commitId);

    if (error) {
      return res.status(400).json({ message: "Failed to fetch commit", error });
    }

    res.status(200).json({ message: "Commit fetched successfully", data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// GET COMMIT TREE for a repository
async function getCommitTree(req, res) {
  try {
    const { id } = req.params; // Repository ID

    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }
    const { data, error } = await commitService.getCommitTree(id);

    if (error) {
      return res.status(400).json({ message: "Failed to fetch commit tree", error });
    }
    res.status(200).json({ message: "Commit tree fetched successfully", data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

  async function checkExistingCommits(req,res) {

  try {

    const { commitIds } = req.body;

    const { id } = req.params; // Repository ID

    if (!id) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    if (!commitIds ||!Array.isArray(commitIds)) {
      return res.status(400).json({
        message:
          "commitIds array is required"
      });
    }

    const { data, error } = await commitService.checkExistingCommits(id, commitIds);

    if (error) {
      return res.status(400).json({
        message:
          "Failed to check commits",
        error
      });
    }

    const existing = data.map(commit => commit.id);

    const missing =commitIds.filter(id => !existing.includes(id));

    res.status(200).json({
      existing,
      missing
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
}

module.exports = {
  createCommit,
  getRepoCommits,
  getCommitById,
  getCommitTree,
  checkExistingCommits
};