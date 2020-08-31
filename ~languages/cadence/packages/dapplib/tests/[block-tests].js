const assert = require('chai').assert;
const spawn = require("cross-spawn");
const DappLib = require('../src/lib/dapp-lib.js');

describe('Flow Dapp Tests', async () => {

    let config = null;
    before('setup contract', async () => {
       // Setup tasks for tests
       config = DappLib.getConfig();
    });

///+test

});