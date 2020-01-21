pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)


contract access_control_administrator_role {
    using DappLib for uint256; 
///(using
///)

///(state

/*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // Track authorized admins count to prevent lockout
    uint256 private authorizedAdminsCount = 1;                      

    // Admins authorized to manage contract
    mapping(address => uint256) private authorizedAdmins;                      
///)

///(events
///)

    constructor() public
    {
///(initialize

/*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
        // Add account that deployed contract as an authorized admin
        authorizedAdmins[msg.sender] = 1;       
///)
    }

///(modifiers

/*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
    /**
    * @dev Modifier that requires the function caller to be a contract admin
    */
    modifier requireContractAdmin()
    {
        require(isContractAdmin(msg.sender), "Caller is not a contract administrator");
        // Modifiers require an "_" which indicates where the function body will be added
        _;
    }
///)

///(functions

/*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
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
///$access_control:contract_runstate                            requireContractRunStateActive 
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");
        require(authorizedAdmins[account] < 1, "Account is already an administrator");

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
///$access_control:contract_runstate                            requireContractRunStateActive
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");
        require(authorizedAdminsCount >= 2, "Cannot remove last admin");

        delete authorizedAdmins[account];
        authorizedAdminsCount--;
    }

    /**
    * @dev Removes the last admin fully decentralizing the contract
    *
    * @param account Address of the admin to remove
    */
    function removeLastContractAdmin
                            (
                                address account
                            ) 
                            external 
///$access_control:contract_runstate                            requireContractRunStateActive
                            requireContractAdmin
    {
        require(account != address(0), "Invalid address");
        require(authorizedAdminsCount == 1, "Not the last admin");

        delete authorizedAdmins[account];
        authorizedAdminsCount--;
    }

///)

}