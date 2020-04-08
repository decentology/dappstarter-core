const BN = require('bn.js');
const DappLib = require('../src/lib/dapp-lib.js');
const DappContract = artifacts.require('Dapp');
const DappStateContract = artifacts.require('DappState');

contract('Dapp Cross-contract Tests', async (accounts) => {

    let testDappStateContract;
    let testDappContract;
    let testAccounts;
  
    before('setup contract', async () => {
        testDappStateContract = await DappStateContract.new();
        testDappContract = await DappContract.new(dappStateContract.address);
        testAccounts = accounts;
    });

    it(`has correct result from sample cross-contract call`, async function () {
      let stateContractOwner = await config.dappContract.getStateContractOwner.call();
      assert.equal(stateContractOwner, config.owner, "Incorrect cross-contract result");
  });

});