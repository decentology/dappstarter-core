
const SHA3 = require('sha3').SHA3;
const EC = require('elliptic').ec;
const ec = new EC("p256")
const fcl = require('@onflow/fcl');

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
    Signer: Signer
}