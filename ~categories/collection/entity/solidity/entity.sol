pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)

contract access_control_contract_runstate {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)

///(state
    struct EntityData {
        bool exists;
        bytes32 id;
        address creator;
        bytes32 title;
        uint256 count;
    }

    mapping(bytes32 => EntityData) entities;                // Store some data
    bytes32[] public entityList;                            // Entity lookup

    mapping(address => bytes32[]) public entitiesByCreator; // Entities for which an account is the creator

    mapping(uint256 => bytes32[]) public entitiesByPage;    // Entities organized by page
    uint constant ENTITIES_DOCS_PAGE_SIZE = 50;
    uint256 public entitiesLastPage = 0;

///)

///(events

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> COLLECTION: ENTITY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // Event fired when Entity is added
    event EntityAdd
                    (
                        bytes32 indexed id, 
                        address indexed entity, 
                        bytes32 indexed title, 
                        uint256 count
                    );

    // Event fired when Entity is updated
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

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> COLLECTION: ENTITY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    /**
    * @dev Gets Entities by page
    *
    * @param page Page number you want to retrieve
    * @param resultsPerPage Amount of Entities displayed per page
    */
    function getEntitiesByPage
                                (
                                    uint256 page, 
                                    uint256 resultsPerPage
                                ) 
                                external 
                                view 
                                returns(bytes32[] memory) 
    {

        return DappLib.getItemsByPage(page, resultsPerPage, entityList);
    }

    /**
    * @dev Gets the amount of Entities in the collection
    */
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

    /**
    * @dev Gets a single Entity by id
    *
    * @param id Id of an Entity
    */
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

    /**
    * @dev Gets all Entities of a specific creator
    *
    * @param account Address of creator's account 
    */
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

    /**
    * @dev Sets an Entity
    *
    * @param id Unique identifier 
    * @param title Title of Entity
    * @param count Numeric value of Entity
    */
    function setEntity
                        (
                            bytes32 id,
                            bytes32 title,
                            uint256 count   
                        ) 
                        external 
                        requireContractAdmin
    {
        // Prevent empty Id field
        require(id[0] != 0, "entity Id cannot be empty");

        // Add Entity if it does not exist, otherwise update the existing Entity
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

                 