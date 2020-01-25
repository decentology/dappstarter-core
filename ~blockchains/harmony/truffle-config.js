const { TruffleProvider } = require('@harmony-js/core');

let devUrl = 'https://api.s0.b.hmny.io/';
let mnemonic = 'urge clog right example dish drill card maximum mix bachelor section select';

module.exports = {

    networks: {
        development: {
            network_id: '2',
            provider: () => {
                const truffleProvider = new TruffleProvider(
                    devUrl, {
                        memonic: mnemonic
                    }, {
                        shardID: 0,
                        chainId: 2,
                        chainType: 'eth'
                    }, {
                        gasLimit: 3321900,
                        gasPrice: 1000000000
                    }
                );
                const newAcc = truffleProvider.addByPrivateKey('01f903ce0c960ff3a9e68e80ff5ffc344358d80ce1c221c3f9711af07f83a3bd');
                truffleProvider.setSigner(newAcc);
                return truffleProvider;
            }
        }
    },
    compilers: {
        solc: {
            version: '^0.5.11'
        }
    }
};
