import DappState from 0x0

transaction {

    let proposals: [String]

    prepare(admin: AuthAccount) {

        self.proposals = ["Testing"]
        
        // borrow a reference to the admin Resource
        let adminRef = admin.borrow<&DappState.Administrator>(from: /storage/VotingAdmin)!
        
        // Call the initializeProposals function
        // to create the proposals array as an array of strings
        adminRef.initializeProposals(self.proposals)
    }
}