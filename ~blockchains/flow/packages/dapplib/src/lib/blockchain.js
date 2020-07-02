
const fcl = require('@onflow/fcl');
const t = require('@onflow/types');
const rlp = require('rlp');
const EC = require('elliptic').ec;
const ec = new EC("p256")
const SHA3 = require('sha3').SHA3;
const SERVICE_ACCOUNT = 'f8d6e0586b0a20c7';
const SERVICE_ACCOUNT_PRIVATE_KEY = 'f06d20b6336d365a3347cc1b2897a9c3ce4b18689e6ea34f9e6975718dea5da9';
const CONTRACT = 'access(all) contract Noop {}';

module.exports = class Blockchain {


    static async _init(config) {
        let accounts = config.accounts;

        return {
            dappStateContract: '',
            accounts: accounts,
            lastBlock: 0
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

    static async handleEvent(env, event, callback) {
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


    async getAccount(addr) {
        const { account } = await fcl.send([fcl.getAccount(addr)])
        return account
    }

    hashMsgHex(msgHex) {
        const sha = new SHA3(256)
        sha.update(Buffer.from(msgHex, "hex"))
        return sha.digest()
    }

    signWithKey(privateKey, msgHex) {
        const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
        const sig = key.sign(this.hashMsgHex(msgHex))
        const n = 32 // half of signature length?
        const r = sig.r.toArrayLike(Buffer, "be", n)
        const s = sig.s.toArrayLike(Buffer, "be", n)
        return Buffer.concat([r, s]).toString("hex")
    }

    genKeys() {
        const keys = ec.genKeyPair()
        const privateKey = keys.getPrivate("hex")
        const publicKey = keys.getPublic("hex").replace(/^04/, "")
    
        return {
            publicKey,
            privateKey,
            flowKey: this.encodePublicKeyForFlow(publicKey),
        }
    }
        // current added AuthAccount constructor (what you use to create an account on flow)
    // requires a public key to be in a certain format. That format is an rlp encoded value
    // that encodes the key itself, what curve it uses, how the signed values are hashed
    // and the keys weight.
    encodePublicKeyForFlow(publicKey) {
        return rlp
                .encode([
                    Buffer.from(publicKey, "hex"), // publicKey hex to binary
                    2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
                    3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
                    1000, // give key full weight
                ])
                .toString("hex")
    }

    async authorization(account = {}) {
        let self = this;
        const user = await self.getAccount(SERVICE_ACCOUNT);
        const key = user.keys[0]
        let sequenceNum
        if (account.role && account.role.proposer) sequenceNum = key.sequenceNumber

        //console.log('Authorization', account, key, sequenceNum);
        const signingFunction = async data => {
            return {
                addr: user.address,
                keyId: key.index,
                signature: self.signWithKey(SERVICE_ACCOUNT_PRIVATE_KEY, data.message),
            }
        }

        return {
            ...account,
            addr: user.address,
            keyId: key.index,
            sequenceNum,
            signature: account.signature || null,
            signingFunction,
            roles: account.roles,
        }
    }

    static invariant(fact, msg, ...rest) {
        if (!fact) {
            const error = new Error(`INVARIANT ${msg}`)
            error.stack = error.stack
            .split("\n")
            .filter(d => !/at invariant/.test(d))
            .join("\n")
            console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
            throw error
        }
    }

    async createFlowAccount() {
        const keys = await this.genKeys()
        const response = await fcl.send([
            fcl.transaction`
                transaction {
                let payer: AuthAccount
                prepare(payer: AuthAccount) {
                    self.payer = payer
                }
                execute {
                    let account = AuthAccount(payer: self.payer)
                    account.addPublicKey("${p => p.publicKey}".decodeHex())
                    //account.setCode("${p => p.code}".decodeHex())
                }
            }
            `,
            fcl.proposer(this.authorization.bind(this)),
            fcl.authorizations([this.authorization.bind(this)]),
            fcl.payer(this.authorization.bind(this)),
            fcl.params([
                fcl.param(keys.flowKey, t.Identity, "publicKey")
            ]),
        ]);

        const { events } = await fcl.tx(response).onceSealed()
        const accountCreatedEvent = events.find(d => d.type === "flow.AccountCreated")
        Blockchain.invariant(accountCreatedEvent, "No flow.AccountCreated found", events)
        //console.log('Event', accountCreatedEvent)

        let addr = accountCreatedEvent.data.address
        addr = addr.replace(/^0x/, "")
        Blockchain.invariant(addr, "an address is required")

        const account = await this.getAccount(addr)
        const key = account.keys.find(d => d.publicKey === keys.publicKey)
        Blockchain.invariant(key, "Could not find provided public key in on-chain flow account keys")
        return {
            address: account.address,
            publicKey: key.publicKey,
            privateKey: keys.privateKey,
            keyId: key.index,
        }
    }

    async deployFlowContract(contract) {

        const response = await fcl.send([
            fcl.transaction`          
                transaction {
                let payer: AuthAccount
                prepare(payer: AuthAccount) {
                    self.payer = payer
                }
                execute {
                    self.payer.setCode("${p => p.code}".decodeHex())
                }
                }
            `,
            fcl.proposer(this.authorization.bind(this)),
            fcl.authorizations([this.authorization.bind(this)]),
            fcl.payer(this.authorization.bind(this)),
            fcl.params([
                fcl.param(
                    Buffer.from(contract, "utf8").toString("hex"),
                    t.Identity,
                    "code"
                ),
            ]),
        ]);

        const { events } = await fcl.tx(response).onceSealed()
        return events;
        //console.log(response, JSON.stringify(events))
    }
}
