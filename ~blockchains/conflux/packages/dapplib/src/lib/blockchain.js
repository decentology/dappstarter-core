const DappStateContract = require("../../build/contracts/DappState.json");
const DappContract = require("../../build/contracts/Dapp.json");
const { Conflux } = require('js-conflux-sdk');

module.exports = class Blockchain {

    static async _init(config) {
        let networkId = 1;
        let conflux = {
            http: new Conflux({ 
                url: config.httpUri,
                networkId,
            }),
            ws: new Conflux({ 
                url: config.wsUri,
                networkId,
            })
        }

        return {
            dappStateContract: conflux.http.Contract({ abi: DappStateContract.abi, address: config.dappStateContractAddress }),
            dappContract: conflux.http.Contract({ abi: DappContract.abi, address: config.dappContractAddress }),
            dappStateContractWs: conflux.ws.Contract({ abi: DappStateContract.abi, address: config.dappStateContractAddress }),
            dappContractWs: conflux.ws.Contract({ abi: DappContract.abi, address: config.dappContractAddress }),
            accounts: config.accounts,
            wallets: config.wallets,
            lastBlock: 'latest_mined', //await conflux.http.getEpochNumber()
            networkId,
            instance: conflux
        }
    }

    /**
     * @dev Calls a read-only smart contract function
     */
    static async get(env, action, ...data) {
        let blockchain = await Blockchain._init(env.config);
        env.params.from = typeof env.params.from === 'string' ? env.params.from : blockchain.accounts[0];
        return {
            callAccount: env.params.from,
            callData: await blockchain[env.contract][action](...data)
                                .call(env.params)
        }
    }

    /**
     * @dev Calls a writeable smart contract function
     */
    static async post(env, action, ...data) {
        let blockchain = await Blockchain._init(env.config);
        env.params.from = typeof env.params.from === 'string' ? env.params.from : blockchain.accounts[0];
        let wallet = blockchain.wallets.find((wallet) => wallet.account === env.params.from);
        if (wallet) {
            env.params.from = blockchain.instance.http.wallet.addPrivateKey(wallet.privateKey);
        } else {
            env.params.from = null;
        } 
        return {
            callAccount: env.params.from,
            callData: await blockchain[env.contract][action](...data)
                                .sendTransaction(env.params)
                                .executed()
        }
    }

    static async handleEvent(env, event, callback) {
        // Disabled for Conflux beta

        // let blockchain = await Blockchain._init(env.config);
        // env.params.fromBlock = typeof env.params.fromBlock === 'number' ? env.params.fromBlock : blockchain.lastBlock + 1;
        // if (blockchain[env.contract].events[event]) {
        //     blockchain[env.contract].events[event](env.params, (error, result) => {
        //         let eventInfo = Object.assign({
        //                                         id: result.id,
        //                                         blockNumber: result.blockNumber
        //                                     }, result.returnValues);

        //         callback(error, eventInfo);
        //     });
        // } else {
        //     throw(`Contract "${env.contract}" does not contain event "${event}"`);
        // }
    }

}