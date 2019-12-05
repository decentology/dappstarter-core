
const DappContract = artifacts.require('Dapp');
const BigNumber = require('bignumber.js');
const IPFS = require('./ipfsConfig.js');

const Config = async function(accounts) {
    
    // These test addresses are useful when you need
    //  to add multiple users in test scripts
    let testAddresses = [
        "0xb1ac66b49fdc369879123332f2cdd98caad5f75a",
        "0x0d27a7c9850f71d7ef71ffbe0155122e83d9455d",
        "0x88477a8dc34d60c40b160e9e3b1721341b63c453",
        "0x2880e2c501a70f7db1691a0e2722cf6a8a9c9009",
        "0x0226df61d33e41b90be3b5fd830bae303fcb66f5",
        "0x60a4dff3d25f4e5a5480fb91d550b0efc0e9dbb3",
        "0xa2f52a2060841cc4eb4892c0234d2c6b6dcf1ea9",
        "0x71b9b9bd7b6f72d7c0841f38fa7cdb840282267d",
        "0x7f54a3318b2a728738cce36fc7bb1b927281c24e"
    ];

    let ipfsTestFolders = [
        "QmewJEnfbftDvFT75BAtoLH2AA1auUi5wbS6pncGHnskKo",
        "Qmb5m6GV3SVQawc1AUXAsLYvp7noQLA6taKfuJhpaZf18f",
        "QmZ3tKt6f5nPStM8dYaxhnrX6cBayxL3frucaRo8z4vvcU",
        "QmbMREn4Vrtyz4Xge79igsap6zJk7vaH7YFc2P9nhuNm9q",
        "QmekUmdv161ctqWqxqdD1cp8tXrrT5HZzS3JvxbHmpD4RR"
    ]


    let owner = accounts[0];

    let dappContract = await DappContract.new();

    
    return {
        owner: owner,
        accounts: accounts,
        testAddresses: testAddresses,
        testFolders: ipfsTestFolders,
        dappContract: dappContract,
        ipfs: IPFS
    }
}

module.exports = {
    Config: Config
};