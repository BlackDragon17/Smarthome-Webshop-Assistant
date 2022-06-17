const os = require("node:os").type();
const dist = {cwd: "./dist"};
const winGit = {shell: "C:/Program Files/Git/bin/bash.exe"};
const winGitDist = {...winGit, ...dist};

async function print(promise) {
    return promise.then(res => {
        console.log(res.stderr);
        console.log(res.stdout);
    }, console.log);
}

// Inspired by https://dev.to/the_one/deploy-to-github-pages-like-a-pro-with-github-actions-4hdg
async function scriptWin() {
    const {execa} = await import("execa");

    try {
        await execa("rm", ["-r", "dist"], winGit);
    } catch (e) {
    }
    await execa("git", ["worktree", "prune"], winGit);
    await print(execa("git", ["worktree", "add", "dist", "gh-pages"], winGit));

    console.log("\nBuilding...\n");
    await print(execa("npm", ["run", "build"]));

    console.log("\nChecking for changes...");
    await execa("git", ["rm", "--cached", "-r", "."], winGitDist);
    await execa("git", ["add", "--all"], winGitDist);
    const pagesDiff = await execa("git", ["diff-index", "HEAD"], winGitDist);
    if (pagesDiff.stdout) {
        console.log("\nPushing...");
        await print(execa("git", ["commit", "-m", '"Manual deploy"'], winGitDist));
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

    console.log("\nBuilding...\n");
    await print(execa("npm", ["run", "build"]));

    console.log("\nChecking for changes...");
    await execa("git", ["rm", "--cached", "-r", "."], dist);
    await execa("git", ["add", "--all"], dist);
    const pagesDiff = await execa("git", ["diff-index", "HEAD"], dist);
    if (pagesDiff.stdout) {
        console.log("\nPushing...");
        await print(execa("git", ["commit", "-m", '"Automatic deploy"'], dist));
        await print(execa("git", ["push"], dist));
        console.log("Successfully deployed!\n");
    } else {
        console.log("\nNo changes found!\n");
    }
}

if (os === "Windows_NT") {
    scriptWin();
} else if (os === "Linux") {
    scriptLinux();
} else {
    console.error("Unsupported operating system:", os);
}
