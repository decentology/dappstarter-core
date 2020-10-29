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
* [Flow CLI](https://docs.onflow.org/docs/cli) (https://docs.onflow.org/docs/cli) (after installation run `flow cadence install-vscode-extension` to enable code highlighting for Cadence source files)
///)
///(blockchain:solana
* [Solana CLI Tools](https://docs.solana.com/cli/install-solana-cli-tools)
* Rust (see "Dependency Guides" at the end for help installing)
* Docker (see "Dependency Guides" at the end for help installing)

### Dependency Checklist
```bash
$ node --version
$ npm --version
$ docker -v
$ rustup --version
$ rustc --version
$ cargo --version
$ solana --version
```
///)

# Installation

Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn` This will fetch all required dependencies. The process will take 1-3 minutes and while it is in progress you can move on to the next step.

///(blockchain:ethereum
Note: You may see some npm warnings about "web3-bzz" after dependencies are installed. These can be ignored as the associated code is never invoked.
///)
# Build, Deploy and Test
///(blockchain:matic

Before you can work with Matic's testnet, you need to request some tokens in your test accounts. To make this request type: `yarn faucet` This will request tokens for all 10 test accounts. You may have to run this command a few times to see the token balances get updated. It isn't necessary to wait until all accounts have tokens – the account labeled (0) is the account used to deploy contracts. Once you see a balance for this account, you can continue.

///)
Using a terminal (or command prompt), change to the folder containing the project files and type: `yarn start` This will run all the dev scripts in each project package.json.

To view your dapp, open your browser to http://localhost:5000

We ♥️ developers and want you to have an awesome experience. You should be experiencing Dappiness at this point. If not, let us know and we will help. Visit [https://support.trycrypto.com](https://support.trycrypto.com) or hit us up on Twitter @decentology.


## Smart Contract

`yarn migrate` to compile contracts/*.sol files, deploy them to the blockchain. 

## Dapp

Run the dapp in a separate terminal. You *must* have run `npm run deploy` for the dapp to see most recent smart contract changes.

`yarn dapp` runs the dapp on http://localhost:5001 using webpack dev server

## Server

Run the server in a separate terminal. You *must* have run `npm run deploy` for the dapp to see most recent smart contract changes.

`yarn server` runs NodeJS server app on port 5002 with NestJS

///(language:solidity
## Testing

`test-config.js` contains settings used by test scripts

Run tests using `yarn test --script=[test file]`
///)
## Production Builds

DappStarter currently does not provide blockchain migration scripts to be used in production. However, here are the scripts for generating production builds:

`yarn build:prod` generates dapp bundle for production.

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

### Docker

(Source: Solana)
Docker runs as a service and it needs to be running before you invoke any script that 
requires the service. The exact start method depends on your system and how you
installed docker.

#### Install and Start Docker On Linux
The instructions to install Docker have changed over time. If you have
previously installed Docker, this will be a good time to update your system.
See [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) for a step-by-step walk-through. When complete, `sudo docker run hello-world` should confirm that everything works correctly.

To run Docker without typing `sudo` every time, take a look at Step 2 of [How To Install and Use Docker on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)

#### Install and Start Docker On A Mac
Docker provides a desktop application for Mac at [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) with additional instructions here [Install Docker Desktop on Mac](https://docs.docker.com/docker-for-mac/install/). If you install the Docker Desktop app, you can skip the HomeBrew instructions below. If `docker run hello-world` works, you are ready to Start the local Solana cluster.

If you are using HomeBrew on a Mac, the commands are:

```bash
$ brew install docker
$ brew install docker-machine
# The next two commands to install virtualbox & create a machine may need a
# password. You may also need to address a System Preference setting and
# re-try the installation.
$ brew cask install virtualbox
$ docker-machine create --driver virtualbox default
# To see config info:
$ docker-machine env default
# Port forwarding of 8899 from your OS to the Docker machine:
$ docker-machine ssh default -f -N -L 8899:localhost:8899
# To configure your shell to use the docker-machine
$ eval "$(docker-machine env default)"
```

NOTE: Later, you can run `docker-machine stop default` to stop the docker machine.

Resources for Mac HomeBrew users:
- https://medium.com/@yutafujii_59175/a-complete-one-by-one-guide-to-install-docker-on-your-mac-os-using-homebrew-e818eb4cfc3
- https://stackoverflow.com/questions/32174560/port-forwarding-in-docker-machine