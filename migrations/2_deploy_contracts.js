const contract = artifacts.require("Dapp");
const fs = require('fs');
const ipfsConfig = require('../config/ipfsConfig.js');

module.exports = function(deployer, network) {

    deployer.deploy(contract)
    .then(() => {
        console.log(network);
        let config = {
            localhost: {
                url: 'http://localhost:7545',
                appAddress: contract.address,
                ipfs: ipfsConfig
            }
        }
        fs.writeFileSync(__dirname + '/../src/lib/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
    });
}