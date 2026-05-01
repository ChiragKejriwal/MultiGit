const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const {v4: uuidv4} = require('uuid');

async function commit(message) {

    const repoPath = path.join(process.cwd(), '.multigit');
    const stagedPath = path.join(repoPath, 'stage');
    const commitsPath = path.join(repoPath, 'commits');
    const stagedFilePath = path.join(stagedPath, 'stage.json');
    const headPath = path.join(repoPath, 'HEAD');

    if (!fs.existsSync(repoPath)) {
        console.error('Not a MultiGit repository. Please initialize first.');
        return;
    }

    try{

        if (!fs.existsSync(stagedFilePath)) {
            console.error('No changes staged for commit.');
            return;
        }

        const stagedData = JSON.parse(await fsp.readFile(stagedFilePath, 'utf-8'));

        if(Object.keys(stagedData).length === 0){
            console.error('No changes staged for commit.');
            return;
        }

        const currentHead = (await fsp.readFile(headPath, 'utf-8')).trim();

        const parent = currentHead === 'null' ? null : currentHead;

        const commitId = uuidv4();

        const commitData = {

            id: commitId,
            message: message,
            timestamp: new Date().toISOString(),
            parent: parent,
            files : stagedData
            };


        await fsp.writeFile(path.join(commitsPath, `${commitId}.json`), JSON.stringify(commitData, null, 2));

        await fsp.writeFile(headPath, commitId , 'utf-8');

        await fsp.writeFile(stagedFilePath, JSON.stringify({}, null, 2));

        console.log(`Commit with CommitId "${commitId}" was created with message "${message}"`);

    }catch(err){
        
        console.error('Error during commit:', err);
    
    }
}

module.exports = {
    commit
};