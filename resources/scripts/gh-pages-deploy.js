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
        console.log("Building...\n");
        await print(execa("npm", ["run", "build"]));

        // Check for uncommitted changes
        try {
            await execa("git", ["update-index", "--refresh"], shell);
        } catch (e) {}
        const mainDiff = await execa("git", ["diff-index", "HEAD"], shell);
        if (mainDiff.stdout) {
            console.log("\nStashing changes on main...");
            stashed = true;
            await execa("git", ["stash"], shell);
        }

        console.log("\nChecking for changes on gh-pages...\n")
        await print(execa("git", ["checkout", "gh-pages"], shell));
        await execa("git", ["--work-tree", "dist", "rm", "--cached", "-r", "."], shell);
        await execa("git", ["--work-tree", "dist", "add", "--all"], shell);
        const pagesDiff = await execa("git", ["--work-tree", "dist", "diff-index", "HEAD"], shell);
        if (pagesDiff.stdout) {
            console.log("\nPushing...");
            await print(execa("git", ["--work-tree", "dist", "commit", "-m", "Deploy"], shell));
            await print(execa("git", ["push"], shell));
            console.log("Successfully deployed!\n");
        } else {
            console.log("\nNo changes found!\n");
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
        console.log("Building...\n");
        await print(execa("npm", ["run", "build"]));

        console.log("\nChecking for changes on gh-pages...\n")
        await print(execa("git", ["checkout", "gh-pages"]));
        await execa("git", ["--work-tree", "dist", "rm", "--cached", "-r", "."]);
        await execa("git", ["--work-tree", "dist", "add", "--all"]);
        const pagesDiff = await execa("git", ["--work-tree", "dist", "diff-index", "HEAD"]);
        if (pagesDiff.stdout) {
            console.log("\nPushing...");
            await print(execa("git", ["--work-tree", "dist", "commit", "-m", "Deploy"]));
            await print(execa("git", ["push"]));
            console.log("Successfully deployed!\n");
        } else {
            console.log("\nNo changes found!\n");
        }
    } catch (e) {
        console.error(e);
        exitCode = 1;
    } finally {
        await print(execa("git", ["checkout", "-f", "main"]));
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
