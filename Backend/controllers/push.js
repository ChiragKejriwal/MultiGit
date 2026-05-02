const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const supabase = require("../config/supabaseClient");

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

        // 🔹 STEP 1: Get existing objects from Supabase
        const { data: existingFiles, error: listError } = await supabase.storage
            .from("Multigit")
            .list(`${repoId}/objects`);

        if (listError) {
            console.error("Error fetching existing objects:", listError.message);
            return;
        }

        const existingHashes = new Set(
            (existingFiles || []).map(file => file.name)
        );

        // 🔹 STEP 2: Traverse commit chain
        let currentCommitId = head;

        while (currentCommitId) {
            const commitFile = path.join(commitsPath, `${currentCommitId}.json`);

            if (!fs.existsSync(commitFile)) break;

            const commitData = JSON.parse(
                await fsp.readFile(commitFile, "utf-8")
            );

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

                const storagePath = `${repoId}/objects/${hash}`;

                const { error: uploadError } = await supabase.storage
                    .from("Multigit")
                    .upload(storagePath, fileContent, {
                        upsert: false,
                    });

                if (uploadError) {
                    console.error(`[ERROR] Upload failed: ${uploadError.message}`);
                } else {
                    console.log(`[UPLOAD] ${hash}`);
                    existingHashes.add(hash); // update set
                }
            }

            // 🔹 STEP 4: Check if commit already exists
            const { data: existingCommit } = await supabase
                .from("commits")
                .select("id")
                .eq("id", commitData.id)
                .maybeSingle();

            if (existingCommit) {
                console.log(`[SKIP COMMIT] ${commitData.id}`);
            } else {
                const { error: dbError } = await supabase
                    .from("commits")
                    .insert([
                        {
                            id: commitData.id,
                            repo_id: repoId,
                            message: commitData.message,
                            parent_id: commitData.parent,
                            timestamp: commitData.timestamp,
                            files: commitData.files,
                        },
                    ]);

                if (dbError) {
                    console.error("[DB ERROR]:", dbError.message);
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