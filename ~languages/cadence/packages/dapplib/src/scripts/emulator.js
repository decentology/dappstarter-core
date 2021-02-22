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
  contracts: {},
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
          fs.writeFileSync(dappConfigFile, JSON.stringify(dappConfig, null, '\t'), 'utf8');
          console.log(`\n\n\🚀 Dapp configuration file created at ${dappConfigFile}\n\n`);

          let contractsDir = __dirname + '/../../contracts/';

          fs.readdir(contractsDir, function (err, files) {
            if (err) {
                return console.log('Unable to find contracts directory: ' + err);
            } 
            
            let deploying = false;
            let fileIndex = 0;
            let handle = setInterval(async() => {
              if (!deploying) {
                deploying = true;
                if (fileIndex > files.length - 1) {
                  clearInterval(handle);
                  fs.writeFileSync(dappConfigFile, JSON.stringify(dappConfig, null, '\t'), 'utf8');
                  console.log(`\n\n\🚀 Dapp configuration file updated with contract addresses\n\n`);
                  await complete();
                  return;
                }
                let file = files[fileIndex];
                if (file.toLowerCase().endsWith('.cdc')) {                  
                  let accountIndex = 0;
                  if (file.indexOf('_') > -1) {
                    let fileFrags = file.split('_');
                    for(let f=0;f<fileFrags.length;f++) {
                      if (!isNaN(fileFrags[f])) {
                        let targetAccountIndex = Number(fileFrags[f]);
                        if (targetAccountIndex < dappConfig.accounts.length) {
                          accountIndex = targetAccountIndex;
                        }
                        break;  
                      }
                    }                    
                  }
                  let contract = fs.readFileSync(contractsDir + file, 'utf8');
                  let contractName = file.replace('.cdc', '');
                  let contractAddress = await Blockchain.deployContract(config, dappConfig.accounts[accountIndex], contractName, contract);

                  console.log(`Deployed ${file} to account ${accountIndex} at ${dappConfig.accounts[accountIndex]}`);
                  dappConfig.contracts[contractName] = contractAddress;
                  deploying = false;
                  fileIndex++;
                }
              }
            }, 10);

          });

        }
      }

    });

  async function complete() {
    // If the emulator is being run for testing then 
    // we run tests then stop the emulator when we get here
    // node emulator test
    if (process.argv.length > 2) {

      let testFile = './tests';
      if (process.argv.length === 4) {
        testFile = testFile + '/' + process.argv[3];
      } 

      console.log('Starting tests...');

      spawn.sync('../../node_modules/mocha/bin/mocha', [testFile], { stdio: 'inherit' });

      try {
        await fkill('flow');
      } catch(e) {
      }  
    }

  }

  function getEntropy() {
    let entropy = [];
    for (let e = 0; e < 24; e++) {  // Minimum 24 bytes needed for entropy
      entropy.push(Math.floor(Math.random() * 254));      // This is totally contrived for test account generation
    }
    return entropy;
  }

})();
