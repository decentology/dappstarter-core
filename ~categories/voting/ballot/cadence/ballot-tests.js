///(test

    describe('Voting — Ballot', async () => {

        it(`can create a new proposal`, async function () {
            try {
                await DappLib.initializeProposals({
                   admin:  config.accounts[0],
                   files: []
                });
                assert.equal(true, true, "Incorrect ...");    
            }
            catch(e) {
                assert.fail(e.message);
            }
        });

        it(`can issue a ballot`, async function () {
            try {
                assert.equal(false, false, "Incorrect ...");    
            }
            catch(e) {
                assert.fail(e.message);
            }
        });
    });

///)