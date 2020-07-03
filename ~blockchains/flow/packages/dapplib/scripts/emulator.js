const spawn = require("cross-spawn");

const privateKey = 'f06d20b6336d365a3347cc1b2897a9c3ce4b18689e6ea34f9e6975718dea5da9';

// https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md
// https://asecuritysite.com/encryption/ethadd
const emulator = spawn("npx", [
  "flow",
  "emulator", 
  "start",
  "--init=true",
  "--block-time=1s",
  "--persist=false",
  "--dbpath=./flowdb",
  "--service-priv-key=" + privateKey,
  "--service-sig-algo=ECDSA_P256",
  "--service-hash-algo=SHA3_256"
]);


emulator.stdout.on("data", data => {
  console.log(data.toString());
});

emulator.stderr.on("data", data => {
  console.log(data.toString());
});
