pragma solidity  >=0.5.0;

import "../../DappLib.sol"; // Automatically included

///{import
///}import

contract example {
    using DappLib for uint256; // Allow DappLib(SafeMath) functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       IPFS DOCUMENTS                                     */
    /********************************************************************************************/

    constructor() public
    {
///{constructor

///}constructor
    }

///{state
    uint256 exampleItem;
///}state

///{events
    event ExampleEvent      // Event fired when doc is added
                    (
                        uint256 value
                    );
///}events

///{functions
    /**
    * @dev Changes the value of exampleItem
    *
    * @param value New value
    */
    function changeExampleItem
                        (
                            uint256 value
                        ) 
                        external 
    {
        exampleItem = value;
        emit ExampleEvent(value);
    }

    /**
    * @dev Gets the value of exampleItem
    */
    function getExampleItem()
                    external
                    view
                    returns(
                                uint256 value 
                    )
    {
        return exampleItem;
    }
///}functions

}