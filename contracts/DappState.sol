pragma solidity  >=0.5.0;

import "./DappLib.sol";
///+import

contract DappState {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)

    address public contractOwner;                                  // Account used to deploy contract

    constructor() public 
    {
        contractOwner = msg.sender;       
        authorizedAdmins[msg.sender] = 1;

///+constructor
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
                  
///+functions

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@ BUILT-IN DAPPSTARTER CONTRACT FEATURES @@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
         
    /********************************************************************************************/
    /*                                       ACTIVE STATUS                                      */
    /********************************************************************************************/

    bool private active = true;                                // Contract run state

    /**
    * @dev Modifier that requires the "active" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireActive() 
    {
        require(active, "Contract is currently not active");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Get active status of contract
    *
    * @return A bool that is the current active status
    */    
    function isActive()
                        external 
                        view 
                        returns(bool)
    {
        return active;
    }

    /**
    * @dev Sets contract active status on/off
    *
    * When active status is off, all write transactions except for this one will fail
    */    
    function setStatus
                    (
                        bool mode
                    ) 
                    external 
                    // **** DO NOT add requireActive modifier here to avoid contract lockout ****
                    requireContractAdmin 
    {
        active = mode;
    }
                        
    /********************************************************************************************/
    /*                                    CONTRACT AUTHORIZATION                                */
    /********************************************************************************************/

    mapping(address => uint256) private authorizedContracts;        // Contracts authorized to call this one           

    /**
    * @dev Modifier that requires the calling contract to be authorized
    */
    modifier requireContractAuthorized()
    {
        require(isContractAuthorized(msg.sender), "Calling contract not authorized");
        _;
    }

    /**
    * @dev Authorizes a smart contract to call this contract
    *
    * @param account Address of the calling smart contract
    */
    function authorizeContract
                            (
                                address account
                            ) 
                            public 
                            requireActive 
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");

        authorizedContracts[account] = 1;
    }

    /**
    * @dev Deauthorizes a previously authorized smart contract from calling this contract
    *
    * @param account Address of the calling smart contract
    */
    function deauthorizeContract
                            (
                                address account
                            ) 
                            external 
                            requireActive
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");

        delete authorizedContracts[account];
    }

    /**
    * @dev Checks if a contract is authorized to call this contract
    *
    * @param account Address of the calling smart contract
    */
    function isContractAuthorized
                            (
                                address account
                            ) 
                            public 
                            view
                            returns(bool) 
    {
        return authorizedContracts[account] == 1;
    }
                        
    /********************************************************************************************/
    /*                                     ADMIN AUTHORIZATION                                  */
    /********************************************************************************************/

    uint256 private authorizedAdminsCount = 1;                      // Document authorized admins count to prevent lockout
    mapping(address => uint256) private authorizedAdmins;           // Admins authorized to manage contract           

    /**
    * @dev Modifier that requires the function caller to be a contract admin
    */
    modifier requireContractAdmin()
    {
        require(isContractAdmin(msg.sender), "Caller not contract admin");
        _;
    }

    /**
    * @dev Adds a contract admin
    *
    * @param account Address of the admin to add
    */
    function addContractAdmin
                            (
                                address account
                            ) 
                            external 
                            requireActive 
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");

        authorizedAdmins[account] = 1;
        authorizedAdminsCount++;
    }

    /**
    * @dev Removes a previously added admin
    *
    * @param account Address of the admin to remove
    */
    function removeContractAdmin
                            (
                                address account
                            ) 
                            external 
                            requireActive
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");
        require(authorizedAdminsCount >= 2, "Cannot remove last admin");

        delete authorizedAdmins[account];
        authorizedAdminsCount--;
    }

    /**
    * @dev Checks if an account is an admin
    *
    * @param account Address of the account to check
    */
    function isContractAdmin
                            (
                                address account
                            ) 
                            public 
                            view
                            returns(bool) 
    {
        return authorizedAdmins[account] == 1;
    }

}   


