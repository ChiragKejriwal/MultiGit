const issueService = require('../services/issueService');

// CREATE ISSUE
async function createIssue(req, res) {
  try {
    const { title, description, repositoryId } = req.body;
    const {userId} = req.user; // Assuming user ID is available in the request object after authentication
    const status = "open"; // Default status for a new issue

    if(!title || !description || !repositoryId) {
      return res.status(400).json({ message: "Title, description, and repository ID are required" });
    }
    
   const {data,error} = await issueService.createIssue({ title, description, repositoryId, status, userId });

   if(error){
    return res.status(400).json({ message: "Failed to create issue", error });
   }
   res.status(201).json({ message: "Issue created successfully", data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// GET ALL ISSUES for a repository
async function getAllIssues(req, res) {
  try {
    const { id } = req.params; // Repository ID
    const {data,error} = await issueService.getAllIssues(id);

    if(error){
      return res.status(400).json({ message: "Failed to fetch issues", error });
    }
    res.status(200).json({ message: "Issues fetched successfully", data });
    } catch (error) {   
    res.status(400).json({ error: error.message });
  }
}

// GET ISSUE BY ID
async function getIssueById(req, res) {
  try {
    const { id } = req.params; // Issue ID

    if (!id) {
      return res.status(400).json({ message: "Issue ID is required" });
    }
    const {data,error} = await issueService.getIssueById(id);

    if(error){
      return res.status(400).json({ message: "Failed to fetch issue", error });
    }
    res.status(200).json({ message: "Issue fetched successfully", data });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// UPDATE ISSUE
async function updateIssue(req, res) {
  try {
    const { id } = req.params; // Issue ID'
    if (!id) {
      return res.status(400).json({ message: "Issue ID is required" });
    }
    const { title, description, status } = req.body;
    const {data,error} = await issueService.updateIssue(id, { title, description, status });

    if(error){
      return res.status(400).json({ message: "Failed to update issue", error });
    }
    res.status(200).json({ message: "Issue updated successfully", data });
    } catch (error) {   
        res.status(400).json({ error: error.message });
    }   
}

// DELETE ISSUE
async function deleteIssue(req, res) {
  try {
    const { id } = req.params; // Issue ID
    if (!id) {
      return res.status(400).json({ message: "Issue ID is required" });
    }
    const {error} = await issueService.deleteIssue(id);

    if(error){
      return res.status(400).json({ message: "Failed to delete issue", error });
    }
    res.status(200).json({ message: "Issue deleted successfully" });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// TOGGLE ISSUE STATUS
async function toggleIssueStatus(req, res) {
  try {
    const { id } = req.params; // Issue ID
    if (!id) {
      return res.status(400).json({ message: "Issue ID is required" });
    }

    const {status} = req.body; // New status for the issue (e.g., "open" or "closed")
    if (!status) {
      return res.status(400).json({ message: "Status is required to toggle issue status" });
    }
    const {data,error} = await issueService.toggleIssueStatus(id, status);
    if(error){
      return res.status(400).json({ message: "Failed to toggle issue status", error });
    }
    res.status(200).json({ message: "Issue status toggled successfully", data });
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  toggleIssueStatus
};


