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
* [Flow CLI](https://docs.onflow.org/flow-cli/install) (https://docs.onflow.org/flow-cli/install) (after installation run `flow cadence install-vscode-extension` to enable code highlighting for Cadence source files)
///)
///(blockchain:solana
* [Solana CLI Tools](https://docs.solana.com/cli/install-solana-cli-tools)
* Rust (see "Dependency Guides" at the end for help installing) 
### Dependency Checklist 
```bash
$ node --version
$ npm --version
$ rustup --version
$ rustc --version
$ cargo --version
$ solana --version
```
///)

### Windows Users

Before you proceed with installation, it's important to note that many blockchain libraries either don't work or generate errors on Windows. If you try installation and can't get the startup scripts to completion, this may be the problem. In that case, it's best to install and run DappStarter using Windows Subsystem for Linux (WSL). Here's a [guide to help you install WSL](https://docs.decentology.com/guides/windows-subsystem-for-linux-wsl).

Blockchains known to require WSL: Solana
# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn` This will fetch all required dependencies. The process will take 1-3 minutes and while it is in progress you can move on to the next step.

# Yarn Errors

You might see failures related to the `node-gyp` package when Yarn installs dependencies.
These failures occur because the node-gyp package requires certain additional build tools
to be installed on your computer. Follow the [instructions](https://www.npmjs.com/package/node-gyp) for adding build tools and then try running `yarn` again.

# Build, Deploy and Test
///(blockchain:polygon

Before you can work with Matic's testnet, you need to request some tokens in your test accounts. To make this request type: `yarn faucet` This will request tokens for all 10 test accounts. You may have to run this command a few times to see the token balances get updated. It isn't necessary to wait until all accounts have tokens – the account labeled (0) is the account used to deploy contracts. Once you see a balance for this account, you can continue.

///)
Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn start` This will run all the dev scripts in each project package.json.

///(blockchain:solana
The first time you run `yarn start` there are a fair number of Rust libraries that are
downloaded and pre-compiled. As a result, it may be take from 5-10 mins. before the
dapp is compiled and launched the first time. On subsequent compilations, the build
time will only be a few seconds.

## File Locations
Here are the locations of some important files:
* Program Code: [packages/dapplib/programs/src/lib.rs](packages/dapplib/programs/src/lib.rs)
* Dapp Library: [packages/dapplib/src/dapp-lib.js](packages/dapplib/src/dapp-lib.js)
* Solana Wrapper: [packages/dapplib/src/solana.js](packages/dapplib/src/solana.js) 
* Blockchain Interactions: [packages/dapplib/src/blockchain.js](packages/dapplib/src/blockchain.js)
* Data Layouts: [packages/dapplib/src/scripts/layouts.js](packages/dapplib/src/scripts/layouts.js)
* Deploy Script: [packages/dapplib/src/scripts/deploy.js](packages/dapplib/src/scripts/deploy.js)
///)

///(language:solidity
## File Locations
Here are the locations of some important files:
* Contract Code: [packages/dapplib/contracts](packages/dapplib/contracts)
* Dapp Library: [packages/dapplib/src/dapp-lib.js](packages/dapplib/src/dapp-lib.js) 
* Blockchain Interactions: [packages/dapplib/src/blockchain.js](packages/dapplib/src/blockchain.js)
* Unit Tests: [packages/dapplib/tests](packages/dapplib/tests)
* UI Test Harnesses: [packages/client/src/dapp/harness](packages/client/src/dapp/harness)

///)

///(language:cadence
## File Locations
Here are the locations of some important files:
* Contract Code: [packages/dapplib/contracts](packages/dapplib/contracts)
* Dapp Library: [packages/dapplib/src/dapp-lib.js](packages/dapplib/src/dapp-lib.js) 
* Blockchain Interactions: [packages/dapplib/src/blockchain.js](packages/dapplib/src/blockchain.js)
* Unit Tests: [packages/dapplib/tests](packages/dapplib/tests)
* UI Test Harnesses: [packages/client/src/dapp/harness](packages/client/src/dapp/harness)

///)
To view your dapp, open your browser to http://localhost:5000 for the DappStarter Workspace.

We ♥️ developers and want you to have an awesome experience. You should be experiencing Dappiness at this point. If not, let us know and we will help. Join our [Discord](https://discord.gg/ZzaaqwMmVG) or hit us up on Twitter [@Decentology](https://twitter.com/decentology).

///(language:solidity
## Smart Contract

`yarn migrate` to compile contracts/*.sol files, deploy them to the blockchain. 

## Dapp

Run the dapp in a separate terminal. You *must* have run `npm run deploy` for the dapp to see most recent smart contract changes.

`yarn dapp` runs the dapp on http://localhost:5001 using webpack dev server

## Server

Run the server in a separate terminal. You *must* have run `npm run deploy` for the dapp to see most recent smart contract changes.

`yarn server` runs NodeJS server app on port 5002 with NestJS

## Testing

`test-config.js` contains settings used by test scripts

Run tests using `yarn test --script=[test file]`

## Production Builds

DappStarter currently does not provide blockchain migration scripts to be used in production. However, here are the scripts for generating production builds:

`yarn build:prod` generates dapp bundle for production.
///)
///(language:rust
## Dependency Guides

This section contains installation guides for common dev environments. 

### Rust

(Source: Solana)
We suggest that you install Rust using the 'rustup' tool. Rustup will install
the latest version of Rust, Cargo, and the other binaries.

Follow the instructions at [Installing Rust](https://www.rust-lang.org/tools/install).

For Mac users, Homebrew is also an option.  The Mac Homebrew command is `brew install rustup` and then
`rustup-init`. See [Mac Setup](https://sourabhbajaj.com/mac-setup/Rust/) &
[Installing Rust](https://www.rust-lang.org/tools/install) for more details.

After installation, you should have `rustc`, `cargo`, & `rustup`. You should
also have `~/.cargo/bin` in your PATH environment variable.
///)
