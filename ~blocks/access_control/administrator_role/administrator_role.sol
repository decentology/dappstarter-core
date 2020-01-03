pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)


contract access_control_administrator_role {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///(using
///)

///(state
    uint256 private authorizedAdminsCount = 1;                      // Track authorized admins count to prevent lockout
    mapping(address => uint256) private authorizedAdmins;           // Admins authorized to manage contract           
///)

///(events
///)

    constructor() public
    {
///(initialize
        authorizedAdmins[msg.sender] = 1;       // Add account that deployed contract as an authorized admin
///)
    }

///(modifiers
    /**
    * @dev Modifier that requires the function caller to be a contract admin
    */
    modifier requireContractAdmin()
    {
        require(isContractAdmin(msg.sender), "Caller is not a contract administrator");
        _;
    }
///)

///(functions
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
///)

}