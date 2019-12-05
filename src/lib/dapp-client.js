'use strict';
import Config from '../lib/config.json';
import bs58 from 'bs58';
import ipfsClient from 'ipfs-http-client';
import DappContract from '../../build/contracts/Dapp.json';

import Web3 from 'web3';
//import Caver from 'caver-js';

export default class DappClient {

    constructor(options) {
        this.options = options || {};

        this.config = Config[options.config || 'localhost'];
        let provider;
        let core;

        let platform;
        
        platform= 'Ethereum';
        // platform = 'Klaytn';

        switch(platform) {
          case "Ethereum": 
                  // Ethereum
                  provider = options.server ? 
                                    new Web3.providers.WebsocketProvider(this.config.url.replace('http', 'ws')) 
                                  : new Web3.providers.HttpProvider(this.config.url);

                  core = new Web3(provider);
                  this.blockchain = core.eth;
                  break;

          case "Klaytn":
                  // Klaytn
                  provider = options.server ? 
                                    new Caver.providers.WebsocketProvider(this.config.url.replace('http', 'ws')) 
                                  : new Caver.providers.HttpProvider(this.config.url);

                  core = new Caver(provider);
                  this.blockchain = core.klay;
                  break;
        }

        
        this.contract = new this.blockchain.Contract(DappContract.abi, this.config.appAddress);
    }

    /**
     * Partition multihash string into object representing multihash
     * // https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
     * @param {string} multihash A base58 encoded multihash string
     * @returns {Multihash}
     */
    getBytes32FromMultihash(multihash) {
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
    getMultihashFromBytes32(multihash) {
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

    async ipfsUpload (files, ipfsHost, wrap, progressCallback, callback) {
      let ipfs = ipfsClient(ipfsHost); 

      let filesToUpload = [];
      files.map((file) => {
        filesToUpload.push({
          path: file.name,
          content: file
        })
      });
      const options = {
        wrapWithDirectory: wrap,
        pin: true,  
        progress: (bytes) => {
          console.log(bytes);
            progressCallback(bytes);
        }
      }
      let response = await ipfs.add(filesToUpload, options);
      //console.log('IPFS upload response', response);
      

      // CID of wrapping directory is returned last
      let result = {
        folder: null,
        files: []
      }
      if (response.length && (response.length > 0)) {
        if (wrap) {
          result.folder = response[response.length - 1].hash;
          response.pop();
        } else {
          result.folder = null;
        }
        for(let f=0; f<response.length; f++) {
          result.files.push(response[f]);
        }
      }
      callback(result); 
  }
  
    

}