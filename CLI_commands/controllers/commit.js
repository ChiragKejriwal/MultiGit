const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function commit(message) {

    const repoPath = path.join(process.cwd(), '.multigit');
    const stagedPath = path.join(repoPath, 'stage');
    const commitsPath = path.join(repoPath, 'commits');
    const stagedFilePath = path.join(stagedPath, 'stage.json');
    const headPath = path.join(repoPath, 'HEAD');

    // 1. Check repo exists
    if (!fs.existsSync(repoPath)) {
        console.error('Not a MultiGit repository. Please initialize first.');
        return;
    }

    try {
        // 2. Check staging exists
        if (!fs.existsSync(stagedFilePath)) {
            console.error('No changes staged for commit.');
            return;
        }

        const stagedData = JSON.parse(
            await fsp.readFile(stagedFilePath, 'utf-8')
        );

        if (Object.keys(stagedData).length === 0) {
            console.error('No changes staged for commit.');
            return;
        }

        // 3. Read HEAD
        let parent = null;
        let parentFiles = {};

        if (fs.existsSync(headPath)) {
            const currentHead = (await fsp.readFile(headPath, 'utf-8')).trim();

            if (currentHead && currentHead !== 'null') {
                parent = currentHead;

                // 4. Load parent commit data
                const parentCommitPath = path.join(commitsPath, `${parent}.json`);

                if (fs.existsSync(parentCommitPath)) {
                    const parentData = JSON.parse(
                        await fsp.readFile(parentCommitPath, 'utf-8')
                    );

                    parentFiles = parentData.files || {};
                }
            }
        }

        // 5. Merge parent files + staged changes
        const newFiles = {
            ...parentFiles,
            ...stagedData
        };

        // 6. Create commit ID
        const commitId = uuidv4();

        // 7. Create commit object
        const commitData = {
            id: commitId,
            message: message,
            timestamp: new Date().toISOString(),
            parent: parent,
            files: newFiles
        };

        // 8. Save commit
        await fsp.writeFile(
            path.join(commitsPath, `${commitId}.json`),
            JSON.stringify(commitData, null, 2)
        );

        // 9. Update HEAD
        await fsp.writeFile(headPath, commitId, 'utf-8');

        // 10. Clear staging
        await fsp.writeFile(stagedFilePath, JSON.stringify({}, null, 2));

        console.log(`✅ Commit created: ${commitId}`);

    } catch (err) {
        console.error('Error during commit:', err);
    }
}

module.exports = {
    commit
};