pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)

contract file_storage__ipfs {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///(using

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: IPFS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    using DappLib for DappLib.Multihash;
///)

///(state

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: IPFS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    struct IpfsDocument {
        // Unique identifier -- defaults to multihash digest of file
        bytes32 docId;    

        bytes32 label;

        // Registration timestamp                                          
        uint256 timestamp;  

        // Owner of document                                        
        address owner;    

        // External Document reference                                          
        DappLib.Multihash docRef;                                   
    }

    // All added documents
    mapping(bytes32 => IpfsDocument) ipfsDocs;                            

    uint constant IPFS_DOCS_PAGE_SIZE = 50;
    uint256 public ipfsLastPage = 0;

    // All documents organized by page
    mapping(uint256 => bytes32[]) public ipfsDocsByPage;         

    // All documents for which an account is the owner
    mapping(address => bytes32[]) public ipfsDocsByOwner;              
///)

///(events

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: IPFS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // Event fired when doc is added
    event AddIpfsDocument      
                    (
                        bytes32 indexed docId,
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

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: IPFS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    /**
    * @dev Adds a new IPFS doc
    *
    * @param docId Unique identifier (multihash digest of doc)
    * @param label Short, descriptive label for document
    * @param digest Digest of folder with doc binary and metadata
    * @param hashFunction Function used for generating doc folder hash
    * @param digestLength Length of doc folder hash
    */
    function addIpfsDocument
                        (
                            bytes32 docId,
                            bytes32 label,
                            bytes32 digest,
                            uint8 hashFunction,
                            uint8 digestLength
                        ) 
                        external 
///$access_control:administrator_role                           requireContractAdmin
    {
        // Prevent empty string for docId
        require(docId[0] != 0, "Invalid docId");  

        // Prevent empty string for digest                             
        require(digest[0] != 0, "Invalid ipfsDoc folder digest");            

        // Prevent duplicate docIds   
        require(ipfsDocs[docId].timestamp == 0, "Document already exists");     

        ipfsDocs[docId] = IpfsDocument({
                                    docId: docId,
                                    label: label,
                                    timestamp: now,
                                    owner: msg.sender,
                                    docRef: DappLib.Multihash({
                                                    digest: digest,
                                                    hashFunction: hashFunction,
                                                    digestLength: digestLength
                                                })
                               });

        ipfsDocsByOwner[msg.sender].push(docId);
        if (ipfsDocsByPage[ipfsLastPage].length == IPFS_DOCS_PAGE_SIZE) {
            ipfsLastPage++;
        }
        ipfsDocsByPage[ipfsLastPage].push(docId);

        emit AddIpfsDocument(docId, msg.sender, ipfsDocs[docId].timestamp);
    }

    /**
    * @dev Gets individual IPFS doc by docId
    *
    * @param id DocumentId of doc
    */
    function getIpfsDocument
                    (
                        bytes32 id
                    )
                    external
                    view
                    returns(
                                bytes32 docId, 
                                bytes32 label,
                                uint256 timestamp, 
                                address owner, 
                                bytes32 docDigest,
                                uint8 docHashFunction,
                                uint8 docDigestLength
                    )
    {
        IpfsDocument memory ipfsDoc = ipfsDocs[id];
        docId = ipfsDoc.docId;
        label = ipfsDoc.label;
        timestamp = ipfsDoc.timestamp;
        owner = ipfsDoc.owner;
        docDigest = ipfsDoc.docRef.digest;
        docHashFunction = ipfsDoc.docRef.hashFunction;
        docDigestLength = ipfsDoc.docRef.digestLength;

    }

    /**
    * @dev Gets docs where account is/was an owner
    *
    * @param account Address of owner
    */
    function getIpfsDocumentsByOwner
                            (
                                address account
                            )
                            external
                            view
                            returns(bytes32[] memory)
    {
        require(account != address(0), "Invalid account");

        return ipfsDocsByOwner[account];
    }
///)

}