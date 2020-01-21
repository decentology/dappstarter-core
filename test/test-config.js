
const DappContract = artifacts.require('Dapp');
const DappStateContract = artifacts.require('DappState');

/**
* @dev Config provides test scripts with contract, account and other
*      test values. Each test script calls Config before any tests
*      are run ensuring a baseline with fresh deployment of contracts.
*      Compare to /src/dapp-config.json which also has configuration
*      information, but that file has the contract address based on
*      the last migration which isn't suitable for testing as its
*      state would be unknown.
*/
const Config = async function(accounts) {
    
    let dappStateContract = await DappStateContract.new();
    let dappContract = await DappContract.new(dappStateContract.address);
    
    return {
        dappContract: dappContract,
        dappStateContract: dappStateContract,
        owner: accounts[0],
        admins: [
            accounts[1],
            accounts[2],
            accounts[3]
        ],
        users: [
            accounts[4],
            accounts[5],
            accounts[6],
            accounts[7],
            accounts[8]
        ],
        accounts: accounts,
        testAddresses: [
            // These test addresses are useful when you need to add random accounts in test scripts
            "0xb1ac66b49fdc369879123332f2cdd98caad5f75a",
            "0x0d27a7c9850f71d7ef71ffbe0155122e83d9455d",
            "0x88477a8dc34d60c40b160e9e3b1721341b63c453",
            "0x2880e2c501a70f7db1691a0e2722cf6a8a9c9009",
            "0x0226df61d33e41b90be3b5fd830bae303fcb66f5",
            "0x60a4dff3d25f4e5a5480fb91d550b0efc0e9dbb3",
            "0xa2f52a2060841cc4eb4892c0234d2c6b6dcf1ea9",
            "0x71b9b9bd7b6f72d7c0841f38fa7cdb840282267d",
            "0x7f54a3318b2a728738cce36fc7bb1b927281c24e",
            "0x81b7E08F65Bdf5648606c89998A9CC8164397647"
        ],
        ipfs: {
            host: 'ipfs.infura.io',
            protocol: 'https',
            port: 5001
        },
        ipfsTestFiles: [
            "QmaWf4HjxvCH5W8Cm8AoFkSNwPUTr3VMZ3uXp8Szoqun53",
            "QmTrjnQTaUfEEoJ8DgsDG2A8AqsiN5bSV62q98tWkZMU2D",
            "QmSn26zrUd5CbuNoBPwGhPrktLv94rPiZxNmkHx5smTYj3",
            "QmTy9aLjFxV8sDK7GEp8uR1zC8ukq3NrV6aSNxjvBTTcqu",
            "QmWJU1FQghgi69VSDpEunEwemPDFqmBvXzp8b9DxKHP7QQ",
            "QmYT1ejAMbG2fP7AMdH2Pi2QpQRxQXBUC3CbENzpY2icok",
            "QmQJh3yLX9z6dmKbFhCyGsZrUEtRXeurcDG39eXbkwQG7C",
            "QmWRYExBZgZ67R43jW2vfwL3Hio78JaR7Vq3ouiJTsZ6qw",
            "QmWwPLQVVJizkwwiqPcknBUnRH359TfbusHpVGZtWNGMxu",
            "QmbtFKnBuyUmRoFh9EueP2r6agYpwGJwG4VBikQ4wwjGAY"
        ]
    }
}

module.exports = {
    Config: Config
};