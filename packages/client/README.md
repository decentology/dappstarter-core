# My Dapp

This project is for the blockchain application My Dapp. It contains code for the Smart Contract, web-based dapp and NodeJS server.

# Pre-requisites

In order to develop and build "My Dapp," the following pre-requisites must be installed:

* [Visual Studio Code](https://code.visualstudio.com/download) (or any IDE for editing Javascript)
* [NodeJS v10.x](https://nodejs.org/en/download/)
///(language:solidity
* [Solidity v0.5.11](https://www.npmjs.com/package/solc)
* [Truffle v5.0.7](https://truffleframework.com/truffle)
* [Ganache v2.0.0](https://truffleframework.com/ganache) - blockchain simulator for Ethereum
///)

# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `lerna bootstrap` This will fetch all required dependencies. The process will take 1-3 minutes and while it is in progress you can move on to the next step.

///(blockchain:ethereum
Note: You may see some npm warnings about "web3-bzz" after dependencies are installed. These can be ignored as the associated code is never invoked.

## Ganache Settings (for Ethereum only; skip for other blockchains)

Launch the Ganache GUI, then create a new workspace with any name of your choice. Once the workspace is active, click the gear icon and complete these configuration steps:

- Workspace Tab: Truffle Projects: Select "Add Project" and select "truffle-config.js" from the same folder as this README.md file

- Accounts & Keys Tab: Mnemonic (field with 12 or more words): Copy/paste the words below.

  ### [] ///@{ "___test-mnemonic___": "[]"}

  These keywords are used to auto-generate accounts with private keys for development. If the keywords in "truffle-config.js" (which are the same as above) and Ganache don't match, you will not be able to deploy your Smart Contracts to Ganache.

- Server Tab: Check that "Port Number" is "7545" and "Network ID = 5777"
///)
# Build, Deploy and Test

Using a terminal (or command prompt), change to the folder containing the project files and type: `npm run dev` This will run all the dev scripts in each project package.json.

To view your dapp, open your browser to http://localhost:5000

If you encounter any problems at this step, visit [https://support.trycrypto.com](https://support.trycrypto.com) for help.


## Smart Contract

`lerna run deploy --scope=@trycrypto/dappstarter-dapplib --stream` to compile contracts/*.sol files, deploy them to the blockchain. 

## Dapp

Run the dapp in a separate terminal. You *must* have run `npm run deploy` for the dapp to see most recent smart contract changes.

`lerna run dev --scope=@trycrypto/dappstarter-client --stream` runs the dapp on http://localhost:5001 using webpack dev server

## Server

Run the server in a separate terminal. You *must* have run `npm run deploy` for the dapp to see most recent smart contract changes.

`lerna run dev --scope=@trycrypto/dappstarter-server --stream` runs NodeJS server app on port 5002 with NestJS

///(language:solidity
## Testing

`test-config.js` contains settings used by test scripts

Run tests using `lerna run test [test file] --scope=@trycrypto/dappstarter-dapplib --stream`
///)
## Production Builds

DappStarter currently does not provide blockchain migration scripts to be used in production. However, here are the scripts for generating production builds:

`lerna run build:prod` generates dapp bundle for production.
