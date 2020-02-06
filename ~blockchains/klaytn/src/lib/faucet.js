const TruffleConfig = require('../../truffle-config.js');
const Web3 = require('web3');

// We want to keep accounts loaded with test Klay so we fire and forget requests to the faucet
TruffleConfig.testAccounts.map((privateKey) => {
    let account = Web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log('====== Account', account);
})
