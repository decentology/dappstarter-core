pragma solidity  >=0.5.0;

import "./DappLib.sol";

contract Dapp {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)

    DappState state;

    constructor 
                (
                    address dappStateContract
                )
                public
    {
        state = DappState(dappStateContract);
    }
}

// Add interfaces for functions to get/set state data here
contract DappState {

}