var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "pottery movie angle day assault faculty banana rural lyrics hammer believe learn";

module.exports = {
///(ethereum
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 15);
      },
      network_id: '*'
    }
  },
///)
///(harmony
  networks: {
    test: {}
  },
///)
  compilers: {
    solc: {
      version: "^0.5.11"
    }
  }
};