// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IDappState.sol";
import "./DappLib.sol";

    /*

    VERY IMPORTANT SECURITY NOTE:

    You will want to restrict some of your state contract functions so only authorized
    contracts can call them. This can be achieved in four steps:

    1) Include the "Access Control: Contract Access" feature block when creating your project.
       This adds all the functionality to manage white-listing of external contracts in your
       state contract.

    2) Add the "requireContractAuthorized" function modifiers to those state contract functions
       that should be restricted.

    3) Deploy the contract that will be calling into the state contract (like this one, for example).
    
    4) Call the "authorizeContract()" function in the state contract with the deployed address of the
       calling contract. This adds the calling contract to a white-list. Thereafter, any calls to any
       function in the state contract that use the "requireContractAuthorized" function modifier will
       succeed only if the calling contract (or any caller for that matter) is white-listed.

    */


contract Dapp {
    // Allow DappLib(SafeMath) functions to be called for all uint256 types
    // (similar to "prototype" in Javascript)
    using DappLib for uint256;

    IDappState state;

    // During deployment, the address of the contract that contains data (or "state")
    // is provided as a constructor argument. The "state" variable can then call any
    // function in the state contract that it is aware of (by way of IDappState).
    constructor 
                (
                    address dappStateContract 
                )
    {
        state = IDappState(dappStateContract);
    }

    /**
    * @dev Example function to demonstrate cross-contract READ call
    *
    */
    function getStateContractOwner()
                            external
                            view
                            returns(address)
    {
        return state.getContractOwner();
    }

    /**
    * @dev Example function to demonstrate cross-contract WRITE call
    *
    */
    function incrementStateCounter
                            (
                                uint256 increment
                            )
                            external
    {
        return state.incrementCounter(increment);
    }


    /**
    * @dev Another example function to demonstrate cross-contract WRITE call
    *
    */
    function getStateCounter()
                            external
                            view
                            returns(uint256)
    {
        return state.getCounter();
    }

} 
