const TruffleConfig = require('../../truffle-config.js');
const request = require('request');
const { Conflux, format, address } = require('js-conflux-sdk');
const BN = require('bn.js');

let faucetUri = 'http://test-faucet.conflux-chain.org:18088/dev/ask?address=';
let testAccounts = TruffleConfig.networks.development.walletProvider().addresses;
let conflux = new Conflux({ url: TruffleConfig.networks.development.uri, networkId: 1 });

if (process.argv.length > 2) {
    testAccounts = testAccounts.slice(0, parseInt(process.argv[2]));
}

testAccounts.map(async (account, index) => {

    let accountInfo = await conflux.getAccount(account);
    let hexAddress = format.hex(address.decodeCfxAddress(account).hexAddress);

    console.log(`Faucet request for (${index}) ${account} (Current Balance: ${accountInfo.balance.toString()})`);
    setTimeout(() => {
        request.get(`${faucetUri}${hexAddress}`, (error, res, body) => {
            let bodyInfo = body ? JSON.parse(body) : { message: '' };
            if (error) {
                console.log('Error requesting funds');
            } else if (bodyInfo.message && (typeof bodyInfo.message == 'string') && (bodyInfo.message.toLowerCase().indexOf('error') > -1)) {
                console.log(`(${index}) ${bodyInfo.message}`);
            }
            if (index === testAccounts.length - 1) {
                process.exit(0);                
            }
        })
    }, 5000);
});
