# My Dapp

This project is for the blockchain application My Dapp. It contains code for the Smart Contract, web-based dapp and NodeJS server.

# Pre-requisites

In order to develop and build My Dapp, the following pre-requisites must be installed:

* [Visual Studio Code](https://code.visualstudio.com/download) (or any IDE for editing Javascript)
* [NodeJS v10.x](https://nodejs.org/en/download/)
* [Truffle v5.0.7](https://truffleframework.com/truffle)
* [Ganache v2.0.0](https://truffleframework.com/ganache) - for Ethereum
* [Solidity v0.5.11](https://www.npmjs.com/package/solc) - for Ethereum, Klaytn, Harmony

# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `npm install`

# Configuration

## Ganache Settings (for Ethereum only; skip for other blockchains)

Launch the Ganache GUI and create a new workspace with the following settings:
- Workspace Name: *my-dapp*
- Port Number: *7545*
- Network ID: *5777*
- Mnemonic: *depth grow catalog fitness vocal bulb coin toss harsh twenty mistake upon*

## Test Configuration

`config/testConfig.js` contains settings used by test scripts

# Usage

## Smart Contract

`truffle compile` to compile contracts/*.sol files

`truffle compile --reset` to force compile contracts/*.sol files

`truffle test ./test/01-contract.js` to compile smart contracts and run test script (shortcut `npm run test`)

`truffle migrate` to deploy smart contracts and regenerate dapp and server configuration files

`truffle migrate --reset` to force deploy smart contracts and regenerate dapp and server configuration files

## Dapp

Run the dapp in a separate terminal. You *must* run `truffle migrate` for dapp to see most recent smart contract changes.

`npm run dapp` runs the dapp on http://localhost:8000 using webpack dev server

`npm run dapp:prod` generates dapp bundle for production using webpack

## Server

Run the server in a separate terminal. You *must* run `truffle migrate` for server to see most recent smart contract changes.

`npm run server` runs NodeJs server app on port 3000 with Express

`npm run server:prod` generates NodeJs server bundle for production using webpack


