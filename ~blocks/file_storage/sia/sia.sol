pragma solidity  >=0.5.0;
pragma experimental ABIEncoderV2;

import "../../../contracts/DappLib.sol";
///(import
///)

contract file_storage__sia {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///(using

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
///)

///(state

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    struct SiaDocument {
        string docId;    

        bytes32 label;

        // Registration timestamp                                          
        uint256 timestamp;  

        // Owner of document                                        
        address owner;    
    }

    // All added documents
    mapping(string => SiaDocument) siaDocs;                            

    uint constant SIA_DOCS_PAGE_SIZE = 50;
    uint256 public siaLastPage = 0;

    // All documents organized by page
    mapping(uint256 => string[]) public siaDocsByPage;         

    // All documents for which an account is the owner
    mapping(address => string[]) public siaDocsByOwner;              
///)

///(events

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // Event fired when doc is added
    event AddSiaDocument      
                    (
                        string indexed docId,
                        address indexed owner,
                        uint256 timestamp
                    );
///)

    constructor() public
    {
///(initialize
///)
    }

///(functions

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    /**
    * @dev Adds a new SIA doc
    *
    * @param docId Unique identifier (siahash digest of doc)
    * @param label Short, descriptive label for document
    */
    function addSiaDocument
                        (
                            string calldata docId,
                            bytes32 label
                        ) 
                        external 
///$access_control:administrator_role                           requireContractAdmin
    {
        // Prevent empty string for docId
        bytes memory testDocId = bytes(docId);
        require(testDocId.length > 0, "Invalid docId");  

        // Prevent duplicate docIds   
        require(siaDocs[docId].timestamp == 0, "Document already exists");     

        siaDocs[docId] = SiaDocument({
                                    docId: docId,
                                    label: label,
                                    timestamp: now,
                                    owner: msg.sender
                               });

        siaDocsByOwner[msg.sender].push(docId);
        if (siaDocsByPage[siaLastPage].length == SIA_DOCS_PAGE_SIZE) {
            siaLastPage++;
        }
        siaDocsByPage[siaLastPage].push(docId);

        emit AddSiaDocument(docId, msg.sender, siaDocs[docId].timestamp);
    }

    /**
    * @dev Gets individual SIA doc by docId
    *
    * @param id DocumentId of doc
    */
    function getSiaDocument
                    (
                        string calldata id
                    )
                    external
                    view
                    returns(
                                string memory docId, 
                                bytes32 label,
                                uint256 timestamp, 
                                address owner
                    )
    {
        SiaDocument memory siaDoc = siaDocs[id];
        docId = siaDoc.docId;
        label = siaDoc.label;
        timestamp = siaDoc.timestamp;
        owner = siaDoc.owner;
    }

    /**
    * @dev Gets docs where account is/was an owner
    *
    * @param account Address of owner
    */
    function getSiaDocumentsByOwner
                            (
                                address account
                            )
                            external
                            view
                            returns(string[] memory)
    {
        require(account != address(0), "Invalid account");

        return siaDocsByOwner[account];
    }
///)

}