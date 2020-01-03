pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)

contract access_control_contract_runstate {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///(using
///)

///(state
    mapping(address => uint256) private authorizedContracts;        // Contracts authorized to call this one           
///)

///(events
///)

    constructor() public
    {
///(initialize
///)
    }

///(modifiers
    /**
    * @dev Modifier that requires the calling contract to be authorized
    */
    modifier requireContractAuthorized()
    {
        require(isContractAuthorized(msg.sender), "Calling contract not authorized");
        _;
    }
///)

///(functions
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
///$access_control:contract_runstate                            requireContractRunStateActive
                            requireContractAdmin  // Administrator Role block is required to ensure only authorized individuals can pause contract
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
///$access_control:contract_runstate                            requireContractRunStateActive
                            requireContractAdmin  // Administrator Role block is required to ensure only authorized individuals can pause contract
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
///)

}






