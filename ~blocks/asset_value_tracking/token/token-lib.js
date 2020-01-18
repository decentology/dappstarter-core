class token {

///(functions


    static async _decimals(account, data) {
        return await Blockchain.get(
                DappLib.DAPP_STATE_CONTRACT,
                'decimals', 
                account
        );
    }

    static async totalSupply(account, data) {

            let decimals = await DappLib._decimals(account);
            let units = new BN(10).pow(new BN(decimals));
            let supply = await Blockchain.get(
                                DappLib.DAPP_STATE_CONTRACT,
                                'totalSupply', 
                                account
            );
            return DappLib.formatNumber(new BN(supply).div(units).toString(10));
    }

    static async balance(account) {

        let decimals = await DappLib._decimals(account);
        let units = new BN(10).pow(new BN(decimals));
        let balance = await Blockchain.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'balance', 
                            account
        );
        return DappLib.formatNumber(new BN(balance).div(units).toString(10));
    }

    static async balanceOf(account, data) {

        let decimals = await DappLib._decimals(account);
        let units = new BN(10).pow(new BN(decimals));
        let balance = await Blockchain.get(
                            DappLib.DAPP_STATE_CONTRACT,
                            'balanceOf', 
                            account,
                            data.account
        );
        return DappLib.formatNumber(new BN(balance).div(units).toString(10));
    }


    static async transfer(account, data) {

        let decimals = await DappLib._decimals(account);
        let units = new BN(10).pow(new BN(decimals));
        await Blockchain.post(
                    DappLib.DAPP_STATE_CONTRACT,
                    'transfer', 
                    account,
                    data.to,
                    new BN(data.amount).mul(units).toString(10)
        );

        return 'Transaction posted';
    }



///)

}