const Web3 = require("web3");
const { readFileSync } = require("fs");
const { join } = require("path");
const { promisify } = require("util");
const dappConfig = require("@trycrypto/dappstarter-dapplib/src/dapp-config.json");
const truffleConfig = require("@trycrypto/dappstarter-dapplib/truffle-config");
const dappStateAbi = require("@trycrypto/dappstarter-dapplib/build/contracts/DappState.json")
  .abi;
module.exports = function(RED) {
  _contract = null;

  function DappTransactionNode(config) {
    let node = this;
    RED.nodes.createNode(this, config);
    (async function() {
      const connection = await setupWeb3(node, config);
      node.on("input", async data => {
        let result = await _contract.methods[config.contractFunction](1).send({
          from: connection.eth.accounts.privateKeyToAccount(
            truffleConfig.testAccounts[0]
          ).address
        });
        node.send({
          payload: result.transactionHash
        });
        console.log(result);
      });
    })();
  }

  async function setupWeb3(node, config) {
    let connection = new Web3(
      new Web3.providers.WebsocketProvider(dappConfig.wsUri)
    );

    if (config.abi) {
      let dappContract = new connection.eth.Contract(
        config.abi,
        config.contractAddress
      );
      _contract = dappContract;
    }

    return connection;
  }

  RED.nodes.registerType("dapp-transaction", DappTransactionNode, {
    settings: {
      dappTransactionAbi: {
        value: dappStateAbi,
        exportable: true
      },
      dappTransactionContract: {
        value: dappConfig.dappStateContractAddress,
        exportable: true
      },
      dappTransactionPrivateKey: {
        value: truffleConfig.testAccounts[0],
        exportable: true
      }
    }
  });
};
