class basic_nft {

///(functions
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: BASIC  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static async getAccountInfo(data) {
        let address = data.account.replace(/^0x/, '');
        let blockchain = new Blockchain();
        let result = await blockchain.getAccount(address); 

        result.data = Object.assign({}, {
            address: result.address,
            balance: result.balance,
        }, result.keys[0]);
        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Account Information',
            result: result.data
        }
}

///)
}