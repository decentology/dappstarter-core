const Hypergrep = require("../hypergrep/src/hypergrep");

if (process.argv.length < 4) {
  console.log('Syntax: node generate (dev | stage) (input file)');
} else {
  let sourceRoot = __dirname;
  let inputFile = `${sourceRoot}/~inputs/${process.argv[3]}.json`;
  console.log("Input File:", inputFile);

  let settings = require(inputFile);
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