const HDWalletProvider = require("@truffle/hdwallet-provider")

let devUrl = 'http://127.0.0.1:7545/';
let testAccounts = null;  ///@{ "___test-accounts___": "null"}

module.exports = {
  networks: {
    development: {
      url: devUrl,
      provider: function() {
        return new HDWalletProvider(
                                      testAccounts,
                                      devUrl,           // provider url
                                      0,                // address index
                                      25,               // number of addresses
                                      true,             // share nonce
                                      `m/44'/60'/0'/0/` // wallet HD path
                                    );
      },
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: "^0.5.11"
    }
  }
};