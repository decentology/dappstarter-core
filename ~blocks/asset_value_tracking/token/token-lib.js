class token {

///(functions


    static async _decimals(account, data) {
        return await DappLib.get(
                DappLib.DAPP_STATE_CONTRACT,
                'decimals', 
                account
        );
    }

    static async totalSupply(account, data) {

            let supply = await DappLib.get(
                                DappLib.DAPP_STATE_CONTRACT,
                                'totalSupply', 
                                account
            );
            let decimals = await DappLib._decimals(account);
            let units = new BN(10).pow(new BN(decimals));
            return DappLib.formatNumber(new BN(supply).div(units).toString(10));
    }

    static async balance(account) {

        let balance = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'balance', 
                            account
        );
        let decimals = await DappLib._decimals(account);
        let units = new BN(10).pow(new BN(decimals));
        return DappLib.formatNumber(new BN(balance).div(units).toString(10));
    }

    static async balanceOf(account, data) {

        let balance = await DappLib.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'balanceOf', 
                            account,
                            data.account
        );
        let decimals = await DappLib._decimals(account);
        let units = new BN(10).pow(new BN(decimals));
        return DappLib.formatNumber(new BN(balance).div(units).toString(10));
    }


    static async transfer(account, data) {

        let decimals = await DappLib._decimals(account);
        let units = new BN(10).pow(new BN(decimals));
        let amount = new BN(data.amount).mul(units); //.toString(10)
        return await DappLib.post(
                    DappLib.DAPP_STATE_CONTRACT,
                    'transfer', 
                    account,
                    data.to,
                    amount
        );
    }



///)

}