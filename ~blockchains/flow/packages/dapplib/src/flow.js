
const SHA3 = require('sha3').SHA3;
const EC = require('elliptic').ec;
const ec = new EC("p256")
const rlp = require('rlp');
const fcl = require('@onflow/fcl');
const t = require('@onflow/types');

class Flow {

    static get Roles() {
        return {
            'PROPOSER': 'proposer',
            'AUTHORIZER': 'authorizer',
            'AUTHORIZERS': 'authorizers',
            'PAYER': 'payer',
            'ALL': 'all',
        }
    }

    /**
      config {
      httpUri: "...",
       serviceWallet: {
            "address": "...",
            "keys": [
                {
                "publicKey": "...",
                "privateKey": "...",
                "keyId": 0,
                "weight": 1000
                }  
            ]
       }
     } 
     */
    constructor(config) {
        this.serviceUri = config.httpUri;
        this.serviceWallet = config.serviceWallet;
    }

    /* API */
    /**
      keyInfo { 
          entropy: byte array, 
          weight: 1 ... 1000 
      }
    */
    async createAccount(keyInfo) {
        /*
           
        */

        let publicKeys = [];
        keyInfo.forEach((key) => {
            publicKeys.push({
                ...key,
                ...Flow._genKeyPair(key.entropy, key.weight)
            });
        });

        // Transaction code
        let tx = fcl.transaction`
                            transaction(publicKeys: [String]) {
                                prepare(signer: AuthAccount) {
                                    let acct = AuthAccount(payer: signer)
                                    for key in publicKeys {
                                        acct.addPublicKey(key.decodeHex())
                                    }
                                }
                            }`;

        // Transaction options
        // roleInfo can either be:
        // { [Flow.Roles.ALL]: xxxxxx }  
        // - OR - 
        // { [Flow.Roles.PROPOSER]: xxxxxx,  [Flow.Roles.AUTHORIZATIONS]: [ xxxxxx ],  [Flow.Roles.PAYER]: xxxxxx,}
        let options = {
            roleInfo: { [Flow.Roles.ALL]: this.serviceWallet.address },
            args: [{ type: t.Array(t.String), value: publicKeys.map(o => o.encodedPublicKey) }],
            gasLimit: 300
        }

        // Use fcl to compose and submit the transaction
        let result = await this.executeTransaction(tx, options);

        // Get the new account info and pass it back
        const accountCreatedEvent = result.events.find(d => d.type === "flow.AccountCreated")

        let addr = accountCreatedEvent.data.address.replace(/^0x/, '');
        const account = await this.getAccount(addr);

        let newAccount = {
            address: account.address,
            keys: []
        };

        publicKeys.map((k) => {
            let key = account.keys.find(d => d.publicKey === k.publicKey);
            newAccount.keys.push({
                publicKey: k.publicKey,
                privateKey: k.privateKey,
                keyId: key.index,
                weight: k.weight
            });
        });

        return newAccount;
    }



    async deployContract(address, name, contract) {

        let self = this;

        // Transaction code
        let tx = fcl.transaction`
                                    transaction(name: String, code: String) {
                                        prepare(acct: AuthAccount) {
                                            let contract: DeployedContract? = acct.contracts.get(name: name)
                                            if (contract == nil) {
                                                acct.contracts.add(name: name, code: code.decodeHex())
                                            } else {
                                                acct.contracts.update__experimental(name: name, code: code.decodeHex())
                                            }
                                        }
                                    }
                                    `;
        // Transaction options
        let options = {
            roleInfo: { [Flow.Roles.ALL]: address },
            //roleInfo: { [Flow.Roles.ALL]: address},
            args: [{ value: name, type: t.String }, { value: Buffer.from(contract, "utf8").toString("hex"), type: t.String }],
            gasLimit: 300
        }

        let result = await this.executeTransaction(tx, options);
        const contractEvent = result.events.find(d => d.type === "flow.AccountContractAdded" || d.type === "flow.AccountContractUpdated");
        if (contractEvent && contractEvent.data) {
            return contractEvent.data.address;
        } else {
            console.log('Contract not deployed');
            return null;
        }
    }

    /* INTERACTIONS */

