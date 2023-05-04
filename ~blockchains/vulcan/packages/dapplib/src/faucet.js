const TruffleConfig = require('../truffle-config.js');
const request = require('request');
const Web3 = require("web3");
const BN = require('bn.js');

let devUri = TruffleConfig.networks.development.uri;
let faucetUri = 'https://vul-faucet.vercel.app/api/getTokens';
let testAccounts = TruffleConfig.networks.development.provider().addresses;
request.post(
    faucetUri,
    {
    json: {
        address: testAccounts
    },
    }, (error, res, body) => {
    if (error) {
        console.error(error);
    }
    //console.log(`${account} statusCode ${index}: ${res.statusCode}`);
    if (index === testAccounts.length - 1) {
        process.exit(0);
        
    }
})