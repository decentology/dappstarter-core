class token {

///(functions


    static async _decimals() {
        let result = await Blockchain.get(
                                    { config: config, contract: DappLib.DAPP_STATE_CONTRACT, params : { from: null } },
                                    'decimals' 
                            );
        return result.callData
    }

    static async totalSupply(data) {

        let decimals = await DappLib._decimals();
        let units = new BN(10).pow(new BN(decimals));
        let result = await Blockchain.get(
                            { config: config, contract: DappLib.DAPP_STATE_CONTRACT, params : { from: null } },
                            'totalSupply', 
        );
        let supply = result.callData;
        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Total Supply',
            result: new BN(supply).div(units),
            hint: null
        }
    }

    static async balance() {

        let decimals = await DappLib._decimals();
        let units = new BN(10).pow(new BN(decimals));
        let result = await Blockchain.get(
                            { config: config, contract: DappLib.DAPP_STATE_CONTRACT, params : { from: null } },
                            'balance'
        );
        let balance = result.callData;
        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Account Balance for ' + DappLib.formatAccount(result.callAccount),
            result: new BN(balance).div(units),
            hint: null
        }
    }

    static async balanceOf(data) {

        let decimals = await DappLib._decimals();
        let units = new BN(10).pow(new BN(decimals));
        let result = await Blockchain.get(
                            { config: config, contract: DappLib.DAPP_STATE_CONTRACT, params : { from: null } },
                            'balanceOf', 
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


    static async transfer(data) {

        let decimals = await DappLib._decimals();
        let units = new BN(10).pow(new BN(decimals));
        let amount = new BN(data.amount).mul(units); //.toString(10)
        let result = await Blockchain.post(
                                    { config: config, contract: DappLib.DAPP_STATE_CONTRACT, params : { from: null } },
                                    'transfer', 
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