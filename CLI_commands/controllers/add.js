const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");

function getIgnoredPatterns() {
  const ignorePath = path.join(process.cwd(), ".multigitignore");
  if (!fs.existsSync(ignorePath)) return [];

  const content = fs.readFileSync(ignorePath, "utf-8");
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function matchesIgnore(filePath, patterns) {
    return patterns.some(pattern => {
        if (pattern.endsWith("/")) {
            return filePath.startsWith(pattern);
        }
        if (pattern.startsWith("*.")) {
            return filePath.endsWith(pattern.slice(1));
        }
        return filePath === pattern;
    });
}

async function add(filePath) {
  const initPath = path.join(process.cwd(), ".multigit");
  const objectsPath = path.join(initPath, "objects");
  const stagePath = path.join(initPath, "stage");
  const stageFilePath = path.join(stagePath, "stage.json");

  if (!fs.existsSync(initPath)) {
    console.error(
      'Not a MultiGit repository. Please run "init" command first.',
    );
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File "${filePath}" does not exist.`);
    return;
  }

  try {

    const ignorePatterns = getIgnoredPatterns();

    if (matchesIgnore(filePath, ignorePatterns)) {
        console.log(`File "${filePath}" is ignored. Skipping.`);
        return;
    }

    const content = await fsp.readFile(filePath);

    const hash = crypto.createHash("sha256").update(content).digest("hex");

    console.log("hash: ", hash);

    const objectFilePath = path.join(objectsPath, hash);

    if (!fs.existsSync(objectFilePath)) {
      await fsp.writeFile(objectFilePath, content);
      console.log(`File "${filePath}" added to objects.`);
    } else {
      console.log(`File "${filePath}" already exists in objects.`);
    }

    let stageData = {};

    if (fs.existsSync(stageFilePath)) {
      const stageContent = await fsp.readFile(stageFilePath, "utf-8");
      stageData = JSON.parse(stageContent);
    }

    stageData[filePath] = hash;

    await fsp.writeFile(stageFilePath, JSON.stringify(stageData, null, 2));

    console.log(`File "${filePath}" staged for commit.`);
  } catch (err) {
    console.error("Error adding file:", err);
  }
}

module.exports = { add };
