import { text } from "express";

///(test

// it(`has correct total supply of tokens using totalSupply()`, async function () {
//     try {
//         let testData1 = {
//             from: config.owner
//         }
//         let supply = (await DappLib.totalSupply(testData1)).result;
//         assert.equal(supply.toString(10), initialSupply.toString(10), "Incorrect total supply");    
//     }
//     catch(e) {
//         assert.fail(e.message);
//     }
// });

it(`can add a new entity using setEntity()`, async function () {
    try {
        // arrange
        let entity = {
            textInfo: "Hello World",
            numericInfo:  42,
            from: config.owner
        }

        // act
        let txValue = await DappLib.setEntity(entity);
        entity.id = txValue.result.id;
        
        // assert
        let returnValue = (await DappLib.getEntity(entity)).result;

        assert.equal(entity.from, returnValue.creator, "Incorrect creator value");
        assert.equal(entity.textInfo, returnValue.textInfo, "Incorrect textInfo value");
        assert.equal(entity.numericInfo.toString(10), returnValue.numericInfo.toString(10), "Incorrect numericInfo value");

    }
    catch(e) {
        assert.fail(e.message);
    }
});




it(`can update an entity using setEntity()`, async function () {
    try {
        // arrange
        let entity = {
            textInfo: "Hello World",
            numericInfo:  42,
            from: config.owner
        }

        let updatedEntity = {
            textInfo: "GoodBye World",
            numericInfo: 24,
            from: config.owner
        }

        // act
        let txValue = await DappLib.setEntity(entity);
        entity.id = txValue.result.id;
        updatedEntity.id = txValue.result.id;

        // assert
        await DappLib.setEntity(updatedEntity);

        let returnValue = (await DappLib.getEntity(entity)).result;

        assert.equal(updatedEntity.from, returnValue.creator, "Incorrect creator value");
        assert.equal(updatedEntity.textInfo, returnValue.textInfo, "Incorrect textInfo value");
        assert.equal(updatedEntity.numericInfo.toString(10), returnValue.numericInfo.toString(10), "Incorrect numericInfo value");

    }
    catch(e) {
        assert.fail(e.message);
    }
});


///)