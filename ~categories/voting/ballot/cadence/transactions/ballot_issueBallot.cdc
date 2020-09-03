transaction {
    prepare(admin: AuthAccount, voter: AuthAccount) {
  
        // borrow a reference to the admin Resource
        let adminRef = admin.borrow<&DappState.Administrator>(from: /storage/VotingAdmin)!
        
        // create a new Ballot by calling the issueBallot
        // function of the admin Reference
        let ballot <- adminRef.issueBallot()

        // store that ballot in the voter's account storage
        voter.save(<-ballot, to: /storage/Ballot)
    }
} 