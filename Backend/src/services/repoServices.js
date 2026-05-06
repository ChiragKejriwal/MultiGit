const supabase = require("../config/db");


// CREATE REPO
exports.createRepo = async (repoData) => {
  return await supabase
    .from("repos")
    .insert([repoData])
    .select()
    .single();
};


// GET ALL REPOS
exports.getAllRepos = async () => {
  return await supabase
    .from("repos")
    .select("*")
    .order("created_at", { ascending: false });
};


// GET REPO BY ID
exports.getRepoById = async (repoId) => {
  return await supabase
    .from("repos")
    .select("*")
    .eq("id", repoId)
    .single();
};


// GET REPO BY NAME
exports.getRepoByName = async (repoName) => {
  return await supabase
    .from("repos")
    .select("*")
    .eq("name", repoName)
    .single();
};


// GET USER REPOS
exports.getReposForUser = async (userId) => {
  return await supabase
    .from("repos")
    .select("*")
    .eq("owner", userId)
    .order("created_at", { ascending: false });
};


// UPDATE REPO
exports.updateRepo = async (repoId, updatedData) => {
  return await supabase
    .from("repos")
    .update(updatedData)
    .eq("id", repoId)
    .select()
    .single();
};


// DELETE REPO
exports.deleteRepo = async (repoId) => {
  return await supabase
    .from("repos")
    .delete()
    .eq("id", repoId);
};

exports.toggleRepoVisibility = async (repoId, visibility) => {
  return await supabase
    .from("repos")
    .update({ visibility })
    .eq("id", repoId)
    .select()
    .single();
};