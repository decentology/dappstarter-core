<p align="center">
<a href="https://memeblast.trycrypto.com/"><img src="https://info.trycrypto.com/giveaway.png" alt="Dappstarter Giveaway" /></a>
</p>

# My Dapp

This project is for the blockchain application My Dapp. It contains code for the Smart Contract, web-based dapp and NodeJS server.

# Pre-requisites

In order to develop and build "My Dapp," the following pre-requisites must be installed:

* [Visual Studio Code](https://code.visualstudio.com/download) (or any IDE for editing Javascript)
* [NodeJS](https://nodejs.org/en/download/)
///(language:solidity
///)

# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `npm run bootstrap` This will fetch all required dependencies. The process will take 1-3 minutes and while it is in progress you can move on to the next step.

///(blockchain:ethereum
Note: You may see some npm warnings about "web3-bzz" after dependencies are installed. These can be ignored as the associated code is never invoked.
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
