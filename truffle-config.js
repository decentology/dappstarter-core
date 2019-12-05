var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "pottery movie angle day assault faculty banana rural lyrics hammer believe learn";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 50);
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