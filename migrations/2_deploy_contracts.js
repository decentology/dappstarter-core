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
            localhost: {
                url: 'http://localhost:7545',
                dappStateContractAddress: DappStateContract.address,
                dappContractAddress: DappContract.address
            }
        }
        fs.writeFileSync(__dirname + '/../src/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
    });
}