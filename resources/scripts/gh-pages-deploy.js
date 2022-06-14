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
    try {
        console.log("Building...");
        await print(execa("npm", ["run", "build"]));

        console.log("Pushing...");
        await print(execa("git", ["checkout", "--orphan", "gh-pages"], shell));
        await print(execa("git", ["--work-tree", "dist", "add", "--all"], shell));
        await print(execa("git", ["--work-tree", "dist", "commit", "-m", "Deploy"], shell));
        await print(execa("git", ["push", "origin", "HEAD:gh-pages", "--force"], shell));

        console.log("Successfully deployed");
    } catch (e) {
        console.error(e);
        exitCode = 1;
    } finally {
        await execa("git", ["checkout", "-f", "main"], shell);
        await execa("git", ["branch", "-D", "gh-pages"], shell);
    }
    process.exit(exitCode);
}

async function test() {
    const {execa} = await import("execa");
    try {
        await execa("git", ["update-index", "--refresh"], shell);
    } catch (e) {}
    const { stdout } = await execa("git", ["diff-index", "HEAD"], shell);
    console.log("res:", stdout ? true : false);
    //const {stdout} = await execa("git", ["update-index", "--refresh"], shell);
    // const aa = await execa("git", ["status"], shell);
    // console.log(aa);
}

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
    test();
    //scriptWin();
} else if (os === "Linux") {
    scriptLinux();
} else {
    console.error("Unsupported operating system:", os);
}
