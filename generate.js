const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const Hypergrep = require("./~scripts/hypergrep");

if (process.argv.length < 4) {
  console.log(chalk.green('\nSyntax: node generate (dev | stage | stage-watch) (test file)'));
  console.log(chalk.yellow('\n"dev": auto-generates an output folder.'));
  console.log(chalk.yellow('"stage": names the output folder same as the test file.'));
  console.log(chalk.yellow('"stage-watch": same as "stage," but also regenerates code if Core or Modules files change.\n'));
} else {

  if (process.argv[2] === 'stage-watch') {
    spawn('npx', ['watch', `node ${path.join(__dirname, 'generate.js')} stage ${process.argv[3]} -w`, __dirname, path.join(__dirname, '..', 'dappstarter-modules-core'), '-d'], { stdio: 'inherit' });
  } else {
    let sourceRoot = __dirname;
    let testFile = `${sourceRoot}/~tests/${process.argv[3]}.json`;
    console.log("Test File:", testFile);
  
    let settings = require(testFile);
    let stage = false;
    if (process.argv[2].startsWith('stage')) {
      stage = true;
      settings["__outputFolder"] = process.argv[3];
      console.log("Staging:", (stage ? "YES" : "NO"));
    }
  
    let hypergrep = new Hypergrep({
      sourceRoot: sourceRoot,
      targetRoot: __dirname + "/../output/"
    });
  
    hypergrep.process(settings, folder => {
        console.log("Output Project:", folder);
        if (process.argv[4] && (process.argv[4] === '-w')) {
          console.log(chalk.red('\n👀 Watching Core and Module files for changes...\n'));  
        }
      });
  }

}