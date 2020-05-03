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
        bytes32 id;
        address creator;
        bytes32 title;
        uint256 count;
    }

    mapping(bytes32 => EntityData) entities;              // Store some data
    bytes32[] public entityList;                                   // Entity lookup

    mapping(address => bytes32[]) public entitiesByCreator; 

    mapping(uint256 => bytes32[]) public entitiesByPage;   
    uint constant ENTITIES_DOCS_PAGE_SIZE = 50;
    uint256 public entitiesLastPage = 0;

///)

///(events
    event EntityAdd
                    (
                        bytes32 indexed id, 
                        address indexed entity, 
                        bytes32 indexed title, 
                        uint256 count
                    );

    event EntityUpdate
                    (
                        bytes32 indexed id, 
                        address indexed entity, 
                        bytes32 indexed title, 
                        uint256 count
                    );
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
                                returns(bytes32[] memory) 
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
            return new bytes32[](0);
        }

        // Create fixed length array because we cannot push to array in memory
        bytes32[] memory entityPage = new bytes32[](resultsPerPage);

        
        uint256 returnCounter = 0; 
        
        for(index; index < (resultsPerPage.mul(page)); index++) {
            if (index < (entityList.length.sub(1))) {
                entityPage[returnCounter] = entityList[index];
            } else {
                entityPage[returnCounter] = bytes32(0);
            }

            returnCounter++;
        }

        return entityPage;
    }

    function getEntityCount
                        (
                        ) 
                        external 
                        view 
                        returns(
                            uint256 entityCount
                        )


    {
         entityCount = entityList.length;
    }    


    function getEntity
                        (
                            bytes32 id
                        ) 
                        external 
                        view 
                        returns(
                            address creator, 
                            bytes32 title, 
                            uint256 count
                        )


    {
         creator = entities[id].creator;
         title = entities[id].title;
         count = entities[id].count;
    }    

    function getEntitiesByCreator
                        (
                            address account
                        )
                        external
                        view
                        returns(bytes32[] memory)
    {
        require(account != address(0), "Invalid account");

        return entitiesByCreator[account];
    }

    function getMyEntities
                        (
                        )
                        external
                        view
                        returns(bytes32[] memory)
    {

        return entitiesByCreator[msg.sender];
    }



    function setEntity
                        (
                            bytes32 id,
                            bytes32 title,
                            uint256 count   
                        ) 
                        external 
                        requireContractAdmin
    {
        require(id[0] != 0, "entity Id cannot be empty");

        // bytes32 id = keccak256(abi.encodePacked(msg.sender, now, title));
        if (!entities[id].exists) {
            require(title[0] != 0, "title cannot be empty");

            entityList.push(id);
            entitiesByCreator[msg.sender].push(id);

            if (entitiesByPage[entitiesLastPage].length == ENTITIES_DOCS_PAGE_SIZE) {
                entitiesLastPage++;
            }
            entitiesByPage[entitiesLastPage].push(id);
            emit EntityAdd(id, msg.sender, title, count);
        }else {
            emit EntityUpdate(id, msg.sender, title, count);
        }

        entities[id] = EntityData({
                                exists: true,
                                id: id,
                                creator: msg.sender,
                                title: title,
                                count: count
                            });
    }

///)

}

                 