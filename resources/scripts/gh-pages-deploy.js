const os = require("node:os").type();
const fs = require("fs");

const dist = {cwd: "./dist"};
const winGit = {shell: "C:/Program Files/Git/bin/bash.exe"};
const winGitDist = {...winGit, ...dist};
const bootstrapPath1 = "./node_modules/bootstrap/dist/css/bootstrap.css";
const bootstrapPath2 = "./node_modules/bootstrap/dist/css/bootstrap.min.css";

async function print(promise) {
    return promise.then(res => {
        console.log(res.stderr);
        console.log(res.stdout);
    }, console.log);
}

// Bootstrap CSS references a dev "map" file which isn't shipped or needed in prod.
function removeBsCssMap() {
    const data1 = fs.readFileSync(bootstrapPath1, "utf-8");
    const newData1 = data1.replace("\n/*# sourceMappingURL=bootstrap.css.map */", "");
    fs.writeFileSync(bootstrapPath1, newData1, "utf-8");

    const data2 = fs.readFileSync(bootstrapPath2, "utf-8");
    const newData2 = data2.replace("\n/*# sourceMappingURL=bootstrap.min.css.map */", "");
    fs.writeFileSync(bootstrapPath2, newData2, "utf-8");
}

// Inspired by https://dev.to/the_one/deploy-to-github-pages-like-a-pro-with-github-actions-4hdg
async function scriptWin() {
    const {execa} = await import("execa");

    try {
        await execa("rm", ["-r", "dist"], winGit);
    } catch (e) {
    }
    await execa("git", ["worktree", "prune"], winGit);
    try {
        await execa("git", ["branch", "-d", "gh-pages"], winGit);
    } catch (e) {
    }
    await print(execa("git", ["worktree", "add", "dist", "gh-pages"], winGit));

    console.log("\nBuilding...\n");
    await print(execa("npm", ["run", "build"]));

    console.log("\nChecking for changes...");
    await execa("git", ["rm", "--cached", "-r", "."], winGitDist);
    await execa("git", ["add", "--all"], winGitDist);
    const pagesDiff = await execa("git", ["diff-index", "HEAD"], winGitDist);
    if (pagesDiff.stdout) {
        console.log("\nPushing...");
        await print(execa("git", ["commit", "-m", '"Manual deployment"'], winGitDist));
        await print(execa("git", ["push"], winGitDist));
        console.log("Successfully deployed!\n");
    } else {
        console.log("\nNo changes found!\n");
    }
}

// Version for GitHub Actions
async function scriptLinux() {
    const {execa} = await import("execa");

    try {
        await execa("rm", ["-r", "dist"]);
    } catch (e) {
    }
    await execa("git", ["worktree", "prune"]);
    await print(execa("git", ["worktree", "add", "dist", "gh-pages"]));

    console.log("\nBuilding...");
    await print(execa("npm", ["run", "build"]));

    console.log("\nChecking for changes...");
    await execa("git", ["rm", "--cached", "-r", "."], dist);
    await execa("git", ["add", "--all"], dist);
    const pagesDiff = await execa("git", ["diff-index", "HEAD"], dist);
    if (pagesDiff.stdout) {
        console.log("\nPushing...");
        await print(execa("git", ["commit", "-m", 'Automatic deployment'], dist));
        await print(execa("git", ["push"], dist));
        console.log("Successfully deployed!\n");
    } else {
        console.log("\nNo changes found!\n");
    }
}

removeBsCssMap();
if (os === "Windows_NT") {
    scriptWin();
} else if (os === "Linux") {
    scriptLinux();
} else {
    console.error("Unsupported operating system:", os);
}
