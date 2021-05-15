const DappStateContract = require("../build/contracts/DappState.json");
const DappContract = require("../build/contracts/Dapp.json");
const Web3 = require("web3");
const Transaction = require('@ethereumjs/tx').Transaction;
const Common = require('@ethereumjs/common');

// Ethereum
module.exports = class Blockchain {

    static async _init(config) {
        let web3Obj = {
            http: new Web3(new Web3.providers.HttpProvider(config.httpUri)),
            ws: new Web3(new Web3.providers.WebsocketProvider(config.wsUri))
        }

        let accounts = config.accounts || await web3Obj.http.eth.getAccounts();

        return {
            dappStateContract: new web3Obj.http.eth.Contract(DappStateContract.abi, config.dappStateContractAddress),
            dappContract: new web3Obj.http.eth.Contract(DappContract.abi, config.dappContractAddress),
            dappStateContractWs: new web3Obj.ws.eth.Contract(DappStateContract.abi, config.dappStateContractAddress),
            dappContractWs: new web3Obj.ws.eth.Contract(DappContract.abi, config.dappContractAddress),
            accounts: accounts,
            wallets: config.wallets,
            gas: config.gas,
            gasPrice: config.gasPrice,
            chainId: config.chainId,
            lastBlock: await web3Obj.http.eth.getBlockNumber(),
            web3: web3Obj
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
        let method = blockchain[env.contract].methods[action](...data);

        let from = typeof env.params.from === 'string' ? env.params.from : blockchain.accounts[0];
        let wallet = blockchain.wallets.find((wallet) => wallet.account === from);
        if (wallet) {
            let txCount = await blockchain.web3.http.eth.getTransactionCount(from);
            const customCommon = Common.default.forCustomChain(
                'mainnet', // Only known Ethereum network names are supported
                {
                  networkId: 1,
                  chainId: blockchain.chainId,
                }
            );

            let txParams = {
                from,
                to: env.config[`${env.contract}Address`],
                data: method.encodeABI(),
                gasLimit: blockchain.web3.http.utils.toHex(blockchain.gas),
                gasPrice: blockchain.web3.http.utils.toHex(blockchain.gasPrice),
                nonce: blockchain.web3.http.utils.toHex(txCount)
            }

            let tx = Transaction.fromTxData(txParams, {common: customCommon});
            let privateKeyBytes = Uint8Array.from(Web3.utils.hexToBytes(wallet.privateKey));
            let signedTx = tx.sign(privateKeyBytes);
            let serializedTx = signedTx.serialize().toString('hex');

            try {
                let receipt = await blockchain.web3.http.eth.sendSignedTransaction(`0x${serializedTx}`);    
                return {
                    callAccount: env.params.from,
                    callData: receipt
                }
            } catch(e) {
                console.log(e);
                throw e.message;
            }    
        }
    }

    static async handleEvent(env, event, callback) {
        let blockchain = await Blockchain._init(env.config);
        env.params.fromBlock = typeof env.params.fromBlock === 'number' ? env.params.fromBlock : blockchain.lastBlock + 1;
        console.log(blockchain, env);
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