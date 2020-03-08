///(test

    let unitMultiple = new BN(10).pow(new BN(18)); ///@{ "decimals" : 18 }
    let initialSupply = new BN(9999999).mul(unitMultiple);  ///@{ "supply": 9999999 }

    it(`has correct total supply of tokens using totalSupply()`, async function () {
        try {
            let testData1 = {
                from: config.owner
            }
            let supply = (await DappLib.totalSupply(testData1)).result;
            assert.equal(supply.toString(10), initialSupply.toString(10), "Incorrect total supply");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`has correct balance of tokens for calling account using balance()`, async function () {
        try {
            let testData1 = {
                from: config.owner,
            }
            let balance = (await DappLib.balance(testData1)).result;
            assert.equal(balance.toString(10), initialSupply.toString(10), "Incorrect balance");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`has correct balance of tokens for an account using balanceOf()`, async function () {
        try {
            let testData1 = {
                from: config.owner,
                account: config.owner
            }
            let balance = (await DappLib.balanceOf(testData1)).result;
            assert.equal(balance.toString(10), initialSupply.toString(10), "Incorrect balance");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`can transfer funds between accounts using transfer()`, async function () {
        try {
            var sourceAccount = config.owner;
            var targetAccount = config.users[0];
            var transferAmount = new BN(1000).mul(unitMultiple);

            let testData1 = {
                from: sourceAccount,
                account: sourceAccount
            }
            let testData2 = {
                from: sourceAccount,
                account: targetAccount
            }
            let testData3 = {
                from: sourceAccount,
                to: targetAccount,
                amount: transferAmount
            }

            let balanceOldSource = (await DappLib.balanceOf(testData1)).result;
            let balanceOldTarget = (await DappLib.balanceOf(testData2)).result;

            await DappLib.transfer(testData3);

            let balanceNewSource = (await DappLib.balanceOf(testData1)).result;
            let balanceNewTarget = (await DappLib.balanceOf(testData2)).result;
            assert.equal(balanceNewSource.toString(10), balanceOldSource.sub(transferAmount).toString(10), "Incorrect source new balance value");
            assert.equal(balanceNewTarget.toString(10), balanceOldTarget.add(transferAmount).toString(10), "Incorrect target balance value");
        } catch (e) {
            assert.fail(e.message);
        }
    });

    it(`can approve funds transfer using approve() and check spend amount using allowance()`, async function () {
        try {
            var sourceAccount = config.users[0];
            var targetAccount = config.users[1];
            var transferAmount = new BN(500).mul(unitMultiple);
    
            await config.dappStateContract.approve(targetAccount, transferAmount, {
            from: sourceAccount
            });
            let allowance = await config.dappStateContract.allowance.call(sourceAccount, targetAccount);
    
            assert.equal(allowance.eq(transferAmount), true, "Incorrect transfer allowance value");
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`can transfer allowance funds between accounts using transferFrom()`, async function () {
        try {
            var sourceAccount = config.users[0];
            var targetAccount = config.users[1];
            var transferAmount = new BN(500).mul(unitMultiple);
    
            let sourceOldBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
            let targetOldBalance = await config.dappStateContract.balanceOf.call(targetAccount);
            let oldAllowance = await config.dappStateContract.allowance.call(sourceAccount, targetAccount);
    
            await config.dappStateContract.transferFrom(sourceAccount, targetAccount, transferAmount, {
            from: targetAccount
            });
    
            let sourceNewBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
            let targetNewBalance = await config.dappStateContract.balanceOf.call(targetAccount);
            let newAllowance = await config.dappStateContract.allowance.call(sourceAccount, targetAccount);
    
            assert.equal(sourceNewBalance.eq(sourceOldBalance.sub(transferAmount)), true, "Incorrect source new balance value");
            assert.equal(targetNewBalance.eq(targetOldBalance.add(transferAmount)), true, "Incorrect target new balance value");
            assert.equal(newAllowance.eq(oldAllowance.sub(transferAmount)), true, "Incorrect new allowance value");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`cannot transfer funds between accounts using transferFrom() unless authorized`, async function () {
        try {
            var sourceAccount = config.users[1];
            var targetAccount = config.users[3];
            var transferAmount = new BN(100).mul(unitMultiple);
    
            let sourceOldBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
            let targetOldBalance = await config.dappStateContract.balanceOf.call(targetAccount);
            try {
            await config.dappStateContract.transferFrom(sourceAccount, targetAccount, transferAmount, {
                from: targetAccount
            });
            } catch (exc) {
    
            }
    
            let sourceNewBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
            let targetNewBalance = await config.dappStateContract.balanceOf.call(targetAccount);
    
            assert.equal(sourceNewBalance.eq(sourceOldBalance), true, "Incorrect source new balance value");
            assert.equal(targetNewBalance.eq(targetOldBalance), true, "Incorrect target new balance value");
     
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

///)