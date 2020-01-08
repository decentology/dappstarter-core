///(library

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: IPFS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // All IPFS references will be stored using Multihash struct. 
    // This ensures that if/when the IPFS hash function changes, 
    // there will be no adverse impact on this contract

    // Struct for storing IPFS multi-hash
    struct Multihash {              
        // Hash digest                    
        bytes32 digest;         

        // Function used -- initially sha256                          
        uint8 hashFunction;    

        // Length of digest                         
        uint8 digestLength;                             
    }
///)