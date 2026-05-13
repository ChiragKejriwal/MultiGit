const supabase = require("../config/db");


// GET ALL COMMITS OF REPO
exports.getRepoCommits = async (repoId) => {
  return await supabase
    .from("commits")
    .select("*")
    .eq("repo_id", repoId)
    .order("timestamp", {
      ascending: false
    });
};


// GET COMMIT BY ID
exports.getCommitById = async (
  repoId,
  commitId
) => {
  return await supabase
    .from("commits")
    .select("*")
    .eq("repo_id", repoId)
    .eq("id", commitId)
    .single();
};


// CREATE COMMIT
exports.createCommit = async (
  commitData
) => {
  return await supabase
    .from("commits")
    .insert([commitData])
    .select()
    .single();
};


// GET COMMIT TREE
exports.getCommitTree = async (
  repoId
) => {
  return await supabase
    .from("commits")
    .select("id, parent_id")
    .eq("repo_id", repoId);
};


// CHECK EXISTING COMMITS
exports.checkExistingCommits = async (
  repoId,
  commitIds
) => {

  return await supabase
    .from("commits")
    .select("id")
    .eq("repo_id", repoId)
    .in("id", commitIds);

};