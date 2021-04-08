// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

// Shared library for all contracts
library DappLib {

///+library
    
function getItemsByPage
                            (
                                uint256 page, 
                                uint256 resultsPerPage,
                                bytes32[] memory itemList

                            ) 
                            internal 
                            pure
                            returns(bytes32[] memory) 
{
    /*
        Source: https://medium.codylamson.com/how-to-paginate-smart-contract-array-returns-cd6227479aa3
        ex: _page 1, _resultsPerPage 20 | 1 * 20 - 20 = 0
        ex2: _page 2, _resultsPerPage 20 | 2 * 20 - 20 = 20
        starting point for listing items in array
    */

    uint256 index = sub(mul(resultsPerPage,page),resultsPerPage);

    // Return emptry array if already empty or index is out of bounds
    if ((itemList.length == 0) || (index > sub(itemList.length, 1))) {
        return new bytes32[](0);
    }

    // Create fixed length array because we cannot push to array in memory
    bytes32[] memory itemPage = new bytes32[](resultsPerPage);

    
    uint256 returnCounter = 0; 
    
    for(index; index < (mul(resultsPerPage, page)); index++) {
        if (index < (itemList.length)) {
            itemPage[returnCounter] = itemList[index];
        } else {
            itemPage[returnCounter] = bytes32(0);
        }

        returnCounter++;
    }

    return itemPage;
}



// *** BEGIN SafeMath -- Copyright (c) 2016 Smart Contract Solutions, Inc. ***

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs

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
    
}

