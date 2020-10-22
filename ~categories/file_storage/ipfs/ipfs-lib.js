///(import
const ipfsClient = require( 'ipfs-http-client');
const bs58 = require( 'bs58');
///)

class ipfs {

///(functions
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: IPFS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static async addIpfsDocument(data) {

        let folder = data.mode === 'folder';
        let config = DappLib.getConfig();

        if (data.mode === 'single') {
            data.files = data.files.slice(0, 1);
        }
        // Push files to IPFS
        let ipfsResult = await DappLib.ipfsUpload(config, data.files, folder, (bytes) => {
           // console.log(bytes);
        });
        let results = [];
        for(let f=0; f<ipfsResult.length; f++) {
            let file = ipfsResult[f];
            file.docId = file.digest.substr(2, 16);

            let result = await Blockchain.post({
                    config: config,
                    contract: DappLib.DAPP_STATE_CONTRACT,
                    params: {
                        from: null,
                        gas: 2000000
                    }
                },
                'addIpfsDocument',
                DappLib.fromAscii(file.docId, 32),
                DappLib.fromAscii(data.label || '', 32),
                file.digest,
                file.hashFunction,
                file.digestLength
            );

            results.push({
                transactionHash: DappLib.getTransactionHash(result.callData),
                ipfsHash: file.cid.string,
                docId: file.docId
            });
        }

        return {
            type: DappLib.DAPP_RESULT_IPFS_HASH_ARRAY,
            result: results
        }
    }

    static async getIpfsDocument(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                contract: DappLib.DAPP_STATE_CONTRACT,
                params: {
                    from: null
                }
            },
            'getIpfsDocument',
            DappLib.fromAscii(data.id, 32)
        );
        if (result.callData) {
            result.callData.docId = DappLib.toAscii(result.callData.docId);
            result.callData.docMultihash = DappLib._encodeMultihash({
                                                digest: result.callData.docDigest,
                                                hashFunction: Number(result.callData.docHashFunction),
                                                digestLength: Number(result.callData.docDigestLength)
                                        });
            result.callData.docUrl = DappLib.formatIpfsHash(result.callData.docMultihash);
            result.callData.label = DappLib.toAscii(result.callData.label);
        }
        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Document Information',
            result: result.callData
        }
    }

    static async getIpfsDocumentsByOwner(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                contract: DappLib.DAPP_STATE_CONTRACT,
                params: {
                    from: null
                }
            },
            'getIpfsDocumentsByOwner',
            data.account
        );
        let asciiCallData = [];
        if (result.callData && Array.isArray(result.callData)) {
            for(let i=0; i< result.callData.length; i++) {
                asciiCallData.push(DappLib.toAscii(result.callData[i]));
            }
        }
        
        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'Documents',
            result: asciiCallData,
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

    static async onAddIpfsDocument(callback) {
        let params = {};
        DappLib.addEventHandler(DappLib.DAPP_STATE_CONTRACT_WS, 'AddIpfsDocument', params, callback);
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

    /**
     * Encode a multihash structure into base58 encoded multihash string
     * https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
     */
    static _encodeMultihash(encodedMultihash) {
        const {
            digest,
            hashFunction,
            digestLength
        } = encodedMultihash;
        if (digestLength === 0) return null;

        // cut off leading "0x"
        const hashBytes = Buffer.from(digest.slice(2), 'hex');

        // prepend hashFunction and digest length
        const multihashBytes = new(hashBytes.constructor)(2 + hashBytes.length);
        multihashBytes[0] = hashFunction;
        multihashBytes[1] = digestLength;
        multihashBytes.set(hashBytes, 2);

        return bs58.encode(multihashBytes);
    }

///)

    static serverEvent() {
///(server-event
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
DappLib.onAddIpfsDocument((result) => {
        console.log(result);
});
///)
    }

///(test
                ,ipfsTestFiles: [
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
///)


}