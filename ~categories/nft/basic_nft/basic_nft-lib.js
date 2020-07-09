class basic_nft {

///(functions
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: BASIC  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static async getAccountInfo(data) {
        let address = data.account.replace(/^0x/, '');
        let result = await Blockchain.getAccount(DappLib.getConfig(), address); 

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