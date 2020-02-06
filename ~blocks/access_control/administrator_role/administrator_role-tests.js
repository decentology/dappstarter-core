///(test

    it(`has correct contract administrator`, async function () {
        try {
            let testData1 = {
                from: config.owner,
                account: config.owner
            }
            let isAdmin = (await DappLib.isContractAdmin(testData1)).result;
            assert.equal(isAdmin, true, "Incorrect contract administrator value");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`can add administrator by calling addContractAdmin()`, async function () {
        try {
            let testData1 = {
                from: config.owner,
                account: config.admins[0]
            }
            await DappLib.addContractAdmin(testData1);
            let isAdmin = (await DappLib.isContractAdmin(testData1)).result;
            assert.equal(isAdmin, true, "Incorrect contract administrator value");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

    it(`can remove administrator by calling removeContractAdmin()`, async function () {
        try {
            let testData1 = {
                from: config.owner,
                account: config.admins[0]
            }
            await DappLib.removeContractAdmin(testData1);
            let isAdmin = (await DappLib.isContractAdmin(testData1)).result;
            assert.equal(isAdmin, false, "Incorrect contract administrator value");    
        }
        catch(e) {
            assert.fail(e.message);
        }
    });

///)