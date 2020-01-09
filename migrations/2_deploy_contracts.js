const DappStateContract = artifacts.require("DappState");
const DappContract = artifacts.require("Dapp");
const fs = require('fs');

module.exports = function(deployer, network) {

    deployer
    .deploy(DappStateContract)
    .then(() => {
        return deployer.deploy(DappContract, DappStateContract.address);
    })
    .then(() => {
        let config = {
            http: deployer.networks[network].url,
            ws: deployer.networks[network].url.replace('http', 'ws'),
            dappStateContractAddress: DappStateContract.address,
            dappContractAddress: DappContract.address,
            ipfs: {
                host: 'ipfs.infura.io',
                protocol: 'https',
                port: 5001
            }
        }

        // On each deployment, a configuration file is created so dapp and API can access the latest contract code
        fs.writeFileSync(__dirname + '/../src/dapp-config.json',JSON.stringify(config, null, '\t'), 'utf-8');
    });

}