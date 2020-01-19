import DappStateContract from '../../build/contracts/DappState.json';
import DappContract from '../../build/contracts/Dapp.json';
import Config from '../dapp-config.json';
import Web3 from 'web3';

// Klaytn
export default class Blockchain {

    static init() {
        let web3Obj = {
            http: new Web3(new Web3.providers.HttpProvider(Config.http)),
            ws: new Web3(new Web3.providers.WebsocketProvider(Config.ws))
        }

        return new Promise((resolve, reject) => {
            console.log(web3Obj);
            web3Obj.http.eth.getAccounts((error, accounts) => {
                console.log('Blockchain init accounts', accounts)
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

}