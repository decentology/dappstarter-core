class administratorrole {

///(functions



    static async isContractAdmin(caller, data) {

        let result = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'isContractAdmin', 
                            caller,
                            data.account
        );
        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'Is Contract Admin',
            result: result.callData,
            hint: null
        }
    }

    static async addContractAdmin(caller, data) {

        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'addContractAdmin', 
                                    caller,
                                    data.account
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify ${DappLib.formatAccount(data.account)} is an administrator by using "Is Contract Admin."`
        }                        
    }

    static async removeContractAdmin(caller, data) {

        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'removeContractAdmin', 
                                    caller,
                                    data.account
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify ${DappLib.formatAccount(data.account)} is no longer an administrator by using "Is Contract Admin."`
        }                        
    }

    static async removeLastContractAdmin(caller, data) {

        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'removeLastContractAdmin', 
                                    caller,
                                    data.account
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify that all functions that require an administrator no longer work."`
        }                        
    }

///)

}