    async getAccount(address) {
        let accountInfo = await fcl.send([fcl.getAccount(address)], { node: this.serviceUri });
        // Changed to indexOf instead of comparison because fcl returns 0x prefixed address
        // when previously it didn't have the prefix
        if (accountInfo.account.address.indexOf(address) < 0) {
            throw new Error(`Account 0x${address} does not exist`);
        }
        return accountInfo.account;
    }

    async executeTransaction(tx, options) {
        if (options.decode === true) {
            let resultData = await this._processTransaction(tx, options);
            return fcl.decode(resultData);
        } else {
            let response = await this._processTransaction(tx, options);
            let { events } = await fcl.tx(response).onceSealed();
            return {
                response,
                events
            }
        }
    }

    // Substitute import placeholder with all known deployed contract addresses
    static replaceImportRefs(code, deployedContracts, prefix) {
        const NEWLINE = '\n';
        prefix = prefix ? prefix : '';
        let codeLines = code.split(NEWLINE);
        let updatedCode = '';
        codeLines.forEach((line) => {
            let tokens = line.trim().split(' ');
            if (tokens[0] === 'import') {
                let contractRef = tokens[tokens.length - 1];
                if (deployedContracts[contractRef]) {
                    updatedCode += prefix + line.replace(contractRef, deployedContracts[contractRef]) + NEWLINE;
                } else {
                    throw `Missing contract address for ${contractRef}. Perhaps it wasn't deployed?`;
                }
            } else {
                updatedCode += prefix + line + NEWLINE;
            }
        });

        return updatedCode;
    }

    static async handleEvent(env, eventType, callback) {

        // const blockResponse = await sdk.send(await sdk.build([
        //     sdk.getLatestBlock()
        //   ]), { node: env.config.httpUri });

        // const response = await sdk.send(await sdk.build([
        // sdk.getEvents(eventType, blockResponse.latestBlock.parentId, blockResponse.latestBlock.id),
        // ]), { node: env.config.httpUri });

        // callback(response);
    }

    /* HELPERS */

    static _genKeyPair(entropy, weight) {
        const keys = ec.genKeyPair({
            entropy
        })
        const privateKey = keys.getPrivate("hex")
        const publicKey = keys.getPublic("hex").replace(/^04/, "")
        return {
            publicKey,
            privateKey,
            // Require rlp encoded value of publicKey that encodes the key itself, 
            // what curve it uses, how the signed values are hashed and the keys weight.
            encodedPublicKey: rlp.encode([
                Buffer.from(publicKey, "hex"), // publicKey hex to binary
                2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
                3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
                weight
            ]).toString("hex")
        }
    }


