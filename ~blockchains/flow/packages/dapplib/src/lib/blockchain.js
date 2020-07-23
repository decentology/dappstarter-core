const { Flow } = require('./flow');
const t = require('@onflow/types');

const CONTRACT = 'access(all) contract Noop {}';


module.exports = class Blockchain {

    /**
     * @dev Calls a read-only smart contract function
     */
    static async get(env, tx, data) {
        let params = [
            { name: 'contractName', type: t.String, value: env.config.dappStateContract.name },
            { name: 'contractOwner', type: t.String, value: '0x' + env.config.dappStateContract.owner },
        ]
        for(let key in data) {
            params.push({
                name: key, 
                type: t.String, 
                value: data[key]
            });
        }
        let options = {
            params
        }

        let flow = new Flow(env.config);
        let response = await flow.executeTransaction(tx, options);
        let resultData = await Flow.decode(response);
        return {
            callAccount: null,
            callData: resultData
        }
    }

    /**
     * @dev Calls a writeable smart contract function
     */
    static async post(env, tx, data) {
        let proposer = typeof env.params.proposer === 'string' ? env.params.proposer : env.config.accounts[0];
        let roleInfo = {
            [Flow.Roles.PROPOSER]: proposer,
            [Flow.Roles.AUTHORIZERS]: env.params.authorizers && Array.isArray(env.params.authorizers) && env.params.authorizers.length > 0 ?
                                                env.params.authorizers : [ proposer ],
            [Flow.Roles.PAYER]: typeof env.params.payer === 'string' ? env.params.payer : proposer
        };
        let params = [
            { name: 'contractName', type: t.String, value: env.config.dappStateContract.name },
            { name: 'contractOwner', type: t.String, value: '0x' + env.config.dappStateContract.owner },
        ]
        for(let key in data) {
            params.push({
                name: key, 
                type: t.String, 
                value: data[key]
            });
        }
        let options = {
            roleInfo,
            params,
            gasLimit: 50
        }

        let flow = new Flow(env.config);
        let response = await flow.executeTransaction(tx, options);

        return {
            callAccount: proposer,
            callData: response
        }
    } 

    static async handleEvent(env, event, callback) {
        Flow.handleEvent(env, event, callback);
    } 

    static async createAccount(env, keyInfo) {
        /*  keyInfo : { entropy: byte array, weight: 1 ... 1000 }  */        
        let flow = new Flow(env);
        return await flow.createAccount(keyInfo);
    }

    static async deployContract(env, address, contract) {

        let flow = new Flow(env);
        return await flow.deployContract(address, contract);
    }

    static async getAccount(env, address) {
        let flow = new Flow(env);
        return await flow.getAccount(address);
    }

}
