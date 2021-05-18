const DappStateContract = require("../build/contracts/DappState.json");
const DappContract = require("../build/contracts/Dapp.json");
const deployer = require("../truffle-config.js");
const fs = require("fs");
const path = require("path");
const ethers = require("ethers");
const network = deployer.networks["development"];

(async () => {

  // Clean-up truffle artifacts
  if (fs.existsSync(path.join(__dirname, '..', 'migrations'))) {
      fs.rmdirSync(path.join(__dirname, '..', 'migrations'), { recursive: true});
  }

  let httpUri = network.uri;
  let wsUri = "";
  if (network.wsUri) {
    wsUri = network.wsUri;
  } else if (httpUri) {
    wsUri = httpUri.replace("http", "ws").replace("/rpc", "/ws");
  }

  let accounts = [];
  let wallets = [];
  let provider = network.walletProvider
    ? network.walletProvider()
    : network.provider();

  for (let address in provider.wallets) {
    let wallet = provider.wallets[address];
    accounts.push(wallet.getAddressString());
    wallets.push({
      account: wallet.getAddressString(),
      publicKey: wallet.getPublicKeyString(),
      privateKey: wallet.getPrivateKeyString(),
    });
  }

  await deploy(DappStateContract, wallets[0].privateKey);
  await deploy(DappContract, wallets[0].privateKey, DappStateContract.address);
  let config = {
    httpUri: httpUri,
    wsUri: wsUri,
    chainId: network.chainId,
    gas: network.gas,
    gasPrice: network.gasPrice,
    dappStateContractAddress: DappStateContract.address,
    dappContractAddress: DappContract.address,
    accounts: accounts,
    wallets: wallets,
    ipfs: {
      host: 'ipfs.infura.io',
      protocol: 'https',
      port: 5001
    },
    sia: {
      host: 'siasky.net',
      protocol: 'https',
      port: 443
    }
  };

  // On each deployment, a configuration file is created so dapp and API can access the latest contract code
  fs.writeFileSync(
    __dirname + "/../src/dapp-config.json",
    JSON.stringify(config, null, "\t"),
    "utf8"
  );

  process.exit(0);

  async function deploy(contract, privateKey, ...args) {
    const provider = new ethers.providers.JsonRpcProvider(httpUri);

    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`\nLoaded wallet ${wallet.address}`);

    let factory = new ethers.ContractFactory(
      contract.abi,
      contract.bytecode,
      wallet
    );

    let instance = await factory.deploy(...args, {
      gasLimit: network.gas,
      chainId: network.chainId,
    });
    console.log("\nWaiting for the contract to get mined...");
    await instance.deployed();
    contract.address = instance.address;
    console.log(`\nContract address ${contract.address}`);
    return instance.address;
  }
})();
