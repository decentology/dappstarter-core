import DappState from 0x0            
transaction {

    let proposalVotes: [UInt64]

    prepare(voter: AuthAccount) {

        self.proposalVotes = []  // Placeholder...replaced at run-time

        // take the voter's ballot our of storage
        let ballot <- voter.load<@DappState.Ballot>(from: /storage/Ballot)!

        // Vote on the proposal 
        for proposal in self.proposalVotes {
            ballot.vote(proposal: proposal)
        }

        // Cast the vote by submitting it to the smart contract
        DappState.cast(ballot: <-ballot)
    }
}