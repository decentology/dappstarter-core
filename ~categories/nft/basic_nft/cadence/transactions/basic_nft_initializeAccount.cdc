
transaction {
    prepare(acct: AuthAccount) {

        // Delete any existing collection
        let existing <- acct.load<@DappState.Collection>(from: /storage/NFTCollection)
        destroy existing

        // Create a new empty collection
        let collection <- DappState.createEmptyCollection()

        // store the empty NFT Collection in account storage
        acct.save<@DappState.Collection>(<-collection, to: /storage/NFTCollection)

        // create a public capability for the Collection
        acct.link<&DappState.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)

        // TODO: Event handling is not fully implemented
        //emit DappState.InitializeAccount(acct.address : String)

    }
}