const fs = require('fs');
const path = require('path');
const waitOn = require('wait-on');
const spawn = require('cross-spawn');
const fkill = require('fkill');
const walk = require('walkdir');
const toposort = require('toposort');
const { Flow } = require('./flow');
const flowConfig = require('./flow.json');

const NEWLINE = '\n';
const TAB = '\t';
const BLOCK_INTERVAL = 0;
const MODE = {
  DEFAULT: 'default',
  DEPLOY: 'deploy',
  TRANSPILE: 'transpile',
  TEST: 'test'
}
const NETWORK_EMULATOR_KEY = 'emulator';
const SCRIPT_NAME = 'rhythm.js';

const mode = process.argv.length > 2 ? process.argv[process.argv.length - 1].toLowerCase() : MODE.DEFAULT;
const chainContracts = {};
Object.keys(flowConfig.contracts).forEach((key) => {
  chainContracts[key] = flowConfig.contracts[key].aliases[NETWORK_EMULATOR_KEY];
});

const emulator = flowConfig.emulators[mode === MODE.TEST ? MODE.TEST : MODE.DEFAULT];
const serviceAccount = flowConfig.accounts[emulator.serviceAccount];
const httpUri = 'http://localhost:8080';
const serviceWallet = {
  'address': '0x' + serviceAccount.address,
  'keys': [
    {
      'privateKey': serviceAccount.keys,
      'keyId': 0,
      'weight': 1000
    }
  ]
}

const dappConfigFile = path.join(__dirname, 'dapp-config.json');

