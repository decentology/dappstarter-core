///(import
const fcl = require('@onflow/fcl');
///)

class ballot {
    
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
            contract: DappLib.DAPP_STATE_CONTRACT,
            params: {
                proposer: data.account
            }
        },
        fcl.transaction`
        import ${p => p.contractName} from ${p => p.contractOwner}            
        transaction {
            prepare(acct: AuthAccount) {

                // Delete any existing collection
                let existing <- acct.load<@${p => p.contractName}.Collection>(from: /storage/NFTCollection)
                destroy existing

                // Create a new empty collection
                let collection <- ${p => p.contractName}.createEmptyCollection()

                // store the empty NFT Collection in account storage
                acct.save<@${p => p.contractName}.Collection>(<-collection, to: /storage/NFTCollection)

                // create a public capability for the Collection
                acct.link<&{${p => p.contractName}.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)

                // TODO: Event handling is not fully implemented
                //emit ${p => p.contractName}.InitializeAccount(acct.address : String)

            }
        }`
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
            contract: DappLib.DAPP_STATE_CONTRACT,
            params: {
            }
        },
        fcl.script`
        import ${p => p.contractName} from ${p => p.contractOwner}            
        pub fun main() : [UInt64]? {
            let account = getAccount(${p => p.account})
            let capability = account.getCapability(/public/NFTReceiver)
            let ref = capability!.borrow<&${p => p.contractName}.Collection>()

            return ref?.getIDs()
        }`,
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