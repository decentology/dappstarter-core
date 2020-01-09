///(test

    let unitMultiple = new BN(10 ** 999999999);   ///@{ "decimals": "999999999" }
    let initialSupply = new BN(999999999).mul(unitMultiple); ///@{ "supply" : "999999999" }

    it(`has correct total supply of tokens using totalSupply()`, async function () {
        let supply = await config.dappStateContract.totalSupply.call();
        assert.equal(supply.eq(initialSupply), true, "Incorrect total supply");
    });

    it(`has correct balance of tokens for an account using balanceOf()`, async function () {
        let balance = await config.dappStateContract.balanceOf.call(config.owner);
        assert.equal(balance.eq(initialSupply), true, "Incorrect balance");
    });

    it(`can transfer funds between accounts using transfer()`, async function () {

        var sourceAccount = config.owner;
        var targetAccount = config.users[0];
        var transferAmount = new BN(1000).mul(unitMultiple);

        let balanceOldSource = await config.dappStateContract.balanceOf.call(sourceAccount);
        let balanceOldTarget = await config.dappStateContract.balanceOf.call(targetAccount);
        await config.dappStateContract.transfer(targetAccount, transferAmount, { from: sourceAccount });

        let balanceNewSource = await config.dappStateContract.balanceOf.call(sourceAccount);
        let balanceNewTarget = await config.dappStateContract.balanceOf.call(targetAccount);

        assert.equal(balanceNewSource.eq(balanceOldSource.sub(transferAmount)), true, "Incorrect source new balance value");
        assert.equal(balanceNewTarget.eq(balanceOldTarget.add(transferAmount)), true, "Incorrect target balance value");

    });
  
    it(`can approve funds transfer using approve() and check spend amount using allowance()`, async function () {
  
        var sourceAccount = config.users[0];
        var targetAccount = config.users[1];
        var transferAmount = new BN(500).mul(unitMultiple);
  
        await config.dappStateContract.approve(targetAccount, transferAmount, { from: sourceAccount });
        let allowance = await config.dappStateContract.allowance.call(sourceAccount, targetAccount);
  
        assert.equal(allowance.eq(transferAmount), true, "Incorrect transfer allowance value");

      });
  
      it(`can transfer allowance funds between accounts using transferFrom()`, async function () {
  
        var sourceAccount = config.users[1];
        var targetAccount = config.users[2];
        var transferAmount = new BN(500).mul(unitMultiple);
  
        let sourceOldBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
        let targetOldBalance = await config.dappStateContract.balanceOf.call(targetAccount);
        let oldAllowance = await config.dappStateContract.allowance.call(sourceAccount, targetAccount);
        
        await config.dappStateContract.transferFrom(sourceAccount, targetAccount, transferAmount, { from: targetAccount }); 

        let sourceNewBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
        let targetNewBalance = await config.dappStateContract.balanceOf.call(targetAccount);
        let newAllowance = await config.dappStateContract.allowance.call(sourceAccount, targetAccount);
  
        assert.equal(sourceNewBalance.eq(sourceOldBalance.sub(transferAmount)), true, "Incorrect source new balance value");
        assert.equal(targetNewBalance.eq(targetOldBalance.add(transferAmount)), true, "Incorrect target new balance value");
        assert.equal(newAllowance.eq(oldAllowance.sub(transferAmount)), true, "Incorrect new allowance value");

      });
  
      it(`cannot transfer funds between accounts using transferFrom() unless authorized`, async function () {
  
        var sourceAccount = config.users[1];
        var targetAccount = config.users[3];
        var transferAmount = new BN(100).mul(unitMultiple);
  
        let sourceOldBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
        let targetOldBalance = await config.dappStateContract.balanceOf.call(targetAccount);
        try {
          await config.dappStateContract.transferFrom(sourceAccount, targetAccount, transferAmount, { from: targetAccount }); 
        }
        catch (e) {
  
        }
        let sourceNewBalance = await config.dappStateContract.balanceOf.call(sourceAccount);
        let targetNewBalance = await config.dappStateContract.balanceOf.call(targetAccount);
  
        assert.equal(sourceNewBalance.eq(sourceOldBalance), true, "Incorrect source new balance value");
        assert.equal(targetNewBalance.eq(targetOldBalance), true, "Incorrect target new balance value");
        
      });

///)