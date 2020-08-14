///(test
let unitMultiple = new BN(10).pow(new BN(3));
let initialSupply = new BN(1000000).mul(unitMultiple);

it(`has correct total supply of tokens using totalSupply()`, async function () {
  try {
    let testData1 = {
      from: config.owner,
    };
    let supply = (await DappLib.totalSupply(testData1)).result;
    assert.equal(
      supply.toString(10),
      initialSupply.toString(10),
      "Incorrect total supply"
    );
  } catch (e) {
    assert.fail(e.message);
  }
});

it(`has correct balance of tokens for calling account using balance()`, async function () {
  try {
    let testData1 = {
      from: config.owner,
    };
    let balance = (await DappLib.balance(testData1)).result;
    assert.equal(
      balance.toString(10),
      initialSupply.toString(10),
      "Incorrect balance"
    );
  } catch (e) {
    assert.fail(e.message);
  }
});

it(`has correct balance of tokens for an account using balanceOf()`, async function () {
  try {
    let testData1 = {
      from: config.owner,
      account: config.owner,
    };
    let balance = (await DappLib.balanceOf(testData1)).result;
    assert.equal(
      balance.toString(10),
      initialSupply.toString(10),
      "Incorrect balance"
    );
  } catch (e) {
    assert.fail(e.message);
  }
});

it(`can transfer funds between accounts using transfer()`, async function () {
  try {
    var sourceAccount = config.owner;
    var targetAccount = config.users[0];
    var transferAmount = new BN(1000);

    let testData1 = {
      from: sourceAccount,
      account: sourceAccount,
    };
    let testData2 = {
      from: sourceAccount,
      account: targetAccount,
    };
    let testData3 = {
      from: sourceAccount,
      to: targetAccount,
      amount: transferAmount,
    };

    let balanceOldSource = (await DappLib.balanceOf(testData1)).result;
    let balanceOldTarget = (await DappLib.balanceOf(testData2)).result;

    await DappLib.transfer(testData3);

    let balanceNewSource = (await DappLib.balanceOf(testData1)).result;
    let balanceNewTarget = (await DappLib.balanceOf(testData2)).result;

    assert.equal(
      balanceNewSource.toString(10),
      balanceOldSource.sub(transferAmount.mul(unitMultiple)).toString(10),
      "Incorrect source new balance value"
    );
    assert.equal(
      balanceNewTarget.toString(10),
      balanceOldTarget.add(transferAmount.mul(unitMultiple)).toString(10),
      "Incorrect target balance value"
    );
  } catch (e) {
    assert.fail(e.message);
  }
});

it(`can approve funds transfer using approve() and check spend amount using allowance()`, async function () {
  try {
    var sourceAccount = config.users[0];
    var targetAccount = config.users[1];
    var transferAmount = new BN(500).mul(unitMultiple);

    await DappLib.approve({
      targetAccount: targetAccount,
      transferAmount: transferAmount,
      from: sourceAccount,
    });

    let allowance = (
      await DappLib.allowance({
        sourceAccount: sourceAccount,
        targetAccount: targetAccount,
      })
    ).result;

    assert.equal(
      allowance.toString(),
      transferAmount,
      "Incorrect transfer allowance value"
    );
  } catch (e) {
    assert.fail(e.message);
  }
});

it(`can transfer allowance funds between accounts using transferFrom()`, async function () {
  try {
    var sourceAccount = config.users[0];
    var targetAccount = config.users[1];
    var authorizedAccount = config.users[2];

    var transferAmount = new BN(500).mul(unitMultiple);

    let sourceOldBalance = (
      await DappLib.balanceOf({
        account: sourceAccount,
      })
    ).result;
    let targetOldBalance = (
      await DappLib.balanceOf({
        account: targetAccount,
      })
    ).result;

    await DappLib.approve({
      targetAccount: authorizedAccount,
      transferAmount: transferAmount,
      from: sourceAccount,
    });

    let oldAllowance = (
      await DappLib.allowance({
        sourceAccount: sourceAccount,
        targetAccount: authorizedAccount,
      })
    ).result;

    await DappLib.transferFrom({
      from: sourceAccount,
      to: targetAccount,
      amount: transferAmount,
      authorized: authorizedAccount,
    });

    let sourceNewBalance = (
      await DappLib.balanceOf({
        account: sourceAccount,
      })
    ).result;
    let targetNewBalance = (
      await DappLib.balanceOf({
        account: targetAccount,
      })
    ).result;

    let newAllowance = (
      await DappLib.allowance({
        sourceAccount: sourceAccount,
        targetAccount: sourceAccount,
      })
    ).result;

    assert.equal(
      sourceNewBalance.toString(),
      sourceOldBalance.sub(transferAmount).toString(),
      "Incorrect source new balance value"
    );
    assert.equal(
      targetNewBalance.toString(),
      targetOldBalance.add(transferAmount).toString(),
      "Incorrect target new balance value"
    );
    assert.equal(
      newAllowance.toString(),
      oldAllowance.sub(transferAmount).toString(),
      "Incorrect new allowance value"
    );
  } catch (e) {
    assert.fail(e.message);
  }
});

it(`cannot transfer funds between accounts using transferFrom() unless authorized`, async function () {
    let sourceAccount = config.users[0];
    let targetAccount = config.users[1];
    let authorizedAccount = config.users[2];
    let transferAmount = new BN(100).mul(unitMultiple);

    let hasError = false;

    try {
      await DappLib.transferFrom({
        from: sourceAccount,
        to: targetAccount,
        amount: transferAmount,
        authorized: authorizedAccount,
      });
    } catch (e) {
      hasError = true;
    }

    assert.equal(hasError, true);

    // expect(await DappLib.transferFrom({
    //   from: sourceAccount,
    //   to: targetAccount,
    //   amount: transferAmount,
    //   authorized: authorizedAccount,
    // })).to.throw();
    // done();
});

///)