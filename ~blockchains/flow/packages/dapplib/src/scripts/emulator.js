// Since emulator is reset we need to delete dapp-config and start over
const fs = require('fs');
const path = require('path');
const waitOn = require('wait-on');
const spawn = require('cross-spawn');
const fkill = require('fkill');
const { Flow } = require('../flow');
const networks = require('../flow-config.json');
const NEWLINE = '\n';
const TAB = '\t';
const BLOCK_INTERVAL = 200;

let config = networks.development.config;

const dappConfigFile = path.join(__dirname, '..', 'dapp-config.json');
let mode = 'emulate';
if (process.argv[process.argv.length - 1].toLowerCase() === 'deploy') {
  mode = 'deploy';
} else if (process.argv[process.argv.length - 1].toLowerCase() === 'transpile') {
  mode = 'transpile';
} else if (process.argv[process.argv.length - 1].toLowerCase() === 'test') {
  mode = 'test';
}

(async () => {
  let accountCount = 3;
  let keyCount = 4;
  let dappConfig = null;
  let pending = false;
  let queue = [];

  if ((mode === 'emulate') || (mode === 'test')) {
    if (fs.existsSync(dappConfigFile)) {
      fs.unlinkSync(dappConfigFile);
    }

    let newServiceWallet = config.serviceWallet
    newServiceWallet.address = "0x" + config.serviceWallet.address
    // Unpopulated dappConfig with service info only
    dappConfig = {
      httpUri: config.httpUri,
      contracts: {
        'Flow.FlowFees': '0xe5a8b7f23e8b548f',
        'Flow.FlowServiceAccount': '0xf8d6e0586b0a20c7',
        'Flow.FlowStorageFees': '0xf8d6e0586b0a20c7',
        'Flow.FlowToken': '0x0ae53cb6e3f42a79',
        'Flow.FungibleToken': '0xee82856bf20e2aa6',
      },
      accounts: [],
      serviceWallet: newServiceWallet,
      contractWallet: null,
      wallets: [],
    };

    try {
      await fkill('flow');
    } catch (e) { }
    // Start the emulator
    const emulator = spawn('npx', [
      'flow',
      'emulator',
      'start',
      '--init=true',
      '--block-time=' + BLOCK_INTERVAL + 'ms',
      '--persist=false',  // This is important, especially for testing
      '--dbpath=./flowdb',
      '--service-priv-key=' + dappConfig.serviceWallet.keys[0].privateKey,
      '--service-sig-algo=ECDSA_P256',
      '--service-hash-algo=SHA3_256',
    ]);

    emulator.stdout.on('data', (data) => {
      let d = data.toString();
      if (d.toString().indexOf('level=info msg="') > -1) {
        console.log(d.toString().split('level=info msg="')[1].replace('"', ''));
      } else {
        console.log(d.toString());
      }
    });

    emulator.stderr.on('data', (data) => {
      console.log('\n' + data.toString());
    });

    console.log('\n' + '⏳  Waiting for Flow emulator to start...');

    let opts = {
      resources: ['tcp:3569'],
    };

    // Once the emulator starts, create the test accounts
    // Create 'accountCount' accounts each with 'keyCount' keys
    // Split the keyCount down the middle and give the first half 1000 weight and the remaining 500 weight
    // Create an account for each contract found in packages/dapplib/contracts/core and its subfolders
    // and deploy these contracts
    waitOn(opts).then(async () => {
      accountCount++; // Add an account to which non-project contracts will be deployed

      spawn('npx', ['watch', `node ${path.join(__dirname, 'emulator.js')} deploy`, 'contracts/project'], { stdio: 'inherit' });
      spawn('npx', ['watch', `node ${path.join(__dirname, 'emulator.js')} transpile`, 'interactions'], { stdio: 'inherit' });

      await createTestAccounts();
      updateConfiguration();
      await deployVendorContracts(true);
    });

  } else if (mode === 'deploy') {

    // After all the vendor contracts are deployed, the call back runs this script file with a watch
    // on the contracts folder and an arg of 'deploy' causing processing to start here
    await deployProjectContracts();

  } else if (mode === 'transpile') {

    // After all the project contracts are deployed, the call back runs this script file with a watch
    // on the interactions folder and an arg of 'transpile' causing processing to start here

    transpile();

  }

  async function createTestAccounts() {
    let flow = new Flow(config);
    for (let a = 0; a < accountCount; a++) {
      let keyInfo = [];
      for (let k = 0; k < keyCount; k++) {
        keyInfo.push({
          entropy: Flow.getEntropy(), // Non-deterministic entropy
          weight: k < Math.ceil(keyCount / 2) ? 1000 : 500, // Half the keys will be 1000, the remaining 500
        });
      }

      // Create the account with the public keys
      let account = await flow.createAccount(keyInfo);

      if (a == accountCount - 1) {
        dappConfig.contractWallet = account;
      } else {
        dappConfig.accounts.push(account.address);
      }
      dappConfig.wallets.push(account);
      console.log(`\n🤖  Account created on blockchain: ${account.address}`);
    }
  }

  async function deployVendorContracts(processProjectContracts) {

    console.log('\n🎛   Deploying vendor contracts...');
    dappConfig = JSON.parse(fs.readFileSync(dappConfigFile, 'utf8'));
    let importsFolder = path.join(__dirname, '..', '..', 'contracts', 'vendor');

    queue = [];
    await queueContracts(importsFolder, dappConfig.contractWallet.address, ['Flow', 'Decentology']); // The order of sources is very important

    await deployContracts(async () => {
      // Vendor contracts are done deploying
      if (processProjectContracts === true) {
        await deployProjectContracts(true);
      }
    });
  }

  async function deployProjectContracts(runTranspiler) {

    if (fs.existsSync(dappConfigFile)) {
      console.log('\n🎛   Deploying project contracts...');
      dappConfig = JSON.parse(fs.readFileSync(dappConfigFile, 'utf8'));
      let contractsFolder = path.join(__dirname, '..', '..', 'contracts', 'project');

      queue = [];
      await queueContracts(contractsFolder, dappConfig.accounts[0]);

      await deployContracts(() => {
        // Always transpile after project contracts are deployed
        // to surface any errors in interactions due to contract changes
        if (runTranspiler === true) {
          transpile();
        }
      });
    }
  }

  function transpile(runTest) {
    if (fs.existsSync(dappConfigFile)) {
      console.log('\n🎛   Transpiling scripts and transactions...');
      dappConfig = JSON.parse(fs.readFileSync(dappConfigFile, 'utf8'));

      let interactionsFolder = path.join(__dirname, '..', '..', 'interactions');
      let destFolder = path.join(__dirname, '..');

      generate(interactionsFolder, destFolder, 'scripts', dappConfig.contracts);
      generate(interactionsFolder, destFolder, 'transactions', dappConfig.contracts);

      if (mode === 'test') {
        spawn.sync(path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'mocha', 'bin', 'mocha'), ['--timeout', '10000', path.join(__dirname, '..', '..', 'tests')], {
          stdio: 'inherit',
        });
        fkill('flow');
        fkill('node');
      }
    }

  }

  async function queueContracts(folder, address, sources) {
    if (sources && sources.length && sources.length > 0) {
      sources.forEach((source) => {
        queue = queue.concat(
          queueContractsInFolder(path.join(folder, source), address, source)
        );
      });
    } else {
      queue = queue.concat(
        queueContractsInFolder(folder, address, 'Project')
      );
    }
  }


  function queueContractsInFolder(folder, address, prefix) {
    let contracts = [];

    if (!folder.endsWith('imports')) {
      contracts = contracts.concat(
        queueContractsInFolder(path.join(folder, 'imports'), address, prefix)
      );
    }

    if (fs.existsSync(folder)) {
      let files = fs.readdirSync(folder);
      files.forEach(async (file) => {
        if (file.toLowerCase().endsWith('.cdc')) {
          let contract = fs.readFileSync(path.join(folder, file), 'utf8');
          let contractName = file.replace('.cdc', '');
          contractName = contractName.replace('01_', '')
          contractName = contractName.replace('02_', '')
          contractName = contractName.replace('03_', '')
          contracts.push({ prefix, address, contractName, contract });
        }
      });
    }

    return contracts;
  }

  async function deployContracts(callback) {

    let itemIndex = 0;
    let flow = new Flow(config);
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

      item.contract = Flow.replaceImportRefs(item.contract, dappConfig.contracts);
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

      itemIndex++;

      pending = false;
    }, BLOCK_INTERVAL);
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

  function generate(interactionsFolder, destFolder, type, deployedContracts) {

    let sourceFolder = path.join(interactionsFolder, type);
    // Read the 'scripts' or 'transactions' folder as determined by 'type'
    let items = fs.readdirSync(sourceFolder);
    let prefix = TAB + TAB + TAB + TAB;
    let isTransaction = type === 'transactions';
    // Outermost class wrapper
    let outSource = '// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨' + NEWLINE;
    outSource += '// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES' + NEWLINE;
    outSource += '// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN' + NEWLINE;
    outSource += '// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨' + NEWLINE + NEWLINE;
    outSource += 'const fcl = require("@onflow/fcl");' + NEWLINE + NEWLINE;
    outSource += 'module.exports = class Dapp' + (isTransaction ? 'Transactions' : 'Scripts') + ' {' + NEWLINE;

    // For each Cadence file found we are going to create a JS wrapper function
    items.forEach((item) => {
      let code = fs.readFileSync(path.join(sourceFolder, item), 'utf8');

      // Function name
      outSource += NEWLINE + TAB + 'static ' + item.replace('.cdc', '') + '() {' + NEWLINE;

      // All the code is added into a JS template literal so line breaks
      // are preserved. We also need to inject imports at run-time which 
      // a template literal enables quite easily
      outSource += TAB + TAB + 'return fcl.' + (isTransaction ? 'transaction' : 'script') + '`' + NEWLINE;

      outSource += Flow.replaceImportRefs(code, deployedContracts, prefix);

      outSource += TAB + TAB + '`;';
      outSource += NEWLINE + TAB + '}' + NEWLINE;
    });

    outSource += NEWLINE + '}' + NEWLINE;

    // Create dapp-*.js output file based on the type
    fs.writeFileSync(path.join(destFolder, 'dapp-' + type + '.js'), outSource, 'utf8')
    console.log(`\n    📑  Transpiled ${type} to dapp-${type}.js`);

  }

})();
