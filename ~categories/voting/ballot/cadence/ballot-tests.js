///(test

    describe('Voting — Ballot', async () => {

        it(`can create a new proposal`, async function () {
            try {
                await DappLib.initializeProposals({
                admin: config.accounts[0],
                files: []
                });
                assert.equal(true, true, "Can't create a new proposal");    
            }
            catch(e) {
                assert.fail(e.message);
            }
        });

        it(`can issue a ballot`, async function () {
            try {
                await DappLib.issueBallot({
                    admin: config.accounts[0],
                    voter: config.accounts[1],
                });
                assert.equal(true, true, "Can't issue a ballot");    
            }
            catch(e) {
                assert.fail(e.message);
            }
        });

        it(`can vote`, async function () {
            try {
                await DappLib.vote({
                    voter: config.accounts[1],
                    proposalIndex: [1]
                });
                assert.equal(true, true, "Can't vote");    
            }
            catch(e) {
                assert.fail(e.message);
            }
        });

        it(`can get list of proposals`, async function () {
            try {
                let res = await DappLib.getProposalList({
                    ballotOwner: config.accounts[0],
                });
                let proposals = res.result;
                assert.equal(proposals.length, 1, "Can't get list of proposals");   
            }
            catch(e) {
                assert.fail(e.message);
            }
        });

        it(`should not be able to vote unless ballot is issued`, async function () {
            hasError = false;
            try {
                await DappLib.vote({
                    voter: config.accounts[2],
                    proposalIndex: [1]
                });
            }
            catch {
                hasError = true;
            }
            assert.equal(hasError, true, "Voted without an issued ballot");
        });

        it(`should not be able to vote on a non existent proposal`, async function () {
            hasError = false;
            try {
                await DappLib.vote({
                    voter: config.accounts[1],
                    proposalIndex: [2]
                });
            }
            catch {
                hasError = true;
            }
            assert.equal(hasError, true, "Voted on a non existent proposal");
        });

        it(`should not be able to vote oneself`, async function () {
            hasError = false;
            try {
                await DappLib.vote({
                    voter: config.accounts[0],
                    proposalIndex: [1]
                });
            }
            catch {
                hasError = true;
            }
            assert.equal(hasError, true, "Voted oneself");
        });
    });

///)