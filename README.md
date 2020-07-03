# My Dapp

This project is for the blockchain application My Dapp. It contains code for the Smart Contract, web-based dapp and NodeJS server.

# Pre-requisites

In order to develop and build "My Dapp," the following pre-requisites must be installed:

* [Visual Studio Code](https://code.visualstudio.com/download) (or any IDE for editing Javascript)
* [NodeJS](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install) (DappStarter uses [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces))
///(language:solidity
///)
///(blockchain:flow
* [Flow CLI](https://docs.onflow.org/docs/cli) (https://docs.onflow.org/docs/cli) (after installation run `flow cadence install-vscode-extension` to enable code highlighting for Cadence files)
///)

# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn` This will fetch all required dependencies. The process will take 1-3 minutes and while it is in progress you can move on to the next step.

///(blockchain:ethereum
Note: You may see some npm warnings about "web3-bzz" after dependencies are installed. These can be ignored as the associated code is never invoked.
///)
# Build, Deploy and Test

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn start` This will run all the dev scripts in each project package.json.

To view your dapp, open your browser to http://localhost:5000

We ♥️ developers and want you to have an awesome experience. You should be experiencing Dappiness at this point. If not, let us know and we will help. Visit [https://support.trycrypto.com](https://support.trycrypto.com) or hit us up on Twitter @TryCrypto.


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
