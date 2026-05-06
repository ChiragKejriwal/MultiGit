const supabase = require('../config/db');

// CREATE ISSUE
exports.createIssue = async (issueData) => {
  return await supabase
    .from("issues")
    .insert([issueData])
    .select()
    .single();
};

// GET ALL ISSUES FOR a repo
exports.getRepoIssues = async (repoId) => {
  return await supabase
    .from("issues")
    .select("*")
    .eq("repo_id", repoId)
    .order("created_at", {
      ascending: false
    });
};

// GET ISSUE BY ID
exports.getIssueById = async (issueId) => {
  return await supabase 
    .from("issues")
    .select("*")
    .eq("id", issueId)
    .single();
}

// UPDATE ISSUE
exports.updateIssue = async (issueId, updatedData) => {
  return await supabase
    .from("issues")
    .update(updatedData)
    .eq("id", issueId)
    .select()
    .single();
}

// DELETE ISSUE
exports.deleteIssue = async (issueId) => {
  return await supabase
    .from("issues")
    .delete()
    .eq("id", issueId);
};

// TOGGLE ISSUE STATUS  
exports.toggleIssueStatus = async (issueId,status) => {
    return await supabase
        .from("issues")
        .update({ status: status })
        .eq("id", issueId)
        .select()
        .single();
}