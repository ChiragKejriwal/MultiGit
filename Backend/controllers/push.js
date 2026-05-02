const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const supabase = require("../config/supabaseClient");

async function push(repoId){
    const repoPath = path.resolve(process.cwd(),".multigit");
    const objectsPath = path.join(repoPath,"objects");
    const commitsPath = path.join(repoPath,"commits");
    const headPath = path.join(repoPath,"HEAD");

    if(!fs.existsSync(repoPath)){
        console.log("Repository not found. Please initialize a repository first.");
        return;
    }

    try{

        const head = (await fsp.readFile(headPath,"utf-8")).trim();

        if(!head){
            console.log("No commits to push.");
            return;
        }

        const commitFile = path.join(commitsPath,`${head}.json`);
        const commitData = JSON.parse(await fsp.readFile(commitFile,"utf-8"));

        const files = commitData.files;

        for(const file in files){

            const hash = files[file];
            const objectFilePath = path.join(objectsPath,hash);
            const fileContent = await fsp.readFile(objectFilePath);

            const storagePath = `${repoId}/objects/${hash}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from("Multigit")
                .upload(storagePath, fileContent, {
                    upsert: false,
                });

            if (error && error.message !== "The resource already exists") {
                console.error("Upload error:", error.message);
            } else {
                console.log(`Uploaded object: ${hash}`);
            }

        }

        // Store commit metadata in Supabase Database
        const { data, error } = await supabase
            .from("commits")
            .insert([
                {
                    id: commitData.id,
                    repo_id: repoId,
                    message: commitData.message,
                    parent_id: commitData.parent,
                    timestamp: commitData.timestamp,
                    files: commitData.files
                },
            ]);

            if(error){
                console.error("Database error:",error.message);
                return;
            }
            
            console.log("Commit metadata stored successfully.");

    } catch (error) {
        console.error("Error occurred while pushing changes:", error);
    }
}

module.exports = {
    push
}