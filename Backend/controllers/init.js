const fs = require('fs').promises;
const path = require('path');

async function initRepo() {

    const initPath = path.resolve(process.cwd(), '.multigit');
    const commitsPath = path.join(initPath, 'commits');
    const stagePath = path.join(initPath, 'stage');
    const objectsPath = path.join(initPath, 'objects');
    const headPath = path.join(initPath, 'HEAD');

    try {
        await fs.mkdir(initPath, {recursive: true});
        await fs.mkdir(commitsPath, {recursive: true});
        await fs.mkdir(stagePath, {recursive: true});
        await fs.mkdir(objectsPath, {recursive: true});

        await fs.writeFile(
            path.join(stagePath,'stage.json'),
             JSON.stringify({}, null, 2)
        );

        await fs.writeFile(
            path.join(initPath, 'config.json'),
            JSON.stringify({repositories: []}, null, 2)
        );

        await fsp.writeFile(headPath, "", "utf-8");

        console.log('Repository initialized');

    } catch (err) {

        console.error('Error initializing repository:', err);

    }
}


module.exports = {initRepo};