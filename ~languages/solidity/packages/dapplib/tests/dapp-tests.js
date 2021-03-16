const TestHelpers = require('@openzeppelin/test-helpers');
const BN = TestHelpers.BN;
const DappLib = require('../src/dapp-lib.js');
const DappContract = artifacts.require('Dapp');
const DappStateContract = artifacts.require('DappState');

contract('Dapp Cross-contract Tests', async (accounts) => {

    let testDappStateContract;
    let testDappContract;
    let testAccounts;
    let config = null
  
    before('setup contract', async () => {
        testDappStateContract = await DappStateContract.new();
        testDappContract = await DappContract.new(dappStateContract.address);
        testAccounts = accounts;
        DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);

        // Call the re-written function to get the test config values
        config = DappLib.getConfig();
        config.testDappStateContract = testDappStateContract;
        config.testDappContract = testDappContract;
    });

    it(`has correct result from sample cross-contract call`, async function () {
      let stateContractOwner = await config.testDappContract.getStateContractOwner.call();
      assert.equal(stateContractOwner, config.owner, "Incorrect cross-contract result");
  });

});