const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const supabase = require("../config/supabaseClient");
const crypto = require("crypto");

// 🔹 Generate hash of local file
async function generateHash(filePath) {
    if (!fs.existsSync(filePath)) return null;

    const fileBuffer = await fsp.readFile(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

async function pull(repoId) {
    const repoPath = path.resolve(process.cwd(), ".multigit");
    const objectsPath = path.join(repoPath, "objects");
    const commitsPath = path.join(repoPath, "commits");
    const headPath = path.join(repoPath, "HEAD");

    if (!fs.existsSync(repoPath)) {
        console.log("Repository not found. Please initialize first.");
        return;
    }

    try {
        // ✅ Ensure folders exist
        await fsp.mkdir(objectsPath, { recursive: true });
        await fsp.mkdir(commitsPath, { recursive: true });

        // 🔹 STEP 1: Fetch all commits
        const { data: commits, error } = await supabase
            .from("commits")
            .select("*")
            .eq("repo_id", repoId)
            .order("timestamp", { ascending: true });

        if (error || !commits.length) {
            console.error("Error fetching commits:", error?.message);
            return;
        }

        // 🔹 STEP 2: Get local commits
        const localCommits = new Set(
            fs.existsSync(commitsPath)
                ? (await fsp.readdir(commitsPath)).map(f => path.parse(f).name)
                : []
        );

        // 🔹 STEP 3: Process commits
        for (const commit of commits) {

            // ✅ FIX: Do NOT skip entire commit
            if (!localCommits.has(commit.id)) {
                console.log(`[FETCH COMMIT] ${commit.id}`);

                await fsp.writeFile(
                    path.join(commitsPath, `${commit.id}.json`),
                    JSON.stringify(commit, null, 2)
                );
            } else {
                console.log(`[COMMIT EXISTS] ${commit.id}`);
            }

            // 🔹 STEP 4: Download objects (ALWAYS CHECK)
            for (const file in commit.files) {
                const hash = commit.files[file];
                const localObjectPath = path.join(objectsPath, hash);

                if (fs.existsSync(localObjectPath)) {
                    console.log(`[SKIP OBJECT] ${hash}`);
                    continue;
                }

                const { data: objectData, error: objectError } =
                    await supabase.storage
                        .from("Multigit")
                        .download(`${repoId}/objects/${hash}`);

                if (objectError) {
                    console.error(`[ERROR] Download ${hash}:`, objectError.message);
                    continue;
                }

                const buffer = Buffer.from(await objectData.arrayBuffer());
                await fsp.writeFile(localObjectPath, buffer);

                console.log(`[DOWNLOADED] ${hash}`);
            }
        }

        // 🔹 STEP 5: Checkout latest commit
        const latestCommit = commits[commits.length - 1];

        console.log(`\n[CHECKOUT] ${latestCommit.id}`);

        for (const file in latestCommit.files) {
            const hash = latestCommit.files[file];
            const objectPath = path.join(objectsPath, hash);
            const workingFilePath = path.resolve(process.cwd(), file);

            // ✅ Safety check
            if (!fs.existsSync(objectPath)) {
                console.warn(`[MISSING OBJECT] ${hash}, skipping`);
                continue;
            }

            const remoteContent = await fsp.readFile(objectPath);

            const localHash = await generateHash(workingFilePath);

            if (localHash && localHash !== hash) {
                console.warn(`[CONFLICT] ${file} has local changes. Skipping.`);
                continue;
            }

            await fsp.writeFile(workingFilePath, remoteContent);
            console.log(`[UPDATED] ${file}`);
        }

        // 🔹 STEP 6: Update HEAD
        await fsp.writeFile(headPath, latestCommit.id, "utf-8");

        console.log("\n✅ Pull completed successfully!");

    } catch (err) {
        console.error("Pull failed:", err.message);
    }
}

module.exports = { pull };