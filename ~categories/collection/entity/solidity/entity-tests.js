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
            title: "Hello World",
            count:  42,
            from: config.owner
        }

        // act
        let txValue = await DappLib.setEntity(entity);
        entity.id = txValue.result.id;
        
        // assert
        let returnValue = (await DappLib.getEntity(entity)).result;

        assert.equal(entity.from, returnValue.creator, "Incorrect creator value");
        assert.equal(entity.title, returnValue.title, "Incorrect title value");
        assert.equal(entity.count.toString(10), returnValue.count.toString(10), "Incorrect count value");

    }
    catch(e) {
        assert.fail(e.message);
    }
});




it(`can update an entity using setEntity()`, async function () {
    try {
        // arrange
        let entity = {
            title: "Hello World",
            count:  42,
            from: config.owner
        }

        let updatedEntity = {
            title: "GoodBye World",
            count: 24,
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
        assert.equal(updatedEntity.title, returnValue.title, "Incorrect title value");
        assert.equal(updatedEntity.count.toString(10), returnValue.count.toString(10), "Incorrect count value");

    }
    catch(e) {
        assert.fail(e.message);
    }
});


///)