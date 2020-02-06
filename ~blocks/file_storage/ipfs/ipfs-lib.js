///(import
import ipfsClient from 'ipfs-http-client';
import bs58 from 'bs58';
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
                ipfsHash: file.hash,
                docId: file.docId
            });
        }

        return {
            type: DappLib.DAPP_RESULT_HASH_ARRAY,
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
        if (result.callData && Array.isArray(result.callData)) {
            for(let i=0; i< result.callData.length; i++) {
                result.callData[i] = DappLib.toAscii(result.callData[i]);
            }
        }
        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'Documents',
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
        let result = [];

        let response = await ipfs.add(filesToUpload, options);

        if (response.length && (response.length > 0)) {
            if (wrapWithDirectory) {
                // CID of wrapping directory is returned last
                let folder = response[response.length - 1];
                result.push(Object.assign({ }, folder, DappLib._decodeMultihash(folder.hash)));
            } else {
                for (let f = 0; f < response.length; f++) {
                    let file = response[f];
                    result.push(Object.assign({ }, file, DappLib._decodeMultihash(file.hash)));
                }
            }
        }
        return result;
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


onAddIpfsDocument(fromBlock, callback) {
    let self = this;

    self.dappStateContractWs.events.AddIpfsDocument({
        fromBlock: fromBlock
    }, function (error, e) {
        if (error) {
            callback(error, null);
        } else {
            self.getIpfsDocument(e.returnValues.docId, (error, docDetail) => {

                if (error) {
                    callback(error);
                } else {
                    let docInfo = {
                        docId: docDetail.docId,
                        registrant: docDetail.registrant,
                        url: `${self.options.ipfsGateway.protocol}://${self.options.ipfsGateway.host}/ipfs/${docDetail.ipfsHash}`
                    }
                    callback(error, docInfo);
                }

            });
            // Decode at https://www.rapidtables.com/convert/number/hex-to-ascii.html
        }
    });
}


}