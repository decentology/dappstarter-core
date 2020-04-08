const TruffleConfig = require('../../truffle-config.js');
const request = require('request');
const Caver = require('caver-js');
const BN = require('bn.js');

let devUri = TruffleConfig.networks.development.uri;
let faucetUri = 'https://api-baobab.wallet.klaytn.com/faucet/run';
let testAccounts = TruffleConfig.networks.development.provider().addresses;

// Scope: https://baobab.scope.klaytn.com

let caver = new Caver(devUri);

// We want to keep accounts loaded with test Klay so we fire and forget requests to the faucet
testAccounts.map((account, index) => {
    caver.klay
        .getBalance(account)
        .then((result) => {
            
            let balance = new BN(String(result));
            let target = new BN('12000000000000000000');
            if (balance.lt(target)) {
                console.log(`Faucet request for ${account}`);
                request.post(`${faucetUri}?address=${account}`, (error, res, body) => {
                    if (error) {
                        console.error(error);
                    }
                    console.log(`${account} statusCode ${index}: ${res.statusCode}`);
                    if (index === testAccounts.length - 1) {
                        process.exit(0);
                    }
                })
            } else {
                if (index === testAccounts.length - 1) {
                    process.exit(0);
                }            
            }       
    });
});
