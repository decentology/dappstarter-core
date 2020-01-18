import DappStateContract from '../../build/contracts/DappState.json';
import DappContract from '../../build/contracts/Dapp.json';
import Config from '../dapp-config.json';
import Web3 from 'web3';

// Ethereum
export default class Blockchain {

    static init() {
        let web3Obj = {
            http: new Web3(new Web3.providers.HttpProvider(Config.http)),
            ws: new Web3(new Web3.providers.WebsocketProvider(Config.ws))
        }

        return new Promise((resolve, reject) => {
            web3Obj.http.eth.getAccounts((error, accounts) => {
                if (error) {
                    return reject(error);
                } else {
                    resolve({
                        dappStateContract: new web3Obj.http.eth.Contract(DappStateContract.abi, Config.dappStateContractAddress),
                        dappContract: new web3Obj.http.eth.Contract(DappContract.abi, Config.dappContractAddress),
                        accounts: accounts
                    });

                }
            })
        });
    }

    static async get(contract, action, account, ...data) {
        let blockchain = await Blockchain.init();
        let options = Object.assign({}, {
            from: typeof account === 'string' ? account : blockchain.accounts[account]
        });
        return await blockchain[contract].methods[action](...data).call(options);
    }

    static async post(contract, action, account, ...data) {
        let blockchain = await Blockchain.init();
        let options = Object.assign({}, {
            from: typeof account === 'string' ? account : blockchain.accounts[account]
        });
        return await blockchain[contract].methods[action](...data).send(options);
    }
}