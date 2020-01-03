pragma solidity  >=0.5.0;

import "./DappLib.sol";
///+import

contract DappState {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///+using

    address public contractOwner;                  // Account used to deploy contract
///+state

///+events

    constructor() public 
    {
        contractOwner = msg.sender;       
///+initialize
    }

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@ OPTIONAL DAPPSTARTER CONTRACT FEATURES @@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
                  
    mapping(address => uint256) exampleUserScores;                  // Example state storage variable
    address[] exampleUsersList;                                     // Example state storage variable lookup

    function getUsersByPage
                                (
                                    uint256 page, 
                                    uint256 resultsPerPage
                                ) 
                                external 
                                view 
                                requireContractAuthorized 
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
        if ((exampleUsersList.length == 0) || (index > exampleUsersList.length.sub(1))) {
            return new address[](0);
        }

        // Create fixed length array because we cannot push to array in memory
        address[] memory users = new address[](resultsPerPage);

        
        uint256 returnCounter = 0; 
        
        for(index; index < (resultsPerPage.mul(page)); index++) {
            if (index < (exampleUsersList.length.sub(1))) {
                users[returnCounter] = exampleUsersList[index];
            } else {
                users[returnCounter] = address(0);
            }

            returnCounter++;
        }

        return users;
    }

    function getUserScore
                        (
                            address user
                        ) 
                        external 
                        view 
                        requireContractAuthorized 
                        returns(uint256) 
    {
        return exampleUserScores[user];
    }

    function setUserScore
                        (
                            address user, 
                            uint256 score   
                        ) 
                        external 
                        requireContractAuthorized 
    {
        if (exampleUserScores[user] == 0) {
            exampleUsersList.push(user);
        }

        exampleUserScores[user] = score;
    }


    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  DAPPSTARTER CONTRACT FEATURES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

///+modifiers

///+functions


}   


