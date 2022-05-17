// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./ERC20/ERC20Custom.sol";
import "./interfaces/ITreasury.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IPool.sol";

import "./Operator.sol";

contract Treasury is ITreasury, Operator, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public dollar;
    address public share;

    // Constants for various precisions
    uint256 private constant PRICE_PRECISION = 1e6;
    uint256 private constant RATIO_PRECISION = 1e6;

    // fees
    uint256 public redemption_fee; // 6 decimals of precision
    uint256 public minting_fee; // 6 decimals of precision

    // collateral_ratio
    uint256 public last_refresh_cr_timestamp;
    uint256 public target_collateral_ratio; // 6 decimals of precision
    uint256 public effective_collateral_ratio; // 6 decimals of precision
    uint256 public price_target; // The price of DOLLAR at which the collateral ratio will respond to; this value is only used for the collateral ratio mechanism and not for minting and redeeming which are hardcoded at $1
    bool public collateral_ratio_paused = true; // during bootstraping phase, collateral_ratio will be fixed at 100%


    /* ========== CONSTRUCTOR ========== */

    constructor() {
        target_collateral_ratio = 875000; // = 87.5% - captured the current treasury
        effective_collateral_ratio = 994785; // = 99.4785% - captured the current treasury
        price_target = 1000000; // = $1. (6 decimals of precision). Collateral ratio will adjust according to the $1 price target at genesis
        redemption_fee = 3000;
        minting_fee = 3000;
    }

    /* ========== VIEWS ========== */

    function dollarPrice() public pure returns (uint256) {
        return 1000000;
    }

    function info()
        external
        view
        override
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            dollarPrice(),
            IERC20(dollar).totalSupply(),
            target_collateral_ratio,
            effective_collateral_ratio,
            minting_fee,
            redemption_fee
        );
    }
    
    /* ========== RESTRICTED FUNCTIONS ========== */

    function setRedemptionFee(uint256 _redemption_fee) public onlyOperator {
        redemption_fee = _redemption_fee;
    }

    function setMintingFee(uint256 _minting_fee) public onlyOperator {
        minting_fee = _minting_fee;
    }

    function setPriceTarget(uint256 _price_target) public onlyOperator {
        price_target = _price_target;
    }

    function toggleCollateralRatio() public onlyOperator {
        collateral_ratio_paused = !collateral_ratio_paused;
    }

    function setDollarAddress(address _dollar) public onlyOperator {
        dollar = _dollar;
    }

    function setShareAddress(address _share) public onlyOperator {
        share = _share;
    }
}
