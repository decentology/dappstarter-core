// Since emulator is reset we need to delete old accounts
// This must be at the very top or it won't work because
// some required scripts include this one
const fs = require("fs");
const dappConfigFile = __dirname + '/../dapp-config.json';
if (fs.existsSync(dappConfigFile)) {
  fs.unlinkSync(dappConfigFile);
}


const spawn = require("cross-spawn");
const networks = require('../flow-config.json');
const Blockchain = require('../lib/blockchain');
const waitOn = require('wait-on');
const fkill = require('fkill');

// Some control variables
let config = networks.development.config;
let accountCount = 6;
let keyCount = 3;

// Unpopulated dappConfig with service info only
let dappConfig = {
  httpUri: config.httpUri,
  dappStateContract: {
    owner: '',
    name: ''
  },
  accounts: [],
  serviceWallet: config.serviceWallet,
  wallets: []
};

(async () => {

  try {
    await fkill('flow');
  } catch(e) {
  }
  // Start the emulator
  const emulator = spawn("npx", [
    "flow",
    "emulator",
    "start",
    "--init=true",
    "--block-time=1s",
    "--persist=false",
    "--dbpath=./flowdb",
    "--service-priv-key=" + dappConfig.serviceWallet.keys[0].privateKey,
    "--service-sig-algo=ECDSA_P256",
    "--service-hash-algo=SHA3_256"
  ]);

  emulator.stdout.on("data", data => {
    console.log(data.toString());
  });

  emulator.stderr.on("data", data => {
    console.log(data.toString());
  });

  console.log('⏳ Waiting for Flow emulator to start...\n\n\n');

  let opts = {
    resources: [
      'tcp:3569'
    ]
  }

  // Once the emulator starts, create the test accounts
  // Create "accountCount" accounts each with "keyCount" keys
  // Split the keyCount down the middle and give the first half 1000 weight and the remaining 500 weight
  waitOn(opts)
    .then(async () => {

      for (let a = 0; a < accountCount; a++) {

        let keyInfo = [];
        for (let k = 0; k < keyCount; k++) {
          keyInfo.push({
            entropy: getEntropy(),  // Non-deterministic entropy
            weight: k < Math.ceil(keyCount / 2) ? 1000 : 500     // Half the keys will be 1000, the remaining 500
          });
        }

        // Create the account with the public keys
        let account = await Blockchain.createAccount(config, keyInfo);
        dappConfig.wallets.push(account);
        dappConfig.accounts.push(account.address);
        console.log(`🤖 Account created on blockchain: ${account.address}`);

        // Last timer event so we can continue
        if (a === accountCount - 1) {



          // Write the configuration file with test accounts and contract address for use in the web app dev
          fs.writeFileSync(dappConfigFile, JSON.stringify(dappConfig, null, '\t'), 'utf-8');
          console.log(`\n\n\🚀 Dapp configuration file created at ${dappConfigFile}\n\n`);

          let contract = fs.readFileSync(__dirname + '/../../contracts/DappState.cdc', 'utf8');
          let contractAddresses = await Blockchain.deployContract(config, dappConfig.accounts[0], contract);
          console.log(`\n\n\📄 Contract deployed successfully! \n\n`);

          let contractInfo = contractAddresses[0].split('.'); // A.20320323.DappState
          dappConfig.dappStateContract = {
            owner: contractInfo[1],
            name: contractInfo[2]
          }
          fs.writeFileSync(dappConfigFile, JSON.stringify(dappConfig, null, '\t'), 'utf-8');
          console.log(`\n\n\🚀 Dapp configuration file updated with contract address\n\n`);

        }
      }

    });


  function getEntropy() {
    let entropy = [];
    for (let e = 0; e < 24; e++) {  // Minimum 24 bytes needed for entropy
      entropy.push(Math.floor(Math.random() * 254));      // This is totally contrived for test account generation
    }
    return entropy;
  }

})();
