const DappStateContract = require("../../build/contracts/DappState.json");
const DappContract = require("../../build/contracts/Dapp.json");
const Web3 = require("web3");
const Caver = require('caver-js');

// Ethereum
module.exports = class Blockchain {

    static async _init(config) {
        let caverObj = {
            http: new Caver(new Caver.providers.HttpProvider(config.httpUri)),
            ws: new Caver(new Caver.providers.WebsocketProvider(config.wsUri))
        }
        
        let accounts = config.accounts || await caverObj.http.klay.getAccounts();
        return {
            dappStateContract: new caverObj.http.klay.Contract(DappStateContract.abi, config.dappStateContractAddress),
            dappContract: new caverObj.http.klay.Contract(DappContract.abi, config.dappContractAddress),
            accounts: accounts
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
        env.params.value = 0;
        env.params.gas = 25000000000;
        return {
            callAccount: env.params.from,
            callData: await blockchain[env.contract]
                                .methods[action](...data)
                                .send(env.params)
        }
    }

    static async handleEvent(env, event, callback) {
        //TODO
        return;
        let blockchain = await Blockchain._init(env.config);
        env.params.fromBlock = typeof env.params.fromBlock === 'number' ? env.params.fromBlock : blockchain.lastBlock + 1;
        if (blockchain[env.contract].events[event]) {
            blockchain[env.contract].events[event](env.params, (error, result) => {
                let eventInfo = Object.assign({
                                                id: result.id,
                                                blockNumber: result.blockNumber
                                            }, result.returnValues);

                callback(error, eventInfo);
            });
        } else {
            throw(`Contract "${env.contract}" does not contain event "${event}"`);
        }
    }

}