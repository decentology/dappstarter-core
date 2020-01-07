pragma solidity  >=0.5.0;

import "./DappLib.sol";

contract Dapp {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)

    DappMain state;

    constructor 
                (
                    address dappMainContract
                )
                public
    {
        state = DappMain(dappMainContract);
    }
}

// Add interfaces for functions to get/set state data here
contract DappMain {

}