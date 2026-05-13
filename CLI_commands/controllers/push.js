const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const api = require("../config/apiConfig");

async function push(repoId) {
  const repoPath = path.resolve(process.cwd(), ".multigit");
  const objectsPath = path.join(repoPath, "objects");
  const commitsPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD");

  if (!fs.existsSync(repoPath)) {
    console.log("Repository not found. Please initialize first.");
    return;
  }

  try {
    const head = (await fsp.readFile(headPath, "utf-8")).trim();

    if (!head) {
      console.log("No commits to push.");
      return;
    }
    const allHashes = new Set();

    // collect all hashes from all commits
    let tempCommitId = head;

    while (tempCommitId) {
      const commitFile = path.join(commitsPath, `${tempCommitId}.json`);

      if (!fs.existsSync(commitFile)) break;

      const commitData = JSON.parse(await fsp.readFile(commitFile, "utf-8"));

      Object.values(commitData.files).forEach((hash) => allHashes.add(hash));

      tempCommitId = commitData.parent;
    }

    // check existing hashes from backend
    const objectCheckResponse = await api.post(`/objects/${repoId}/check`, {
      hashes: [...allHashes],
    });

    const existingHashes = new Set(objectCheckResponse.data.existing);

    // 🔹 STEP 2: Traverse commit chain
    let currentCommitId = head;

    while (currentCommitId) {
      const commitFile = path.join(commitsPath, `${currentCommitId}.json`);

      if (!fs.existsSync(commitFile)) break;

      const commitData = JSON.parse(await fsp.readFile(commitFile, "utf-8"));

      console.log(`\nProcessing commit: ${commitData.id}`);

      // 🔹 STEP 3: Upload objects (skip existing)
      for (const file in commitData.files) {
        const hash = commitData.files[file];

        if (existingHashes.has(hash)) {
          console.log(`[SKIP] ${hash}`);
          continue;
        }

        const objectFilePath = path.join(objectsPath, hash);
        const fileContent = await fsp.readFile(objectFilePath);

        try {
          await api.post(`/objects/${repoId}/upload`, {
            hash,
            content: fileContent.toString("base64"),
          });

          console.log(`[UPLOAD] ${hash}`);

          existingHashes.add(hash);
        } catch (err) {
          console.error(
            `[ERROR] Upload failed:`,
            err.response?.data || err.message,
          );
        }

        if (uploadError) {
          console.error(`[ERROR] Upload failed: ${uploadError.message}`);
        } else {
          console.log(`[UPLOAD] ${hash}`);
          existingHashes.add(hash); // update set
        }
      }

      // 🔹 STEP 4: Check if commit already exists
      const commitCheckResponse = await api.post(`/repo/commits/check`, {
        commitIds: [commitData.id],
      });

      const existingCommit = commitCheckResponse.data.existing.includes(
        commitData.id,
      );

      if (existingCommit) {
        console.log(`[SKIP COMMIT] ${commitData.id}`);
      } else {
        try {
          await api.post(`/repo/commits/${repoId}/create`, {
            id: commitData.id,
            message: commitData.message,
            parent_id: commitData.parent,
            timestamp: commitData.timestamp,
            files: commitData.files,
          });

          console.log(`[COMMIT SAVED] ${commitData.id}`);
        } catch (err) {
          console.error("[COMMIT ERROR]:", err.response?.data || err.message);

          return;
        }

        console.log(`[COMMIT SAVED] ${commitData.id}`);
      }

      // 🔹 move to parent
      currentCommitId = commitData.parent;
    }

    console.log("\n✅ Push completed successfully!");
  } catch (error) {
    console.error("Push failed:", error);
  }
}

module.exports = { push };
