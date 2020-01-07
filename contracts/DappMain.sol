pragma solidity  >=0.5.0;

import "./DappLib.sol";
///+import

contract DappMain {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)
///+using

    address public contractOwner;                  // Account used to deploy contract
///+state

///+events

    constructor() public 
    {
        contractOwner = msg.sender;       
///+initialize
    }

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@ OPTIONAL DAPPSTARTER CONTRACT FEATURES @@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
 

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  DAPPSTARTER CONTRACT FEATURES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

///+modifiers

///+functions


}   


