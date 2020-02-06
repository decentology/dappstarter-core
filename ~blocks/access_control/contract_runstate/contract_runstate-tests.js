///(test

    it(`has correct contract run state`, async function () {
        try {
            let runState = (await DappLib.isContractRunStateActive()).result;
            assert.equal(runState, true, "Incorrect contract run state");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`has correct contract run state after calling setContractRunState()`, async function () {
        try {
            let testData1 = {
                from: config.owner,
            }
            await DappLib.setContractRunState(false);
            let runState = (await DappLib.isContractRunStateActive()).result;
            assert.equal(runState, false, "Incorrect contract run state");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

///)