class contractaccess {

///(functions



    static async isContractAuthorized(caller, data) {

        let result = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'isContractAuthorized', 
                            caller,
                            data.account
        );
        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'Is Contract Authorized',
            result: result.callData,
            hint: null
        }
    }

    static async authorizeContract(caller, data) {

        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'authorizeContract', 
                                    caller,
                                    data.account
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify ${DappLib.formatAccount(data.account)} is authorized by using "Is Contract Authorized."`
        }                        
    }

    static async deauthorizeContract(caller, data) {

        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'deauthorizeContract', 
                                    caller,
                                    data.account
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify ${DappLib.formatAccount(data.account)} is no longer authorized by using "Is Contract Authorized."`
        }                        
    }


///)

}