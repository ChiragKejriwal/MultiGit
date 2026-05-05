const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

async function resolveHead(repoPath) {
    const headFile = path.join(repoPath, "HEAD");

    if (!fs.existsSync(headFile)) return null;

    let headValue = (await fsp.readFile(headFile, "utf-8")).trim();

    // Support for future: HEAD → ref: refs/main
    if (headValue.startsWith("ref:")) {
        const refPath = headValue.replace("ref:", "").trim();
        const fullRefPath = path.join(repoPath, refPath);

        if (!fs.existsSync(fullRefPath)) return null;

        headValue = (await fsp.readFile(fullRefPath, "utf-8")).trim();
    }

    return headValue || null;
}

/**
 * Load a commit object by ID
 */

async function loadCommit(repoPath, commitId) {
    const commitFile = path.join(repoPath, "commits", `${commitId}.json`);

    if (!fs.existsSync(commitFile)) return null;

    const data = await fsp.readFile(commitFile, "utf-8");
    return JSON.parse(data);
}

/**
 * Traverse commit chain from HEAD backwards
 */

async function collectHistory(repoPath, startId) {
    const history = [];

    let current = startId;

    while (current) {
        const commit = await loadCommit(repoPath, current);
        if (!commit) break;

        history.push(commit);
        current = commit.parent;
    }

    return history;
}

/**
 * Print commits in readable format
 */
function displayHistory(commits) {
    if (commits.length === 0) {
        console.log("No commits yet.");
        return;
    }

    console.log("\n📜 Commit History:\n");

    commits.forEach(commit => {
        console.log(`commit ${commit.id}`);
        console.log(`Date: ${new Date(commit.timestamp).toString()}`);
        console.log(`\n    ${commit.message}\n`);
        console.log("--------------------------------------------------");
    });
}

/**
 * Main log command
 */
async function log() {
    const repoPath = path.join(process.cwd(), ".multigit");

    if (!fs.existsSync(repoPath)) {
        console.log("Not a MultiGit repository.");
        return;
    }

    try {
        const headCommit = await resolveHead(repoPath);

        if (!headCommit) {
            console.log("No commits yet.");
            return;
        }

        const history = await collectHistory(repoPath, headCommit);
        displayHistory(history);

    } catch (err) {
        console.error("Error reading commit history:", err);
    }
}

module.exports = { log };