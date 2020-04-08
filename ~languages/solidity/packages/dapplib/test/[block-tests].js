const BN = require('bn.js');
const DappLib = require('../src/lib/dapp-lib.js').default;
const DappContract = artifacts.require('Dapp');
const DappStateContract = artifacts.require('DappState');

contract('Dapp Contract Tests', async (testAccounts) => {

    let config = null;

    before('setup contract', async () => {

        let testDappStateContract = await DappStateContract.new();
        let testDappContract = await DappContract.new(testDappStateContract.address);

        // Swap the definition of the DappLib.getConfig() function so it returns
        // dynamic contract addresses from the deployment above instead of the static
        // addresses from the last migration script run. Also, inject test accounts 
        // for contracts and IPFS. The testAccounts variable is initialized by Truffle
        // so we get whatever accounts are provided via the provider in truffle config.
        DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);

        // Call the re-written function to get the test config values
        config = DappLib.getConfig();
        config.testDappStateContract = testDappStateContract;
        config.testDappContract = testDappContract;
    });

///+test

});