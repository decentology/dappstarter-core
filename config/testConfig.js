
const DappContract = artifacts.require('Dapp');
const DappMainContract = artifacts.require('DappMain');
const bs58 = require('bs58');

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

    let dappMainContract = await DappMainContract.new();
    let dappContract = await DappContract.new(dappMainContract.address);

    
    return {
        owner: accounts[0],
        admin1: accounts[1],
        admin2: accounts[2],
        admin3: accounts[3],
        user1: accounts[4],
        user2: accounts[5],
        user3: accounts[6],
        accounts: accounts,
        testAddresses: testAddresses,
        testFolders: ipfsTestFolders,
        dappContract: dappContract,
        dappMainContract: dappMainContract,
        ipfs: IPFS,
        getBytes32FromMultihash: (multihash) => {
            const decoded = bs58.decode(multihash);
        
            return {
            digest: `0x${decoded.slice(2).toString('hex')}`,
            hashFunction: decoded[0],
            digestLength: decoded[1],
            };
        },
        getMultihashFromBytes32: (multihash) => {
            const { digest, hashFunction, digestLength } = multihash;
            if (digestLength === 0) return null;
        
            // cut off leading "0x"
            const hashBytes = Buffer.from(digest.slice(2), 'hex');
        
            // prepend hashFunction and digest length
            const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
            multihashBytes[0] = hashFunction;
            multihashBytes[1] = digestLength;
            multihashBytes.set(hashBytes, 2);
        
            return bs58.encode(multihashBytes);
        }
    }
}

module.exports = {
    Config: Config
};