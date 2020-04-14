const Web3 = require("web3");
const { readFileSync } = require("fs");
const { join } = require("path");
const { promisify } = require("util");
const dappConfig = require("@trycrypto/dappstarter-dapplib/src/dapp-config.json");
const truffleConfig = require("@trycrypto/dappstarter-dapplib/truffle-config");
const dappStateAbi = require('@trycrypto/dappstarter-dapplib/build/contracts/DappState.json').abi;
module.exports = function(RED) {
  function DappConnectorNode(config) {
    let node = this;
    RED.nodes.createNode(this, config);
    setupWeb3(node, config);

    // if (this.interval_id == null && config.eventName != "") {
    //   this.interval_id = setInterval(() => {
    //     this.emit("input", {
    //       payload: new Date().getTime()
    //     });
    //   }, 3000);
    // }

    // this.on("input", msg => {
    //   RED.util.evaluateNodeProperty(
    //     this.payload,
    //     this.payloadType,
    //     this,
    //     msg,
    //     (err, res) => {
    //       if (err) {
    //         this.error(err, msg);
    //       } else {
    //         this.send(msg);
    //       }
    //     }
    //   );
    // });
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

      dappContract.events[config.eventName]({
        fromBlock: (await connection.eth.getBlockNumber()) + 1
      }).on("data", event => {
        node.send({
          payload: event
        });
      });
    }
  }
  RED.nodes.registerType("dapp-connector", DappConnectorNode, {
    settings: {
      dappConnectorAbi: {
        value: dappStateAbi,
        exportable: true
      },
      dappConnectorContract: {
        value: dappConfig.dappStateContractAddress,
        exportable: true
      }
    }
  });

  DappConnectorNode.prototype.close = function() {
    // clearInterval(this.interval_id);
  };
};
