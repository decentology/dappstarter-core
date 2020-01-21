import DappStateContract from '../../build/contracts/DappState.json';
import DappContract from '../../build/contracts/Dapp.json';
import Web3 from 'web3';

// Ethereum
export default class Blockchain {

    static async init(config) {
        let web3Obj = {
            http: new Web3(new Web3.providers.HttpProvider(config.http)),
            ws: new Web3(new Web3.providers.WebsocketProvider(config.ws))
        }

        let accounts = await web3Obj.http.eth.getAccounts();

        return {
            dappStateContract: new web3Obj.http.eth.Contract(DappStateContract.abi, config.dappStateContractAddress),
            dappContract: new web3Obj.http.eth.Contract(DappContract.abi, config.dappContractAddress),
            accounts: accounts
        }
    }

}