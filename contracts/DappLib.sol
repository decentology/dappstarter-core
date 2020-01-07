pragma solidity  >=0.5.0;

library DappLib {

    // All IPFS references will be stored using Multihash struct. This ensures that if/when the IPFS hash
    // function changes, there will be no adverse impact on this contract
    struct Multihash {                                  // Struct for storing IPFS multi-hash
        bytes32 digest;                                 // Hash digest  
        uint8 hashFunction;                             // Function used -- initially sha256
        uint8 digestLength;                             // Length of digest
    }
    
// *** BEGIN SafeMath -- Copyright (c) 2016 Smart Contract Solutions, Inc. ***

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
        return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    // Source: https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol
    // ------------------
    
}

