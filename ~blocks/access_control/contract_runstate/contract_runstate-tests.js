///(test

    it(`has correct contract run state`, async function () {
        try {
            let testData1 = {
                from: config.owner
            }
            let runState = (await DappLib.isContractRunStateActive(testData1)).result;
            assert.equal(runState, true, "Incorrect contract run state");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`can change contract run state by calling setContractRunState()`, async function () {
        try {
            let testData1 = {
                from: config.owner,
                mode: false
            }
            await DappLib.setContractRunState(testData1);
            let runState = (await DappLib.isContractRunStateActive()).result;
            assert.equal(runState, false, "Incorrect contract run state");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

///)