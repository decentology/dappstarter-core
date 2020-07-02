

///(functions

      // Declare the NFT resource type
      pub resource NFT {

        pub let nftKey: String
        pub let score: UInt64
        pub let emoji: String

        // Initialize both fields in the init function
        init(nftKey: String, score: UInt64, emoji: String) {
            self.nftKey = nftKey
            self.score = score
            self.emoji = emoji
        }
      }

    // We define this interface purely as a way to allow users
    // to create public, restricted references to their NFT Collection.
    // They would use this to only expose the deposit, getIDs,
    // and idExists fields in their Collection
    pub resource interface NFTReceiver {

        pub fun deposit(token: @NFT)

        pub fun getKeys(): [String]

        pub fun keyExists(nftKey: String): Bool
    }

    // The definition of the Collection resource that
    // holds the NFTs that a user owns
    pub resource Collection: NFTReceiver {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with a String key field
        pub var ownedNFTs: @{String: NFT}

        // Initialize the NFTs field to an empty collection
        init () {
            self.ownedNFTs <- {}
        }

        // Function that removes an NFT from the collection 
        // and moves it to the calling context
        pub fun withdraw(nftKey: String): @NFT {
            // If the NFT isn't found, the transaction panics and reverts
            let token <- self.ownedNFTs.remove(key: nftKey)!

            return <-token
        }

        // Function that takes a NFT as an argument and 
        // adds it to the collections dictionary
        pub fun deposit(token: @NFT) {
            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[token.nftKey] <- token
            destroy oldToken
        }

        // idExists checks to see if a NFT 
        // with the given key exists in the collection
        pub fun keyExists(nftKey: String): Bool {
            return self.ownedNFTs[nftKey] != nil
        }

        // getIDs returns an array of the keys that are in the collection
        pub fun getKeys(): [String] {
            return self.ownedNFTs.keys
        }

        // If a resource has member fields that are resources,
        // it is required to define a `destroy` block to specify
        // what should happen to those member fields
        // if the top level object is destroyed
        destroy() {
            destroy self.ownedNFTs
        }
    }

    // creates a new empty Collection resource and returns it 
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // NFTMinter
    //
    // Resource that would be owned by an admin or by a smart contract 
    // that allows them to mint new NFTs when needed
    pub resource NFTMinter {

        init() {
        }

        // Function that mints a new NFT with a new ID
        // and deposits it in the recipients collection 
        // using their collection reference
        pub fun mintNFT(recipient: &AnyResource{NFTReceiver}, newKey: String, newScore: UInt64, newEmoji: String) {

            // create a new NFT
            var newNFT <- create NFT(nftKey: newKey, score: newScore, emoji: newEmoji)

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)
        }
    }
///)

///(initialize

        // store an empty NFT Collection in account storage
        self.account.save<@Collection>(<-self.createEmptyCollection(), to: /storage/NFTCollection)

        // publish a reference to the Collection in storage
        self.account.link<&{NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)

        // store a minter resource in account storage
        self.account.save<@NFTMinter>(<-create NFTMinter(), to: /storage/NFTMinter)

///)