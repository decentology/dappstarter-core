# My Dapp

This project is for the blockchain application My Dapp. It contains code for the Smart Contract, web-based dapp and NodeJS server.

# Pre-requisites

In order to develop and build My Dapp, the following pre-requisites must be installed:

* [Visual Studio Code](https://code.visualstudio.com/download) (or any IDE for editing Javascript)
* [NodeJS v10.x](https://nodejs.org/en/download/)
* [Truffle v5.0.7](https://truffleframework.com/truffle)
* [Ganache v2.0.0](https://truffleframework.com/ganache) - for Ethereum
* [Solidity v0.5.11](https://www.npmjs.com/package/solc) - for Ethereum, Klaytn, Harmony

## Ganache Settings (for Ethereum only; skip for other blockchains)

Download and install the Ganache GUI, then create a new workspace with the following settings:
- Workspace Name: *dapp-starter*
- Port Number: *7545*
- Network ID: *5777*
- Mnemonic: Copy the text (12 words) between the single quotes on line 4 of ./truffle-config.js
            
# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `npm start`
This will fetch all required dependencies, compile and then deploy the contract. If you encounter any problems
at this step, visit [https://support.trycrypto.com](https://support.trycrypto.com) for help.

# Usage

## Smart Contract

`npm start` to install dependencies, compile contracts/*.sol files and deploy them

## Dapp

Run the dapp in a separate terminal. You *must* run `npm start` or `npm deploy` first for dapp to see most recent smart contract changes.

`npm run dapp` runs the dapp on http://localhost:8000 using webpack dev server

## Server

Run the server in a separate terminal. You *must* run `npm start` or `npm deploy` first for dapp to see most recent smart contract changes.

`npm run server` runs NodeJs server app on port 3000 with Express

## Testing

`test-config.js` contains settings used by test scripts

Run tests using `npm test [test file]` (example: npm test ./test/_dapp-tests.js)

## Production Builds

This beta of DappStarter should not be used in production. That said, here are the scripts for generating production builds:

`npm run dapp:prod` generates dapp bundle for production using webpack

`npm run server:prod` generates NodeJs server bundle for production using webpack
