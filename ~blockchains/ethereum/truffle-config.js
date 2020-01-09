var HDWalletProvider = require("truffle-hdwallet-provider");

let devUrl = 'http://127.0.0.1:7545/';

module.exports = {
  networks: {
    development: {
      url: devUrl,
      provider: function() {
        return new HDWalletProvider(
                                      'pottery movie angle day assault faculty banana rural lyrics hammer believe learn', 
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