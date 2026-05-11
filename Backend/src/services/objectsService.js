const supabase = require("../config/db");


// CHECK EXISTING OBJECTS
exports.checkExistingObjects = async (repoId,hashes) => {

  const { data, error } = await supabase.storage
      .from("Multigit")
      .list(`${repoId}/objects`);

  if (error) {
    return { message: "Error occurred while checking existing objects", data: null, error };
  }

  const existingHashes = new Set( data.map(file => file.name));

  const existing = hashes.filter(hash =>  existingHashes.has(hash));

  const missing = hashes.filter(hash => !existingHashes.has(hash));

  return {
    data: {
      existing,
      missing
    },
    error: null
  };
};


// UPLOAD OBJECT
exports.uploadObject = async (repoId,hash,content) => {

  return await supabase
    .storage
    .from("Multigit")
    .upload(
      `${repoId}/objects/${hash}`,
      content,
      {
        upsert: false
      }
    );
};


// DOWNLOAD OBJECT
exports.getObjectByHash = async (repoId,hash) => {

  return await supabase
    .storage
    .from("Multigit")
    .download(
      `${repoId}/objects/${hash}`
    );
};