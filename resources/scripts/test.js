async function script() {
    const {execa} = await import("execa");
    // await execa("npm", ["run", "build"]).stdout.pipe(process.stdout);
    const out = await execa("git", ["help"]);
    console.log("out:", out);
}

script();