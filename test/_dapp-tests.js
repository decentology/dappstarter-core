const Test = require('./test-config.js');
const BN = web3.utils.BN;

contract('Dapp Cross-contract Tests', async (accounts) => {

    let config;
  
    before('setup contract', async () => {
      config = await Test.Config(accounts);
    });

    it(`has correct result from sample cross-contract call`, async function () {
      let stateContractOwner = await config.dappContract.getStateContractOwner.call();
      assert.equal(stateContractOwner, config.owner, "Incorrect cross-contract result");
  });

});