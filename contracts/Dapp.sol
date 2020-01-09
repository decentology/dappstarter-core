pragma solidity  >=0.5.0;

import "./interfaces/IDappState.sol";
import "./DappLib.sol";

contract Dapp {
    // Allow DappLib(SafeMath) functions to be called for all uint256 types
    // (similar to "prototype" in Javascript)
    using DappLib for uint256;

    IDappState state;

    constructor 
                (
                    address dappStateContract
                )
                public
    {
        state = IDappState(dappStateContract);
    }

    /**
    * @dev Example function to demonstrate cross-contract call
    *
    */
    function getStateContractOwner()
                            external
                            view
                            returns(address)
    {
        return state.getContractOwner();
    }
}
