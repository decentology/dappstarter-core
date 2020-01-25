import DappStateContract from '../../build/contracts/DappState.json';
import DappContract from '../../build/contracts/Dapp.json';

import { Harmony } from '@harmony-js/core';

export default class Blockchain {
    // Harmony

    static async _init(config) {
        
        // Much of these values are hard-coded until Harmony SDK is finalized
        let harmony = new Harmony('https://api.s0.b.hmny.io/', { chainId: 2, chainType: 'hmy', shardID: 0});
        harmony.messenger.setNetworkID('2');
        let wallet = harmony.wallet.addByPrivateKey('01f903ce0c960ff3a9e68e80ff5ffc344358d80ce1c221c3f9711af07f83a3bd');

        let retVal = {
            dappStateContract: harmony.contracts.createContract(DappStateContract.abi, config.dappStateContractAddress),
            dappContract: harmony.contracts.createContract(DappContract.abi, config.dappContractAddress),
            accounts: [ wallet.address ]
        }

        retVal.dappStateContract.wallet = wallet;
        retVal.dappContract.wallet = wallet;

        return retVal;
    }


    /**
     * @dev Calls a read-only smart contract function
     */
    static async get(env, action, ...data) {
        let blockchain = await Blockchain._init(env.config);
        env.params.from = typeof env.params.from === 'string' ? env.params.from : blockchain.accounts[0];

        // Hard-coded since they are not implemented in Harmony SDK
        env.params.gasLimit = 3321900;
        env.params.gasPrice = 1000000000;

        return {
            callAccount: env.params.from,
            callData: await blockchain[env.contract]
                                .methods[action](...data)
                                .call(env.params)
        }
    }

    /**
     * @dev Calls a writeable smart contract function
     */
    static async post(env, action, ...data) {
        let blockchain = await Blockchain._init(env.config);
        env.params.from = typeof env.params.from === 'string' ? env.params.from : blockchain.accounts[0];

        // Hard-coded since they are not implemented in Harmony SDK
        env.params.gasLimit = 3321900;
        env.params.gasPrice = 1000000000;
        
        let retVal = {
            callAccount: env.params.from,
            callData: await blockchain[env.contract]
                .methods[action](...data)
                .send(env.params)
        }
        return retVal;
    }
}