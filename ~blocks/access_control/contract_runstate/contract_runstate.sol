pragma solidity  >=0.5.0;

import "../../../contracts/DappLib.sol";
///(import
///)


contract access_control_contract_runstate {
///(using
///)

///(state
    bool private contractRunState = true;          // Contract run state
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
    * @dev Modifier that requires the "contractRunState" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireContractRunStateActive() 
    {
        require(contractRunState, "Contract is currently not active");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }
///)

///(functions
    /**
    * @dev Get active status of contract
    *
    * @return A bool that is the current active status
    */    
    function isContractRunStateActive()
                        external 
                        view 
                        returns(bool)
    {
        return contractRunState;
    }

    /**
    * @dev Sets contract active status on/off
    *
    * When active status is off, all write transactions except for this one will fail
    */    
    function setContractRunState
                    (
                        bool mode
                    ) 
                    external 
                    // **** WARNING: Adding requireContractRunStateActive modifier will result in contract lockout ****
                    requireContractAdmin  // Administrator Role block is required to ensure only authorized individuals can pause contract
    {
        contractRunState = mode;
    }
                        
///)
}