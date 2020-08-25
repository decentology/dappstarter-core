const Hypergrep = require("../dappstarter-hypergrep/src/hypergrep");

if (process.argv.length < 4) {
  console.log('Syntax: node generate (dev | stage) (test file)');
} else {
  let sourceRoot = __dirname;
  let testFile = `${sourceRoot}/~tests/${process.argv[3]}.json`;
  console.log("Test File:", testFile);

  let settings = require(testFile);
  let stage = false;
  if (process.argv[2] === 'stage') {
    stage = true;
    settings["__outputFolder"] = "stage-dapp";
    console.log("Staging:", (stage ? "YES" : "NO"));
  }

  let hypergrep = new Hypergrep({
    sourceRoot: sourceRoot,
    targetRoot: __dirname + "/../output/"
  });

  hypergrep.process(settings, folder => {
    console.log("Output Project:", folder);
  });
}