///(import
const fcl = require('@onflow/fcl');
const ipfsClient = require( 'ipfs-http-client');
const bs58 = require( 'bs58');
///)

class ballot {
    
///(functions
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VOTING: BALLOT  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

static async initializeProposals(data) {

    let folder = true;
    let config = DappLib.getConfig();

    config.ipfs = {
        host: 'ipfs.infura.io',
        protocol: 'https',
        port: 5001
    }

    // Push files to IPFS
    let ipfsResult = await DappLib.ipfsUpload(config, data.files, folder, (bytes) => {
        console.log(bytes);
    });

    let proposals = [];
    for(let f=0; f<ipfsResult.length; f++) {
        let file = ipfsResult[f];
        console.log('IPFS file', file);
        proposals.push(file.cid.string);
    }
    let proposalList = `["${proposals.join('","')}"]`;

    let result = await Blockchain.post({
            config: config,
            contract: DappLib.DAPP_STATE_CONTRACT,
            params: {
                proposer: data.admin,
            }
        },
        fcl.transaction`
        import ${p => p.contractName} from ${p => p.contractOwner}            
        transaction {
            prepare(admin: AuthAccount) {

                // borrow a reference to the admin Resource
                let adminRef = admin.borrow<&${p => p.contractName}.Administrator>(from: /storage/VotingAdmin)!
                
                // Call the initializeProposals function
                // to create the proposals array as an array of strings
                adminRef.initializeProposals(
                    ${p => p.proposalList}
                )
            }
        }`,
        {
            proposalList
        }
    );

    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}

static async issueBallot(data) {

    let result = await Blockchain.post({
            config: DappLib.getConfig(),
            contract: DappLib.DAPP_STATE_CONTRACT,
            params: {
                proposer: data.admin,
                authorizers: [ data.voter ]
            }
        },
        fcl.transaction`
        import ${p => p.contractName} from ${p => p.contractOwner}            
        transaction {
            prepare(admin: AuthAccount, voter: AuthAccount) {

                // borrow a reference to the admin Resource
                let adminRef = admin.borrow<&${p => p.contractName}.Administrator>(from: /storage/VotingAdmin)!
                
                // create a new Ballot by calling the issueBallot
                // function of the admin Reference
                let ballot <- adminRef.issueBallot()
        
                // store that ballot in the voter's account storage
                voter.save(<-ballot, to: /storage/Ballot)
            }
        }`
    );

    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}


static async vote(data) {

    let result = await Blockchain.post({
            config: DappLib.getConfig(),
            contract: DappLib.DAPP_STATE_CONTRACT,
            params: {
                proposer: data.voter
            }
        },
        fcl.transaction`
        import ${p => p.contractName} from ${p => p.contractOwner}            
        transaction {
            prepare(voter: AuthAccount) {

                // take the voter's ballot our of storage
                let ballot <- voter.load<@${p => p.contractName}.Ballot>(from: /storage/Ballot)!
        
                // Vote on the proposal 
                ballot.vote(proposal: ${p => p.proposalIndex})
        
                // Cast the vote by submitting it to the smart contract
                ${p => p.contractName}.cast(ballot: <-ballot)
            }
        }`,
        {
            proposalIndex: data.proposalIndex
        }
    );

    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}


static async ipfsUpload(config, files, wrapWithDirectory, progressCallback) {

    let ipfs = ipfsClient(config.ipfs);
    let filesToUpload = [];
    files.map((file) => {
        filesToUpload.push({
            path: file.name,
            content: file
        })
    });
    const options = {
        wrapWithDirectory: wrapWithDirectory,
        pin: true,
        progress: progressCallback
    }
    let results = [];

    for await (const result of ipfs.add(filesToUpload, options)) {
        if (wrapWithDirectory && result.path !== "") {
            continue;
        }
        results.push(
            Object.assign({}, result, DappLib._decodeMultihash(result.cid.string))
        );
    }

    return results;
}

static formatIpfsHash(a) {
    let config = DappLib.getConfig();
    let url = `${config.ipfs.protocol}://${config.ipfs.host}/ipfs/${a}`;
    return `<strong class="teal lighten-5 p-1 black-text number copy-target" title="${url}"><a href="${url}" target="_new">${a.substr(0,6)}...${a.substr(a.length-4, 4)}</a></strong>${ DappLib.addClippy(a)}`;
}

/**
 * Partition multihash string into object representing multihash
 * https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
 */
static _decodeMultihash(multihash) {
    const decoded = bs58.decode(multihash);

    return {
        digest: `0x${decoded.slice(2).toString('hex')}`,
        hashFunction: decoded[0],
        digestLength: decoded[1],
    };
}



///)
}