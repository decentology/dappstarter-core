///(import
const fcl = require('@onflow/fcl');
///)

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

static async initializeAccount(data) {

    let result = await Blockchain.post({
            config: DappLib.getConfig(),
            imports: {
                DappState: data.account
            },
            roles: {
                proposer: data.account
            }
        },
        'basic_nft_initializeAccount'
    );

    // TODO: Event handling not fully implemented
    // DappLib.onInitializeAccount(result => {
    //     let resultPanel = this.querySelector("#resultPanel");
    //     resultPanel.prepend(DappLib.getFormattedResultNode(result));
    //     resultPanel.open();
    // });

    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}


static async getIDs(data) {

    let result = await Blockchain.get({
            config: DappLib.getConfig(),
            imports: {
                DappState: data.account
            },
            roles: {
                proposer: data.account
            }
        },
        'basic_nft_getIDs',
        {
            account: '0x' + data.account
        }
    );

    return {
        type: DappLib.DAPP_RESULT_ARRAY,
        label: 'NFT IDs',
        result: result.callData || []
    }

}

static async onInitializeAccount(callback) {
    let params = {};
    DappLib.addEventHandler(null, 'DappState.InitializeAccount', params, callback);
}

///)
}