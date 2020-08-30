///(import
const ipfsClient = require( 'ipfs-http-client');
const bs58 = require( 'bs58');
const t = require('@onflow/types');
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

    let result = await Blockchain.post({
            config: config,
            imports: {
                DappState: data.admin
            },
            roles: {
                proposer: data.admin,
            }
        },
        'ballot_initializeProposals',
        {
            proposals: `["${proposals.join('","')}"]`            
        }
    );
    let accounts = DappLib.getAccounts();
    console.log(accounts);
    DappLib.getProposalList({
      ballotOwner: accounts[0]
    });
    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}

static async issueBallot(data) {

    let result = await Blockchain.post({
            config: DappLib.getConfig(),
            imports: {
                DappState: data.admin
            },
            roles: {
                proposer: data.admin,
                authorizers: [ data.admin, data.voter ]
            }
        },
        'ballot_issueBallot'
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
            imports: {
                DappState: data.voter
            },
            roles: {
                proposer: data.voter
            }
        },
        'ballot_vote',
        {
            proposalVotes: [data.proposalIndex]
        }
    );

    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}

static async getProposalList(data) {

    console.log('Calling proposalList', data)
    let result = await Blockchain.get({
            config: DappLib.getConfig(),
            imports: {
                DappState: data.ballotOwner
            },
            roles: {
            }
        },
        'ballot_proposalList'
    );

    console.log('ProposalList Result', result);
    return {
        type: DappLib.DAPP_RESULT_ARRAY,
        label: 'Proposals',
        result: result.callData,
        formatter: ['Text-20-5']
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