pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

/********************************************************************************************/
/*  This contract is the interface for DappState.sol functions used in Dapp.sol             */
/*  to enable DappState functions to be called from Dapp. You can restrict the functions    */
/*  in DappState directly known to Dapp by limiting the definitions you include here.       */
/*  It's OK to not use IDappState and Dapp, but if you do use them, it's highly recommended */
/*  that you use the DappStarter "Contract Access" feature  block so you can limit which    */
/*  contracts can call in to the DappState contract.                                        */
/********************************************************************************************/

interface IDappState {
    function getContractOwner() external view returns(address);     // Example READ function
    function incrementCounter(uint256 increment) external;          // Example WRITE function
    function getCounter() external view returns(uint256);           // Another example READ function
}