// SPDX-License-Identifier: GPL-3.0
/*

██╗░░░██╗██╗░░░██╗██╗░░░░░░█████╗░░█████╗░███╗░░██╗      ░█████╗░░█████╗░██████╗░███████╗
██║░░░██║██║░░░██║██║░░░░░██╔══██╗██╔══██╗████╗░██║      ██╔══██╗██╔══██╗██╔══██╗██╔════╝
╚██╗░██╔╝██║░░░██║██║░░░░░██║░░╚═╝███████║██╔██╗██║      ██║░░╚═╝██║░░██║██████╔╝█████╗░░
░╚████╔╝░██║░░░██║██║░░░░░██║░░██╗██╔══██║██║╚████║      ██║░░██╗██║░░██║██╔══██╗██╔══╝░░
░░╚██╔╝░░╚██████╔╝███████╗╚█████╔╝██║░░██║██║░╚███║      ╚█████╔╝╚█████╔╝██║░░██║███████╗
░░░╚═╝░░░░╚═════╝░╚══════╝░╚════╝░╚═╝░░╚═╝╚═╝░░╚══╝      ░╚════╝░░╚════╝░╚═╝░░╚═╝╚══════╝

*/

pragma solidity >=0.8.0 <0.9.0;

/**
 * @author  Nik Kalyani @techbubble
 * @title   Vulcan Core Preview v0.5
 * @dev     This is the Vulcan Core contract. Its purpose is to give developers an easy, on-chain method
 *          to obtain protocol rebasing information. The contract has a lookup table "rebaseTable" that
 *          is a mapping of epoch numbers to the rebasing multiplier value for that epoch. Using this table
 *          developers can build dApps that can either validate or predict what the rebased value of an 
 *          amount will be by using any of the helper functions in this contract.
 */

contract VulcanCore {
    uint8   public constant BLOCKS_PER_EPOCH = 36; // Set to approximately 3 mins per epoch instead of 180;
    uint32  public constant MAX_EPOCH = 735840;
    uint32  public constant REBASE_DIVISOR = 10 ** 8;
    uint64  public constant REBASE_VALUE = 100001256;
    uint16  public constant TREASURY_TAX_RATE = 1000;
    uint16  public constant FLEX_TAX_RATE = 1000;
    uint16  public constant FIREPIT_TAX_RATE = 3000;

    uint256 public startRebasingBlock = 0;

    mapping(uint32 => uint64) public rebaseTable;

    constructor() {
        rebaseTable[0] = 100000000;
        startRebasingBlock = block.number ;
        populateRebaseTable();
    }

    /**
     * @dev     Returns the rebase value for a block number
     * @param   blockNumber  Block number for which to return rebase value
     * @return  uint64  Rebase value
     */
    function rebaseLookup(uint256 blockNumber) public view returns (uint64) {
        require(blockNumber >= startRebasingBlock, "Epoch not started");

        return rebaseLookupByEpoch(epoch(blockNumber));
    }
 
    /**
     * @dev     Returns the rebase value for an epoch number
     * @param   epochNumber  Epoch number for which to return rebase value
     * @return  uint64  Rebase value
     */
    function rebaseLookupByEpoch(
        uint32 epochNumber
    ) public view returns (uint64) {
        return rebaseTable[epochNumber];
    }

    /**
     * @dev     Returns the current block number, epoch number and rebase value
     * @return  uint256  Current block number
     * @return  uint32  Current epoch number
     * @return  uint64  Current rebase value
     */
    function rebaseInfo() public view returns (uint256, uint32, uint64) {
        return (block.number, epoch(block.number), rebaseLookup(block.number));
    }

    /**
     * @dev     Returns the epoch number for any block number
     * @param   blockNumber  Block number for which to return epoch number
     * @return  uint32  Epoch number
     */
    function epoch(uint256 blockNumber) public view returns (uint32) {
        require(blockNumber >= startRebasingBlock, "Epoch not started");

        return uint32((blockNumber - startRebasingBlock) / BLOCKS_PER_EPOCH);
    }

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
    function rebase(uint256 amount) public view returns (uint256) {
        return rebaseAt(amount, block.number);
    }

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
    function unrebase(uint256 amount) public view returns (uint256) {
        return unrebaseAt(amount, block.number);
    }

    /**
     * @dev     Returns the rebased value for "amount" at an arbitray block number
     * @param   amount  Balance amount
     * @param   blockNumber  Block number
     * @return  uint256  Rebased balance amount
     */
    function rebaseAt(
        uint256 amount,
        uint256 blockNumber
    ) public view returns (uint256) {
        return (amount * rebaseLookup(blockNumber)) / REBASE_DIVISOR;
    }

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
    function unrebaseAt(
        uint256 amount,
        uint256 blockNumber
    ) public view returns (uint256) {
        return (amount * 2) - rebaseAt(amount, blockNumber);
    }


    uint32 lastEpoch = 0;   // Track which epoch was last processed
    /**
     * @dev     Populate rebase value table for each epoch from genesis to 21 years
     *          This function is called at blockchain genesis and has no purpose
     *          after the table is fully hydrated to MAX_EPOCH
     */
    function populateRebaseTable() public {
        require(lastEpoch < MAX_EPOCH, "Table already populated");

        for (uint8 i = 0; i < 200; i++) {
            lastEpoch++;
            if (lastEpoch > MAX_EPOCH) {
                break;
            }
            rebaseTable[lastEpoch] =
                (rebaseTable[lastEpoch - 1] * REBASE_VALUE) /
                REBASE_DIVISOR;
        }
    }
}
