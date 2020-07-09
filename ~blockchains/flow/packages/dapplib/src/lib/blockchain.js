const Flow = require('./flow');
const CONTRACT = 'access(all) contract Noop {}';


module.exports = class Blockchain {

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
