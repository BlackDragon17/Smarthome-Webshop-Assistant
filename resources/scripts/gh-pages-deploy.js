const os = require("node:os").type();
const shell = {shell: "C:/Program Files/Git/bin/bash.exe"};

async function print(promise) {
    return promise.then(res => {
        console.log(res.stderr);
        console.log(res.stdout);
    }, console.log);
}

// https://dev.to/the_one/deploy-to-github-pages-like-a-pro-with-github-actions-4hdg
async function scriptWin() {
    const {execa} = await import("execa");
    let exitCode = 0;
    let stashed = false;
    try {
        // Check for uncommitted changes
        try {
            await execa("git", ["update-index", "--refresh"], shell);
        } catch (e) {}
        const mainDiff = await execa("git", ["diff-index", "HEAD"], shell);
        if (mainDiff.stdout) {
            console.log("Stashing changes...\n");
            stashed = true;
            await execa("git", ["stash"], shell);
        }

        console.log("Building...");
        await print(execa("npm", ["run", "build"]));

        console.log("\nChecking for changes...")
        await print(execa("git", ["checkout", "gh-pages"], shell));
        await execa("git", ["--work-tree", "dist", "rm", "--cached", "-r", "."], shell);
        await execa("git", ["--work-tree", "dist", "add", "--all"], shell);
        const pagesDiff = await execa("git", ["diff-index", "HEAD"], shell);
        if (pagesDiff.stdout) {
            console.log("\nPushing...");
            await print(execa("git", ["--work-tree", "dist", "commit", "-m", "Deploy"], shell));
            await print(execa("git", ["push"], shell));
            console.log("Successfully deployed");
        } else {
            console.log("\nNo changes found!");
        }
    } catch (e) {
        console.error(e);
        exitCode = 1;
    } finally {
        await print(execa("git", ["checkout", "-f", "main"], shell));
        if(stashed) {
            await execa("git", ["stash", "pop"], shell);
        }
    }
    process.exit(exitCode);
}

// Version for GitHub Actions
async function scriptLinux() {
    const {execa} = await import("execa");
    let exitCode = 0;
    try {
        console.log("Building...");
        await print(execa("npm", ["run", "build"]));

        console.log("Pushing...");
        await print(execa("git", ["checkout", "--orphan", "gh-pages"]));
        await print(execa("git", ["--work-tree", "dist", "add", "--all"]));
        await print(execa("git", ["--work-tree", "dist", "commit", "-m", "Deploy"]));
        await print(execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]));

        console.log("Successfully deployed");
    } catch (e) {
        console.error(e);
        exitCode = 1;
    } finally {
        await execa("git", ["checkout", "-f", "main"]);
        await execa("git", ["branch", "-D", "gh-pages"]);
    }
    process.exit(exitCode);
}

if (os === "Windows_NT") {
    scriptWin();
} else if (os === "Linux") {
    scriptLinux();
} else {
    console.error("Unsupported operating system:", os);
}
