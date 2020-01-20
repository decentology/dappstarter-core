class contractrunstate {

///(functions



    static async isContractRunStateActive(caller, data) {

        let result = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'isContractRunStateActive', 
                            caller
        );
        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'Is Contract Run State Active',
            result: result.callData,
            hint: null
        }
    }

    static async setContractRunState(caller, data) {

        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'setContractRunState', 
                                    caller,
                                    data.mode
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify contract run state is ${data.mode ? 'active' : 'inactive'} by calling contract functions that use requireContractRunStateActive().`
        }                        
    }


///)

}