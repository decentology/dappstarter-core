pragma solidity  >=0.5.0;

import "./DappLib.sol";

///(import
///)

contract asset_value_tracking__token{
///(using
///)
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                              TOKEN                                       */
    /********************************************************************************************/

    constructor() public
    {
///(initialize
        string memory name = "sample";     ///@{ "name" : "sample"}
        string memory symbol = "ZZZZ";     ///@{ "symbol" : "ZZZZ"}
        uint256 decimals = 18;      ///@{ "decimals" : "18"}
///)
    }

///(state
///)

///(events
///)

///(functions
///)

}