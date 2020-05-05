const truffleConfig = require("../truffle-config");
const spawn = require("cross-spawn");
const ganache = spawn("npx", [
  "ganache-cli",
  "--mnemonic",
  `"${truffleConfig.mnemonic}"`,
  "-p",
  "7545"
]);

ganache.stdout.on("data", data => {
  console.log(data.toString());
});

ganache.stderr.on("data", data => {
  console.log(data.toString());
});
