export default class Contract {
    constructor(client, callback) {
        
        this.dappClient = client;
        this.owner = null;
        this.initialize(callback);

    }

    initialize(callback) {
        let self = this;
        self.dappClient.blockchain.getAccounts((error, accounts) => {
            self.owner = accounts[0];
            callback(accounts);
        });
    }

    isActive(callback) {
       let self = this;
       self.dappClient.contract.methods
            .isActive()
            .call({ from: self.owner}, callback);
    }

    addDocument(ipfsHash, owner, callback) {
        let self = this;

        let multihash = self.dappClient.getBytes32FromMultihash(ipfsHash);

        self.dappClient.contract.methods
            .addDocument(multihash.digest, multihash.digest, multihash.hashFunction, multihash.digestLength)
            .send({ from: owner, gas: 1000000 }, (error, result) => {
                callback(error, result, multihash.digest);
            });
    }

    getDocumentsByOwner(owner, callback) {
        let self = this;
        self.dappClient.contract.methods
            .getDocumentsByOwner(owner)
            .call({ from: owner }, (error, result) => {
                callback(error, result);
            });

    }

    getDocument(docId, callback) {
        let self = this;

        self.dappClient.contract.methods
            .getDocument(docId)
            .call({ from: self.owner }, (error, result) => {
                let multihash = {
                    digest: result.docDigest,
                    hashFunction: result.docHashFunction,
                    digestLength: result.docDigestLength
                }

                result.ipfsHash = self.dappClient.getMultihashFromBytes32(multihash);

                callback(error, result);
            });

    }

}