class token {

///(functions
  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ASSET VALUE TRACKING: TOKEN  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  static async _decimals(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "decimals"
    );
    return result.callData;
  }

  static async _toSmallestUnit(amount, data) {
    let decimals = await DappLib._decimals(data);
    let units = new BN(10).pow(new BN(decimals));
    return new BN(amount).mul(units);
  }

  static async _fromSmallestUnit(amount, data) {
    let decimals = await DappLib._decimals(data);
    let units = new BN(10).pow(new BN(decimals));
    return new BN(amount).div(units);
  }

  static async totalSupply(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "totalSupply"
    );
    let supply = result.callData;
    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: "Total Supply",
      result: new BN(supply),
      unitResult: await DappLib._fromSmallestUnit(supply, data),
      hint: null,
    };
  }

  static async balance(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "balance"
    );
    let balance = result.callData;
    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: "Account Balance for " + DappLib.formatAccount(result.callAccount),
      result: new BN(balance),
      unitResult: await DappLib._fromSmallestUnit(balance, data),
      hint: null,
    };
  }

  static async balanceOf(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "balanceOf",
      data.account
    );
    let balance = result.callData;
    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: DappLib.formatAccount(result.callAccount) + " Account Balance",
      result: new BN(balance),
      unitResult: await DappLib._fromSmallestUnit(balance, data),
      hint: null,
    };
  }

  static async transfer(data) {
    let decimals = await DappLib._decimals(data);
    let units = new BN(10).pow(new BN(decimals));
    let amount = new BN(data.amount).mul(units);
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "transfer",
      data.to,
      amount
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData),
      hint: `Verify transfer by using "Balance for Account" to check the balance of ${DappLib.formatAccount(
        data.to
      )}.`,
    };
  }

  static async allowance(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "allowance",
      data.sourceAccount,
      data.targetAccount
    );
    let balance = result.callData;
    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: DappLib.formatAccount(result.callAccount) + " Allowance",
      result: new BN(balance),
      unitResult: await DappLib._fromSmallestUnit(balance, data),
      hint: null,
    };
  }

  static async approve(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "approve",
      data.targetAccount,
      data.transferAmount
    );
    return {
      type: DappLib.DAPP_RESULT_BOOLEAN,
      label: "Is transaction approved",
      result: result.callData,
      hint: null,
    };
  }

  static async transferFrom(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
        },
      },
      "transferFrom",
      data.from,
      data.to,
      data.amount
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData),
      hint: `Verify transfer by using "Balance for Account" to check the balance of ${DappLib.formatAccount(
        data.to
      )}.`,
    };
  }

  static async onApproval(callback) {
    let params = {};
    DappLib.addEventHandler(
      DappLib.DAPP_STATE_CONTRACT_WS,
      "Approval",
      params,
      callback
    );
  }

  static async onTransfer(callback) {
    let params = {};
    DappLib.addEventHandler(
      DappLib.DAPP_STATE_CONTRACT_WS,
      "Transfer",
      params,
      callback
    );
  }

///)

}
