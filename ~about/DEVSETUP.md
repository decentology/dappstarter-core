# Developer Setup

In order to develop and test the scaffold for DappStarter you need to have a specific folder setup:

(root folder)
   |
   +- hypergrep - [DappStarter - Hypergrep](https://github.com/trycrypto/dappstarter-hypergrep)
   |
   +- scaffold  - [DappStarter - Scaffold](https://github.com/trycrypto/dappstarter-scaffold)
   |
   +- output - This is the folder in which output projects are written
        |
        +- stage-dapp - This is the fixed folder for output during development.
                        If you don't use this fixed folder, development will be
                        a huge pain because hypergrep generates a unique folder
                        name for each project it generates.

# Developer Environment

Due to the multiple blockchains, languages and feature blocks in one place in this repo, it isn't intended to be used for development. In fact, you don't even need to ever run "npm install" for this project.

You will need to open three instances of your code editor in order to develop.

   a. This repo. We'll call this editor "Scaffold."

   b. The "DappStarter - Hypergrep" repo. We'll call this editor "Hypergrep."

   c. The "(root)/output/stage-dapp" folder. We'll call this editor "Project."

   The basic Scaffold Feature Development Workflow (SFDW) is as follows:

   - Make changes in Scaffold
   - Generate output using a test script in Hypergrep
   - Deploy and test the generated output in Project
   - Rinse and repeat

# Software Feature Development Workflow (SFDW)

When starting SFDW for a new feature, here's the process you should follow:

1) Create a new branch. This is important so all the modifications associated with your SFDW can be isolated.

2) In Scaffold, add a new test input JSON file in "~inputs" which contains the minimal configuration necessary to test your feature. It is often easiest to copy and modify an existing test input. Each line in the input represents a choice made by the user in the DappStarter UI.

3) If your test input is "eth-widget.json," use `npm run test stage eth-widget` in Hypergrep. This should produce new output in Project. It's a good idea to delete all the contents of Project before running a test so you can verify that the output is working correctly.

Pro tip: When deleting the contents of Project, skip the "node_modules" folder (unless you are changing dependencies). This will save time as you can skip the dependency installation time sink.

4) Run scripts as appropriate in Project and test smart contract compilation/migration, smart contract tests, client dapp and server API code.
