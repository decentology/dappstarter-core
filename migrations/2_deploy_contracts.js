const DappMainContract = artifacts.require("DappMain");
const DappContract = artifacts.require("Dapp");
const fs = require('fs');

module.exports = function(deployer, network) {

    deployer
    .deploy(DappMainContract)
    .then(() => {
        return deployer.deploy(DappContract, DappMainContract.address);
    })
    .then(() => {
        let config = {
            localhost: {
                url: 'http://localhost:7545',
                dappMainContractAddress: DappMainContract.address,
                dappContractAddress: DappContract.address
            }
        }
        fs.writeFileSync(__dirname + '/../src/contract.json',JSON.stringify(config, null, '\t'), 'utf-8');
    });
}