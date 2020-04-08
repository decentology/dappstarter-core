import DappStateContract from '../../build/contracts/DappState.json';
import DappContract from '../../build/contracts/Dapp.json';
import Web3 from 'web3';

// Ethereum
export default class Blockchain {

    static async _init(config) {
        let web3Obj = {
            http: new Web3(new Web3.providers.HttpProvider(config.httpUri)),
            ws: new Web3(new Web3.providers.WebsocketProvider(config.wsUri))
        }

        let accounts = config.accounts || await web3Obj.http.eth.getAccounts();

        return {
            dappStateContract: new web3Obj.http.eth.Contract(DappStateContract.abi, config.dappStateContractAddress),
            dappContract: new web3Obj.http.eth.Contract(DappContract.abi, config.dappContractAddress),
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
        return {
            callAccount: env.params.from,
            callData: await blockchain[env.contract]
                                .methods[action](...data)
                                .send(env.params)
        }
    }

}