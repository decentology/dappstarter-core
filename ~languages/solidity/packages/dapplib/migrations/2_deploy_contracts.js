const DappStateContract = artifacts.require("DappState");
const DappContract = artifacts.require("Dapp");
const fs = require('fs');

module.exports = function(deployer, network) {

    let httpUri = deployer.networks[network].uri;
    let wsUri = '';
    if (httpUri) {
        wsUri = httpUri.replace('http', 'ws');
    }

    let accounts = [];
    let wallets = [];
    for(let address in deployer.networks[network].provider().wallets) {
        let wallet = deployer.networks[network].provider().wallets[address];
        accounts.push(wallet.getAddressString());
        wallets.push({
            account: wallet.getAddressString(),
            publicKey: wallet.getPublicKeyString(),
            privateKey: wallet.getPrivateKeyString()
        })
    };

    deployer
        .deploy(DappStateContract)
        .then(() => {
            return deployer.deploy(DappContract, DappStateContract.address);
        })
        .then(() => {
            let config = {
                httpUri: httpUri,
                wsUri: wsUri,
                dappStateContractAddress: DappStateContract.address,
                dappContractAddress: DappContract.address,
                accounts: accounts,
                wallets: wallets
///+config                
            }

            // On each deployment, a configuration file is created so dapp and API can access the latest contract code
            fs.writeFileSync(__dirname + '/../src/dapp-config.json',JSON.stringify(config, null, '\t'), 'utf8');
        });

}