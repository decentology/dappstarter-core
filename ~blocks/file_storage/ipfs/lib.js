///(import
import ipfsClient from 'ipfs-http-client';
///)

///(functions

addIpfsDocument(ipfsFolderHash, ipfsFileHash, user, callback) {
    let self = this;

    let folderHash = DappLib.getBytes32FromMultihash(ipfsFolderHash);
    let fileHash = DappLib.getBytes32FromMultihash(ipfsFileHash);

    self.dappMainContract.methods
      .register(user, fileHash.digest, folderHash.digest, folderHash.hashFunction, folderHash.digestLength)
      .send({
        from: user,
        gas: 1000000
      }, (error, result) => {
        callback(error, result, fileHash.digest);
      });
  }


  getIpfsDocumentsByOwner(owner, callback) {
    let self = this;
    self.dappMainContract.methods
      .getIpfsDocumentsByOwner(owner)
      .call({
        from: owner
      }, (error, result) => {
        callback(error, result);
      });

  }

  getIpfsDocument(docId, callback) {
    let self = this;

    self.dappMainContract.methods
      .getIpfsDocument(docId)
      .call({
        from: self.owner
      }, (error, result) => {
        if (error) {
          callback(error);
        } else {

          let multihash = {
            digest: result.audioDigest,
            hashFunction: result.audioHashFunction,
            digestLength: result.audioDigestLength
          }

          result.ipfsHash = DappLib.getMultihashFromBytes32(multihash);

          callback(error, result);
        }
      });
  }


  onAddIpfsDocument(fromBlock, callback) {
    let self = this;

    self.dappMainContractWs.events.AddIpfsDocument({
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


  /**
   * Partition multihash string into object representing multihash
   * // https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
   * @param {string} multihash A base58 encoded multihash string
   * @returns {Multihash}
   */
  static getBytes32FromMultihash(multihash) {
    const decoded = bs58.decode(multihash);

    return {
      digest: `0x${decoded.slice(2).toString('hex')}`,
      hashFunction: decoded[0],
      digestLength: decoded[1],
    };
  }

  /**
   * Encode a multihash structure into base58 encoded multihash string
   * // https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
   * @param {Multihash} multihash
   * @returns {(string|null)} base58 encoded multihash string
   */
  static getMultihashFromBytes32(multihash) {
    const {
      digest,
      hashFunction,
      digestLength
    } = multihash;
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

  async ipfsUpload(files, progressCallback, callback) {
    let self = this;
    let ipfs = ipfsClient(self.options.ipfsGateway);

    let filesToUpload = [];
    files.map((file) => {
      filesToUpload.push({
        path: file.name,
        content: file
      })
    });
    const options = {
      wrapWithDirectory: true,
      pin: true,
      progress: (bytes) => {
        progressCallback(bytes);
      }
    }
    let result = {
      folder: null,
      files: []
    }

    let response = await ipfs.add(filesToUpload, options);
    //console.log('IPFS upload response', response);

    // CID of wrapping directory is returned last
    if (response.length && (response.length > 0)) {
      result.folder = response[response.length - 1].hash;
      for (let f = 0; f < response.length - 1; f++) {
        result.files.push(response[f]);
      }
    }
    callback(result);
  }

///)