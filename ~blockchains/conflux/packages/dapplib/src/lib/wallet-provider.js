const { ethers } = require('ethers');
const { Conflux } = require('js-conflux-sdk');

module.exports = class WalletProvider {

    constructor(mnemonic, count) {
        this.mnemonic = mnemonic;
        this.count = count;
        this.wallets = [];
        this.addresses = [];
        this.privateKeys = [];
        for(let c=0; c < count; c++) {
            let wallet = ethers.Wallet.fromMnemonic(mnemonic,`m/44\'/60\'/0\'/0/${c}`);
            let account = new Conflux({networkId: 1}).wallet.addPrivateKey(wallet.privateKey);
            this.wallets.push(new this.Wallet(account));
            this.addresses.push(account.address);
            this.privateKeys.push(account.privateKey);
        }
    }

    Wallet(account) {
        this.account = account;

        return {
            getAddressString: () => {
                return this.account.address;
            },
            getPublicKeyString: () => {
                return this.account.publicKey;
            },
            getPrivateKeyString: () => {
                return this.account.privateKey;
            }
        }
    }
}

