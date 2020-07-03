const Blockchain = require('./blockchain')
const fs = require('fs');

let devUri = 'http://127.0.0.1:3569/';
let blockchain = new Blockchain();
let blockchainAccounts = [];
let blockchainWallets = [];
let count = 5;

for (let a = 0; a < count; a++) { 
    setTimeout(async () => {
        let account = await blockchain.createFlowAccount();
        blockchainWallets.push(account);
        blockchainAccounts.push('0x' + account.address);
        console.log('Account created on blockchain: ', account);

        if (a === count - 1) {
          deployContract();
        }
    }, a * 1500); // Timeout is needed to avoid sequence number problems
}

function deployContract() {
    fs.readFile(__dirname + '/../../contracts/DappState.cdc', 'utf8', async (err, contract) => {
        if (err) {
            return console.log(err);
        }

        // let info = await blockchain.deployFlowContract(contract);

        let config = {
            httpUri: devUri,
            dappStateContractAddress: ' ',
            accounts: blockchainAccounts,
            wallets: blockchainWallets
            ///+config    

        }

        // On each deployment, a configuration file is created so dapp and API can access the latest contract code
        fs.writeFileSync(__dirname + '/../dapp-config.json', JSON.stringify(config, null, '\t'), 'utf-8');


    });
}
