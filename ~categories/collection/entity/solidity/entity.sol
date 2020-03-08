pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)

contract access_control_contract_runstate {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///(using
///)

///(state
    struct EntityData {
        bool exists;
        bytes32 textInfo;
        uint256 numericInfo;
    }

    mapping(address => EntityData) entities;              // Store some data
    address[] entityList;                                   // Entity lookup
///)

///(events
    event EntityAdd(address indexed entity, bytes32 indexed textInfo, uint256 numericInfo);
///)

    constructor() public
    {
///(initialize
///)
    }

///(modifiers
///)

///(functions
    function getEntitiesByPage
                                (
                                    uint256 page, 
                                    uint256 resultsPerPage
                                ) 
                                external 
                                view 
                                returns(address[] memory) 
    {
        /*
            Source: https://medium.codylamson.com/how-to-paginate-smart-contract-array-returns-cd6227479aa3
            ex: _page 1, _resultsPerPage 20 | 1 * 20 - 20 = 0
            ex2: _page 2, _resultsPerPage 20 | 2 * 20 - 20 = 20
            starting point for listing items in array
        */

        uint256 index = resultsPerPage.mul(page).sub(resultsPerPage);

        // Return emptry array if already empty or index is out of bounds
        if ((entityList.length == 0) || (index > entityList.length.sub(1))) {
            return new address[](0);
        }

        // Create fixed length array because we cannot push to array in memory
        address[] memory entityPage = new address[](resultsPerPage);

        
        uint256 returnCounter = 0; 
        
        for(index; index < (resultsPerPage.mul(page)); index++) {
            if (index < (entityList.length.sub(1))) {
                entityPage[returnCounter] = entityList[index];
            } else {
                entityPage[returnCounter] = address(0);
            }

            returnCounter++;
        }

        return entityPage;
    }

    function getEntityData
                        (
                            address entity
                        ) 
                        external 
                        view 
                        returns(bytes32, uint256) 
    {
        return (entities[entity].textInfo, entities[entity].numericInfo);
    }    

    function setEntityData
                        (
                            bytes32 textInfo,
                            uint256 numericInfo   
                        ) 
                        external 
    {
        if (!entities[msg.sender].exists) {
            entityList.push(msg.sender);
            emit EntityAdd(msg.sender, textInfo, numericInfo);
        }

        entities[msg.sender] = EntityData({
                                exists: true,
                                textInfo: textInfo,
                                numericInfo: numericInfo
                            });
    }
///)

}

                 