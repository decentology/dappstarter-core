const TruffleConfig = require('../truffle-config.js');
const request = require('request');
const Web3 = require("web3");
const BN = require('bn.js');

let devUri = TruffleConfig.networks.development.uri;
let faucetUri = 'https://faucet.avax-test.network/api/token_custom';
let testAccounts = TruffleConfig.networks.development.provider().addresses;

if (process.argv.length > 2) {
    testAccounts = testAccounts.slice(0, parseInt(process.argv[2]));
}

let web3 = new Web3(new Web3.providers.HttpProvider(devUri));

// We want to keep accounts loaded with test tokens so we fire and forget requests to the faucet
testAccounts.map((account, index) => {
    
    web3.eth
        .getBalance(account)
        .then((result) => {
            console.log(index, account, result)
            let balance = new BN(String(result));
            let target = new BN('10000000000');
            if (balance.lt(target)) {
                console.log(`Faucet request for (${index}) ${account} (Current Balance: ${balance.toString()})`);
                setTimeout(() => {
                    request.post(
                        faucetUri,
                        {
                            json: {
                                key: "3XT9XY8-AM4MBW8-NRB8RSX-H3HG2QJ",
                                to: account,
                                amount: 10000000000
                            },
                        }, (error, res, body) => {
                            console.log(error, res, body)
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
                if (index === testAccounts.length - 1) {
                    process.exit(0);
                }            
            }       
    });
});
