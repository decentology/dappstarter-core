require('@babel/register');
({
    ignore: /node_modules/
});
require('@babel/polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider');

let mnemonic = 'PLACEHOLDER'; ///@{ "___test-mnemonic___": "PLACEHOLDER"}
let testAccounts = null; ///@{ "___test-accounts___": "null"}
let devUri = 'http://127.0.0.1:7545/';

module.exports = {
    networks: {
        development: {
            uri: devUri,
            provider: () => new HDWalletProvider(
                testAccounts,
                devUri, // provider url
                0, // address index
                10, // number of addresses
                true, // share nonce
                `m/44'/889'/0'/0/` // wallet HD path
            ),
            network_id: '*'
        },
        tomotestnet: {
            uri: "https://testnet.tomochain.com",
            provider: () => new HDWalletProvider(
                testAccounts,
                "https://testnet.tomochain.com", 
                0, // address index
                10, // number of addresses
                true, // share nonce
                `m/44'/889'/0'/0/` // wallet HD path
            ),
            network_id: '89',
            gas: 2000000,
            gasPrice: 10000000000000
        }
    },
    compilers: {
        solc: {
            version: '^0.5.11'
        }
    }
};