(async () => {
  let accountCount = 5;
  let keyCount = 2;
  let dappConfig = null;
  let pending = false;
  let queue = [];
  let tokens = 1000;

  if ((mode === MODE.DEFAULT) || (mode === MODE.TEST)) {

    // For testing, generate accounts etc. but don't
    // update the dapp-config file
    if (fs.existsSync(dappConfigFile)) {
      fs.unlinkSync(dappConfigFile);
    }

    // Unpopulated dappConfig with service info only
    dappConfig = {
      httpUri,
      contracts: chainContracts,
      accounts: [],
      serviceWallet: serviceWallet,
      contractWallet: null,
      wallets: [],
    };

    // Launch the Flow emulator with a different configuration based on
    // emulate or test mode
    await launchEmulator();

    let opts = {
      resources: ['tcp:' + emulator.port],
    };

    // Once the emulator starts, create the test accounts
    // Create 'accountCount' accounts each with 'keyCount' keys
    // Split the keyCount down the middle and give the first half 1000 weight and the remaining 500 weight
    // Create an account for each contract found in packages/dapplib/contracts/core and its subfolders
    // and deploy these contracts
    waitOn(opts).then(async () => {
      accountCount++; // Add an account to which non-project contracts will be deployed

      await createTestAccounts();
      updateConfiguration();
      processContractFolders(['Flow', 'Decentology'])
        .then(() => {
          if (mode === MODE.DEFAULT) {
            spawn('npx', ['watch', `node ${path.join(__dirname, SCRIPT_NAME)} deploy`, 'contracts/Project'], { stdio: 'inherit' });
          } else if (mode === MODE.TEST) {
            processContractFolders(['Project'])
              .then(async () => {
                await transpile();
                spawn.sync('npx', ['mocha', '--timeout', '20000', path.join(__dirname, '..', '..', 'dapplib', 'tests')], {
                  stdio: 'inherit',
                });
              });
          }
        });
    });

  } else if (mode === MODE.DEPLOY) {

    // After all the vendor contracts are deployed, the call back runs this script file with a watch
    // on the contracts folder and an arg of 'deploy' causing processing to start here
    processContractFolders(['Project'])
      .then(() => {
        spawn('npx', ['watch', `node ${path.join(__dirname, SCRIPT_NAME)} transpile`, 'interactions'], { stdio: 'inherit' });
      });

  } else if (mode === MODE.TRANSPILE) {

    // After all the project contracts are deployed, the call back runs this script file with a watch
    // on the interactions folder and an arg of 'transpile' causing processing to start here

    await transpile();

  }

  async function launchEmulator() {

    try {
      if (mode === MODE.DEFAULT) {
        await fkill('flow');
      }
    } catch (e) {
      // In case it isn't already running
    }

    // Start the emulator
    const emulatorInstance = spawn('npx', [
      'flow',
      'emulator',
      'start',
      '--config-path=./flow.json',
      '--port=' + emulator.port,
      '--init=true',
      '--block-time=' + BLOCK_INTERVAL + 'ms',
      '--persist=false',  // This is important, especially for testing
      '--dbpath=./flowdb' + mode,
      '--service-priv-key=' + serviceAccount.keys,
      '--service-sig-algo=ECDSA_P256',
      '--service-hash-algo=SHA3_256',
      mode == MODE.TEST ? '' : '-v'
    ]);

    if (mode != MODE.TEST) {
      emulatorInstance.stdout.on('data', (data) => {
        let d = data.toString().replace(/\\x1b/g, '\x1b').replace(/"/g, '').replace(/time=[0-9]{4}-[0-9]{2}-[a-zA-Z0-9]{5}:[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}/g, '').replace(/level=debug msg=/g, '').replace(/level=info msg=/g, '').replace(/level=warning msg=/g, '');
        console.log(d)
      });
    } else {
      emulatorInstance.stdout.on('data', (data) => {

      });
    }

    emulatorInstance.stderr.on('data', (data) => {
      console.log('\n' + data.toString());
    });

    console.log('\n' + '⏳  Waiting for Flow emulator to start...');
  }

  async function createTestAccounts() {
    let flow = new Flow({
      httpUri,
      serviceWallet
    });
    for (let a = 0; a < accountCount; a++) {
      let keyInfo = [];
      for (let k = 0; k < keyCount; k++) {
        keyInfo.push({
          entropy: Flow.getEntropy(), // Non-deterministic entropy
          weight: k < Math.ceil(keyCount / 2) ? 1000 : 500, // Half the keys will be 1000, the remaining 500
        });
      }

      // Create the account with the public keys
      //
      // You do not have to include a second parameter, but if you don't,
      // you may deal with contract storage issues.
      let account = await flow.createAccount(keyInfo, String(tokens) + '.0');

      if (a == accountCount - 1) {
        dappConfig.contractWallet = account;
      } else {
        dappConfig.accounts.push(account.address);
      }
      dappConfig.wallets.push(account);
      console.log(`\n🤖  Account created on blockchain: ${account.address}`);
    }
  }

  function processContractFolders(folders) {

    return new Promise((resolve, reject) => {
      let sourceFolder = path.join(__dirname, '..', '..', 'dapplib', 'contracts');
      try {
        dappConfig = JSON.parse(fs.readFileSync(dappConfigFile, 'utf8'));
      }
      catch (e) {
        // Can be ignored as file will be regenerated
      }
      let queueItems = [];
      let contracts = {};

      let emitter = walk(sourceFolder, filePath => { });

      emitter.on('file', filePath => {
        for (let f = 0; f < folders.length; f++) {
          if ((filePath.endsWith('.cdc')) && (filePath.indexOf(`/contracts/${folders[f]}/`) > -1)) {
            // Gets all the dependencies for the contracts in this specific folder
            let { code, contractNames, deps } = getContractDependencies(folders[f], filePath);

            // Puts all the dependencies in a queueItems array to be sorted later
            queueItems = queueItems.concat(deps);
            contractNames.forEach((cname) => {
              contracts[cname] = code;
            })
            break;
          }
        }
      });

      emitter.on('end', () => {
        let sorted = toposort(queueItems);
        queue = [];

        sorted.forEach((s) => {
          // Do not put already deployed contracts into the queue
          // because the queue will try to deploy them again
          if (s !== null && !Object.keys(dappConfig.contracts).includes(s)) {
            queue.push({
              prefix: s.split('.')[0],
              contractName: s.split('.')[1],
              contract: contracts[s],
              address: dappConfig.accounts[0]
              //            address: dappConfig.deployAccountHints[s] ? dappConfig.accounts[dappConfig.deployAccountHints[s]] : dappConfig.accounts[0]
            });
          }
        });

        deployContracts(async () => {
          resolve();
        });
      });
    });
  }

  function getContractDependencies(contractType, filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    let contractNames = [];
    let importRefs = [];
    let match = null;

    // Contract names defined in code
    const contractRegex = /\scontract\s+(interface\s+)?(?<contract>[a-zA-Z0-9_]+)\s*\:?.*\s*{\s/gm;
    while ((match = contractRegex.exec(code)) !== null) {
      contractNames.push(`${contractType}.${match.groups.contract}`);
    };
    //console.log(contractNames);

    // Contract imports referenced in code
    const importRegex = /\s*import\s+\S+\s+from\s+(?<import>\S+)\s+/gm;
    while ((match = importRegex.exec(code)) !== null) {
      // Check if import is for a chain contract and skip
      if (!chainContracts[match.groups.import]) {
        // If the import is using a path
        if (match.groups.import.includes('.cdc')) {
          let importSplit = match.groups.import.split('/')
          if (importSplit[importSplit.length - 2] == '".') {
            // This will take a path that looks like "./FungibleToken.cdc" and come up with
            // Flow.FungibleToken format by using the foldername that the contract is in
            importRefs.push(contractType + "." + importSplit[importSplit.length - 1].replace('.cdc"', ''));
          } else {
            // This will take a path that looks like "../Flow/FungibleToken.cdc" and come up with
            // Flow.FungibleToken format by using foldername right before the contract name in the path
            importRefs.push(importSplit[importSplit.length - 2] + "." + importSplit[importSplit.length - 1].replace('.cdc"', ''));
          }
        }
        // If the import is using the Project. or Flow. format
        else {
          // Simply push the Project. or Flow. format since that's
          // how we name contracts anyway in dapp-config
          importRefs.push(match.groups.import);
        }
      }
    };

    // Create an array of  [import, contract] pairs
    // for topological sort so imported contracts are deployed
    // before contracts that depend on them
    let deps = [];
    contractNames.forEach((cname) => {
      if (importRefs.length > 0) {
        importRefs.forEach((iname) => {
          deps.push([iname, cname]);
        });
      } else {
        deps.push([null, cname])
      }
    });

    return { code, contractNames, deps };
  }


  function deployContracts(callback) {

    let itemIndex = 0;
    let flow = new Flow({
      httpUri,
      serviceWallet
    });
    let handle = setInterval(async () => {
      if (pending) {
        return;
      }
      pending = true;

      if (itemIndex == queue.length) {
        clearInterval(handle);
        pending = false;
        if (callback) {
          callback();
        }
        return;
      }
      let item = queue[itemIndex];

      if (item !== null) {
        item.contract = Flow.replaceImportRefs(item.contract, dappConfig.contracts, item.prefix);
        console.log(
          `\n🛠   Deploying ${item.contractName} to account ${item.address}`
        );
        let contractAddress = await flow.deployContract(
          item.address,
          item.contractName,
          item.contract
        );
        console.log(
          `    ✅  ${item.contractName} => ${contractAddress}`
        );
        dappConfig.contracts[
          (item.prefix ? item.prefix + '.' : '') + item.contractName
        ] = contractAddress;
        updateConfiguration();
      }

      itemIndex++;

      pending = false;
    }, BLOCK_INTERVAL);
  }

  async function transpile(runTest) {
    if (fs.existsSync(dappConfigFile)) {
      console.log('\n🎛   Transpiling scripts and transactions...');
      dappConfig = JSON.parse(fs.readFileSync(dappConfigFile, 'utf8'));

      let interactionsFolder = path.join(__dirname, '..', '..', 'dapplib', 'interactions');
      let destFolder = __dirname;

      await generate(interactionsFolder, destFolder, 'scripts', dappConfig.contracts);
      await generate(interactionsFolder, destFolder, 'transactions', dappConfig.contracts);
    }
  }


  function updateConfiguration() {
    //Write the configuration file with test and contract accounts for use in the web app dev
    fs.writeFileSync(
      dappConfigFile,
      JSON.stringify(dappConfig, null, '\t'),
      'utf8'
    );
    console.log(
      `\n🚀  Dapp configuration file updated at ${dappConfigFile}`
    );
  }

  async function generate(interactionsFolder, destFolder, type, deployedContracts) {

    return new Promise((resolve, reject) => {
      let isTransaction = type === 'transactions';
      // Outermost class wrapper
      let outSource = '// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨' + NEWLINE;
      outSource += '// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES' + NEWLINE;
      outSource += '// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN' + NEWLINE;
      outSource += '// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨' + NEWLINE + NEWLINE;
      outSource += 'const fcl = require("@onflow/fcl");' + NEWLINE + NEWLINE;
      outSource += 'module.exports = class Dapp' + (isTransaction ? 'Transactions' : 'Scripts') + ' {' + NEWLINE;


      // Read the 'scripts' or 'transactions' folder as determined by 'type'
      let sourceFolder = path.join(interactionsFolder, type);
      let emitter = walk(sourceFolder, filePath => { });

      emitter.on('file', filePath => {
        if (filePath.endsWith('.cdc')) {
          let functionName = filePath.replace(sourceFolder + path.sep, '');
          functionName = functionName.split(path.sep).join('_');
          functionName = functionName.split('.')[0];

          let code = fs.readFileSync(filePath, 'utf8');

          // Function name
          outSource += NEWLINE + TAB + 'static ' + functionName + '() {' + NEWLINE;

          // All the code is added into a JS template literal so line breaks
          // are preserved. We also need to inject imports at run-time which 
          // a template literal enables quite easily
          outSource += TAB + TAB + 'return fcl.' + (isTransaction ? 'transaction' : 'script') + '`' + NEWLINE;
          outSource += Flow.replaceImportRefs(code, deployedContracts);
          outSource += TAB + TAB + '`;';
          outSource += NEWLINE + TAB + '}' + NEWLINE;
        }

      });

      emitter.on('end', () => {
        outSource += NEWLINE + '}' + NEWLINE;

        // Create dapp-*.js output file based on the type
        fs.writeFileSync(path.join(destFolder, 'dapp-' + type + '.js'), outSource, 'utf8')
        console.log(`\n    📑  Transpiled ${type} to dapp-${type}.js`);
        resolve();
      });
    });

  }

})();
