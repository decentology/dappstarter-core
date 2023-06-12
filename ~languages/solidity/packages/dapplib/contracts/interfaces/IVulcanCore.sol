// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
interface IVulcanCore {

    // Current Address: 0x14aaB8ad0fa274854008Ad967960a0BC7eE65227

    /**
     * @dev     Returns the rebase value for a block number
     * @param   blockNumber  Block number for which to return rebase value
     * @return  uint64  Rebase value
     */
    function rebaseLookup(uint256 blockNumber) external view returns (uint64);

    /**
     * @dev     Returns the rebase value for an epoch number
     * @param   epochNumber  Epoch number for which to return rebase value
     * @return  uint64  Rebase value
     */
    function rebaseLookupByEpoch(uint32 epochNumber) external view returns (uint64);

    /**
     * @dev     Returns the current block number, epoch number and rebase value
     * @return  uint256  Current block number
     * @return  uint8    Number of blocks per epoch
     * @return  uint32  Current epoch number
     * @return  uint64  Current rebase value
     */
    function rebaseInfo() external view returns (uint256, uint8, uint32, uint64);

    /**
     * @dev     Returns the epoch number for any block number
     * @param   blockNumber  Block number for which to return epoch number
     * @return  uint32  Epoch number
     */
    function epoch(uint256 blockNumber) external view returns (uint32);

    /**
     * @dev     Returns the rebased value for an amount based on the current epoch
     *          
     *          Rebasing an amount is simply multiplying it for with the rebase
     *          value for the current epoch. How is this rebase value derived?          *          
     *          
     *          Vulcan Protocol has an APR of 44% and each epoch is 180 blocks which
     *          is approximately 15 minutes. Since epochs are block-driven, it's 
     *          immaterial if the block time of approximately 5 seconds changes.
     *          The formula for calculating the rebase value is the same formula
     *          used in any financial application to calculate Compound Interest
     *
     *          A = P(1 + r)^t
     *          
     *          A = Accrued amount (Principal + Interest)
     *          P = Principal
     *          r = Rate of interest per period (epoch) in decimal format
     *              The value of r for Vulcan Protocol is 0.00001256
     *          t = Number of periods (epochs)
     *          
     *          Under the hood, crypto platforms use large integers instead of floating
     *          point numbers. Since it would be computationally expensive to compute
     *          the exponent of very large integers, using a lookup table for rebase values
     *          is more efficient since the values will not change. It has the secondary
     *          benefit of making it easy for developers to programmatically reference
     *          the rebase value for any epoch, past of future.
     *
     * @param   amount  Balance amount
     * @return  uint256  Rebased balance amount
     */
    function rebase(uint256 amount) external view returns (uint256);

    /**
     * @dev     Returns the unrebased value for "amount" at current epoch
     *          "unrebased" means the amount less the value that should be
     *          deducted to ensure that the increase through rebases in prior
     *          epochs is not included in amount
     *
     * @param   amount  Amount being transferred
     * @return  uint256  Value that should be stored for amount so that
     *                   its rebased value returns the correct value
     */
    function unrebase(uint256 amount) external view returns (uint256);

    /**
     * @dev     Returns the rebased value for "amount" at an arbitray block number
     * @param   amount  Balance amount
     * @param   blockNumber  Block number
     * @return  uint256  Rebased balance amount
     */
    function rebaseAt(uint256 amount, uint256 blockNumber) external view returns (uint256);

    /**
     * @dev     Returns the unrebased value for "amount" at an arbitray block number
     * @param   amount  Amount being transferred
     * @param   blockNumber  Block number
     * @return  uint256  Value that should be stored for amount
     *                   Since the rebase calculation uses a precision
     *                   of 8 places after the decimal point and balance
     *                   use a precision of 18 places after the decimal 
     *                   point, the unrebased value when rebased at the
     *                   initial epoch will be less by 0.00000001. This
     *                   difference was determined to be negligible
     *                   and acceptable for rebasing operations as an
     *                   unrebased is generally called for a transfer
     *                   which has also has a tax fee that is included.
     */
    function unrebaseAt(uint256 amount, uint256 blockNumber) external view returns (uint256);

   
}
