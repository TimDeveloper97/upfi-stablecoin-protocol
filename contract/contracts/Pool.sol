// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./Operator.sol";
import "./Upfi.sol";
import "./interfaces/IPool.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/ITreasury.sol";

contract Pool is Operator, ReentrancyGuard, IPool {
    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    /* ========== STATE VARIABLES ========== */

    address public oracle; // oracle to get price of collateral
    mapping(string => address) public token_shares;
    address public dollar;
    address public treasury;
    address public collateral;

    mapping(address => uint256) public redeem_share_balances;
    mapping(address => uint256) public redeem_collateral_balances;
    mapping(string => uint256) public token_share_prices;

    uint256 public unclaimed_pool_collateral;
    uint256 public unclaimed_pool_share;

    mapping(address => uint256) public last_redeemed;

    // Constants for various precisions
    uint256 private constant PRICE_PRECISION = 1e6;
    uint256 private constant COLLATERAL_RATIO_PRECISION = 1e6;
    uint256 private constant COLLATERAL_RATIO_MAX = 1e6;

    // Number of decimals needed to get to 18
    uint256 private missing_decimals;

    // Pool_ceiling is the total units of collateral that a pool contract can hold
    uint256 public pool_ceiling = 0;

    // AccessControl state variables
    bool public mint_paused = false;
    bool public redeem_paused = false;
    bool public migrated = false;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _dollar,    // UPFI token address
        address _collateral,     // USDC token address
        address _treasury,
        uint256 _pool_ceiling
    ) {
        dollar = _dollar;
        collateral = _collateral;
        treasury = _treasury;
        pool_ceiling = _pool_ceiling;
        missing_decimals = 10 ** uint256(18).sub(ERC20(_collateral).decimals());
    }

    function addTokenShare(string memory symbol, address _share ) external onlyOperator {
        token_shares[symbol] = _share;
    }

    function setTokenSharePrice(string memory symbol, uint256 price ) external onlyOperator {
        token_share_prices[symbol] = price;
    }

    /* ========== VIEWS ========== */

    function info()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            bool,
            bool
        )
    {
        return (
            pool_ceiling, // Ceiling of pool - collateral-amount
            unclaimed_pool_collateral, // unclaimed amount of COLLATERAL
            unclaimed_pool_share, // unclaimed amount of SHARE
            mint_paused,
            redeem_paused
        );
    }

    /* ========== PUBLIC FUNCTIONS ========== */

    function getTokenSharePrice(string memory symbol) public view override returns (uint256) {
        return token_share_prices[symbol];
    }

    function getTokenShare(string memory symbol) external view override returns (address) {
        return token_shares[symbol];
    }

    function getCollateralPrice() public pure returns (uint256) {
        return 1e6;
    }

    function mint(
        uint256 _collateral_amount,
        uint256 _share_amount,
        uint256 _dollar_out_min,
        string memory symbol
    ) external {
        require(mint_paused == false, "Minting is paused");
        (, , uint256 _target_collateral_ratio, , uint256 _minting_fee, ) = ITreasury(treasury).info();
        require(ERC20(collateral).balanceOf(address(this)).sub(unclaimed_pool_collateral).add(_collateral_amount) <= pool_ceiling, ">poolCeiling");
        uint256 _total_dollar_value = 0;
        uint256 _required_share_amount = 0;

        if (_target_collateral_ratio > 0) {
            uint256 _collateral_value = _collateral_amount.mul(missing_decimals).mul(getCollateralPrice()).div(PRICE_PRECISION);
            _total_dollar_value = _collateral_value.mul(COLLATERAL_RATIO_PRECISION).div(_target_collateral_ratio);
            if (_target_collateral_ratio < COLLATERAL_RATIO_MAX) {
                _required_share_amount = _total_dollar_value.sub(_collateral_value).mul(PRICE_PRECISION).div(getTokenSharePrice(symbol));
            }
        } else {
            _total_dollar_value = _share_amount.mul(getTokenSharePrice(symbol)).div(PRICE_PRECISION);
        }
        uint256 _actual_dollar_amount = _total_dollar_value.sub((_total_dollar_value.mul(_minting_fee)).div(PRICE_PRECISION));
        require(_dollar_out_min <= _actual_dollar_amount, ">slippage");

        if (_required_share_amount > 0) {
            require(_required_share_amount <= _share_amount, "<shareBalance");
            // Todo: transfer _required_share_amount from sender to contract
            ERC20(token_shares[symbol]).transferFrom(msg.sender, address(this), _required_share_amount);
        }
        if (_collateral_amount > 0) {
            // Todo: transfer _collateral_amount from sender to contract
            ERC20(collateral).transferFrom(msg.sender, address(this), _collateral_amount);
        }
        // Todo: mint UPFI
        Upfi(dollar).mint(msg.sender, _actual_dollar_amount);

    }

    function redeem(
        uint256 _dollar_amount,
        uint256 _share_out_min,
        uint256 _collateral_out_min,
        string memory symbol
    ) external  {
        require(redeem_paused == false, "Redeeming is paused");
        (, , , uint256 _effective_collateral_ratio, , uint256 _redemption_fee) = ITreasury(treasury).info();
        uint256 _dollar_amount_post_fee = _dollar_amount.sub((_dollar_amount.mul(_redemption_fee)).div(PRICE_PRECISION));
        uint256 _collateral_output_amount = 0;
        uint256 _share_output_amount = 0;
        if (_effective_collateral_ratio < COLLATERAL_RATIO_MAX) {
            uint256 _share_output_value = _dollar_amount_post_fee.sub(_dollar_amount_post_fee.mul(_effective_collateral_ratio).div(PRICE_PRECISION));
            _share_output_amount = _share_output_value.mul(PRICE_PRECISION).div(getTokenSharePrice(symbol));
        }

        if (_effective_collateral_ratio > 0) {
            uint256 _collateral_output_value = _dollar_amount_post_fee.div(missing_decimals).mul(_effective_collateral_ratio).div(PRICE_PRECISION);
            _collateral_output_amount = _collateral_output_value.mul(PRICE_PRECISION).div(getCollateralPrice());
        }

        if (_collateral_output_amount > 0) {
            redeem_collateral_balances[msg.sender] = redeem_collateral_balances[msg.sender].add(_collateral_output_amount);
            unclaimed_pool_collateral = unclaimed_pool_collateral.add(_collateral_output_amount);
        }

        if (_share_output_amount > 0) {
            redeem_share_balances[msg.sender] = redeem_share_balances[msg.sender].add(_share_output_amount);
            unclaimed_pool_share = unclaimed_pool_share.add(_share_output_amount);
        }

        
        last_redeemed[msg.sender] = block.number;

        // Check if collateral balance meets and meet output expectation
        require(_collateral_output_amount <= ERC20(collateral).balanceOf(address(this)).sub(unclaimed_pool_collateral), "<collateralBlanace");
        require(_collateral_out_min <= _collateral_output_amount && _share_out_min <= _share_output_amount, ">slippage");

        // Todo: Burn _dollar_amount (burn UPFI)
        Upfi(dollar).burnFrom(msg.sender, _dollar_amount);

        if (_share_output_amount > 0) {
            // Todo: Transfer USDC from contract to sender
            ERC20(token_shares[symbol]).transfer(msg.sender, _share_output_amount);
        }

        if(_collateral_output_amount > 0) {
            // Todo: Transfer Collateral from contract to sender
            ERC20(collateral).transfer(msg.sender, _collateral_output_amount);
        }
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function toggleMinting() external onlyOperator {
        mint_paused = !mint_paused;
    }

    function toggleRedeeming() external onlyOperator {
        redeem_paused = !redeem_paused;
    }

    function setOracle(address _oracle) external onlyOperator {
        oracle = _oracle;
    }

    function setPoolCeiling(uint256 _pool_ceiling) external onlyOperator {
        pool_ceiling = _pool_ceiling;
    }

    function setTreasury(address _treasury) external onlyOperator {
        treasury = _treasury;
    }
}