const TruffleConfig = require('../truffle-config.js');
const request = require('request');
const Web3 = require("web3");
const BN = require('bn.js');

let devUri = TruffleConfig.networks.development.uri;
let faucetUri = 'https://vul-faucet.vercel.app/api/getTokens';
let testAccounts = TruffleConfig.networks.development.provider().addresses;


let web3 = new Web3(new Web3.providers.HttpProvider(devUri));

// We want to keep accounts loaded with test Matic so we fire and forget requests to the faucet
testAccounts.map((account, index) => {

    web3.eth
        .getBalance(account)
        .then((result) => {
            
            let balance = new BN(String(result));
            let target = new BN('1000000000000000000');
            if (balance.lt(target)) {
                console.log(`Faucet request for (${index}) ${account} (Current Balance: ${balance.toString()})`);
                setTimeout(() => {
                    request.post(
                        faucetUri,
                        {
                        json: {
                            address: account
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
                }, 1000);
            } else {
                console.log(`Current Balance  ${account}: ${balance.toString()})`);
                if (index === testAccounts.length - 1) {
                    process.exit(0);
                }            
            }       
    });
});
