const Test = require('../test-config.js');
const BN = web3.utils.BN;

contract('Dapp Contract Tests', async (accounts) => {

    let config;
  
    before('setup contract', async () => {
      config = await Test.Config(accounts);
    });

///+test

});