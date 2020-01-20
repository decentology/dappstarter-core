class token {

///(functions


    static async _decimals(caller, data) {
        let result = await DappLib.get(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'decimals', 
                                    caller
                            );
        return result.callData
    }

    static async totalSupply(caller, data) {

        let decimals = await DappLib._decimals(caller);
        let units = new BN(10).pow(new BN(decimals));
        let result = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'totalSupply', 
                            caller
        );
        let supply = result.callData;
        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Total Supply',
            result: new BN(supply).div(units),
            hint: null
        }
    }

    static async balance(caller) {

        let decimals = await DappLib._decimals(caller);
        let units = new BN(10).pow(new BN(decimals));
        let result = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'balance', 
                            caller
        );
        let balance = result.callData;
        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Account Balance for ' + DappLib.formatAccount(result.callAccount),
            result: new BN(balance).div(units),
            hint: null
        }
    }

    static async balanceOf(caller, data) {

        let decimals = await DappLib._decimals(caller);
        let units = new BN(10).pow(new BN(decimals));
        let result = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'balanceOf', 
                            caller,
                            data.account
        );
        let balance = result.callData;
        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: DappLib.formatAccount(result.callAccount) + ' Account Balance',
            result: new BN(balance).div(units),
            hint: null
        }
    }


    static async transfer(caller, data) {

        let decimals = await DappLib._decimals(caller);
        let units = new BN(10).pow(new BN(decimals));
        let amount = new BN(data.amount).mul(units); //.toString(10)
        let result = await DappLib.post(
                                    DappLib.DAPP_STATE_CONTRACT,
                                    'transfer', 
                                    caller,
                                    data.to,
                                    amount
                        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionHash,
            hint: `Verify transfer by using "Balance for Account" to check the balance of ${DappLib.formatAccount(data.to)}.`
        }                        
    }



///)

}