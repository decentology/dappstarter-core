
transaction(proposalVotes: [UInt64]) {

    prepare(voter: AuthAccount) {

        // take the voter's ballot our of storage
        let ballot <- voter.load<@DappState.Ballot>(from: /storage/Ballot)!

        // Vote on the proposal 
        for proposalVote in self.proposalVotes {
            ballot.vote(proposal: proposalVote)
        }

        // Cast the vote by submitting it to the smart contract
        DappState.cast(ballot: <-ballot)
    }
}