    /*
        roleInfo 
        {
            [PROPOSER]: address,
            [AUTHORIZERS]: [ address ],
            [PAYER]: address
        }
    */
    async _processTransaction(tx, options) {

        options = options || {};

        let builders = [];

        let debug = null;
        // BUILD INTERACTION

        // Add the actual interaction code
        builders.push(tx);

        // If there are any params, add those here
        if (options.params && Array.isArray(options.params)) {
            let params = [];
            options.params.forEach((param) => {
                params.push(fcl.param(param.value, param.type, param.name));
            });
            builders.push(fcl.params(params));
        }

        // If there are any args, add those here
        if (options.args && Array.isArray(options.args)) {
            let args = [];
            options.args.forEach((arg) => {
                args.push(fcl.arg(arg.value, arg.type));
            });
            builders.push(fcl.args(args));
        }

        if (options.gasLimit && options.gasLimit > 0) {
            builders.push(fcl.limit(options.gasLimit));
        }
        // If the transaction is going to change state, it will require roleInfo to be populated
        if (options.roleInfo) {

            let signer = new Signer(this.serviceWallet);
            let roles = options.roleInfo;

            // The Proposer authorization is the only one that requires a sequenceNumber
            // This block does double-duty...for Proposer and the scenario in which
            // Proposer, Authorizer, Payer are all the same i.e. Flow.Roles.ALL
            if (roles[Flow.Roles.PROPOSER] || roles[Flow.Roles.ALL]) {
                let address = roles[Flow.Roles.PROPOSER] || roles[Flow.Roles.ALL];
                let account = await this.getAccount(address);
                builders.push(fcl.proposer(await signer.authorize(account)));

                if (roles[Flow.Roles.ALL]) {
                    builders.push(fcl.authorizations([await signer.authorize(account)]));
                    builders.push(fcl.payer(await signer.authorize(account)));
                }
            }
            // A transaction can have multiple Authorizers. 
            // Loop through and create an authorization object for each one
            if (roles[Flow.Roles.AUTHORIZERS] && Array.isArray(roles[Flow.Roles.AUTHORIZERS])) {
                let authorizations = [];
                for (let a = 0; a < roles[Flow.Roles.AUTHORIZERS].length; a++) {
                    let address = roles[Flow.Roles.AUTHORIZERS][a];
                    let account = await this.getAccount(address);
                    let authorization = await signer.authorize(account);
                    authorizations.push(authorization);
                }
                if (authorizations.length > 0) {
                    builders.push(fcl.authorizations(authorizations));
                }
            }

            // Finally, add the Payer authorization
            if (roles[Flow.Roles.PAYER]) {
                let address = roles[Flow.Roles.PAYER];
                let account = await this.getAccount(address);
                builders.push(fcl.payer(await signer.authorize(account)));

            }
        }
        fcl.config().put("accessNode.api", this.serviceUri);


        // try {
        //     const response = await fcl.serialize(builders);
        //     console.log(JSON.stringify(JSON.parse(response), null, 2))

        // }
        // catch (e) {
        //     console.log(e)
        // }

        // SEND TRANSACTION TO BLOCKCHAIN

        return await fcl.send(builders, { node: this.serviceUri });

    }

    static getEntropy() {
        let entropy = [];
        for (let e = 0; e < 24; e++) {
            // Minimum 24 bytes needed for entropy
            entropy.push(Math.floor(Math.random() * 254)); // This is totally contrived for test account generation
        }
        return entropy;
    }

}

class Signer {

    constructor(serviceWallet) {
        this.serviceWallet = serviceWallet;
    }

    async _getAuthorizingKey(address) {
        let dappConfig;
        try {
            //delete require.cache[require.resolve('../dapp-config.json')];
            dappConfig = require('./dapp-config.json');
        } catch (e) {
            dappConfig = {
                wallets: [this.serviceWallet]
            }
        }

        let selectedKey = 0; // TODO: This could be different
        let wallet = null
        if (address == this.serviceWallet.address) {
            wallet = this.serviceWallet
        } else {
            wallet = dappConfig.wallets.find(o => address.indexOf(o.address) > -1);
        }

        let key = wallet.keys.find(k => k.keyId === selectedKey);

        return {
            privateKey: key.privateKey,
            keyId: key.keyId
        }
    }

    async authorize(accountInfo) {
        let { privateKey, keyId } = await this._getAuthorizingKey(accountInfo.address);

        return (account = {}) => {

            // This function is passed as a param for each authorization requested
            // Use currying to ensure that "account" is correctly hydrated for each
            // authorization for which signingFunction is called
            const __signingFunction = data => {
                console.log(`\n    ✍️   Signing for account ${accountInfo.address}\n`)
                return {
                    tempId: accountInfo.address,
                    addr: fcl.sansPrefix(accountInfo.address),
                    keyId: keyId,
                    signature: Signer.signMessage(privateKey, data.message)
                }
            }

            let retVal = {
                ...account,
                tempId: accountInfo.address,
                addr: fcl.sansPrefix(accountInfo.address),
                keyId: keyId,
                //                sequenceNum: accountInfo.keys[keyId].sequenceNumber,
                signature: account.signature || null,
                signingFunction: __signingFunction
            }

            return retVal;
        }
    }

    static signMessage(privateKey, message) {
        const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
        const sha = new SHA3(256);
        sha.update(Buffer.from(message, "hex"));
        const digest = sha.digest();
        const sig = key.sign(digest);
        const n = 32; // half of signature length?
        const r = sig.r.toArrayLike(Buffer, "be", n);
        const s = sig.s.toArrayLike(Buffer, "be", n);
        return Buffer.concat([r, s]).toString("hex")
    }

}

module.exports = {
    Flow: Flow,
    Signer: Signer
}