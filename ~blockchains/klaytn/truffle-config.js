const HDWalletProvider = require('truffle-hdwallet-provider-klaytn');
const Web3 = require('web3');

let devUrl = 'https://api.baobab.klaytn.net:8651';
let mnemonic = 'PLACEHOLDER';   ///@{ "___test-mnemonic___": "PLACEHOLDER"}
let testAccounts = null;  ///@{ "___test-accounts___": "null"}

// We want to keep accounts loaded with test Klay so we fire and forget requests to the faucet
testAccounts.map((privateKey) => {
    let account = Web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log('====== Account', account);
})

module.exports = {
  networks: {
    development: {
      url: devUrl,  // Required for DappStarter config generation
      provider: () => new HDWalletProvider(
                                      mnemonic,
                                      devUrl,           // provider url
                                      0,                // address index
                                      10,               // number of addresses
                                      true,             // share nonce
                                      `m/44'/60'/0'/0/` // wallet HD path
                                    ),
      network_id: '1001',      
      gas: '8500000',
      gasPrice: null,
    }
  },
  compilers: {
    solc: {
      version: '0.5.6'
    }
  }
};