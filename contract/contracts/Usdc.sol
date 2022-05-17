// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Usdc is Ownable, Initializable, ERC20Burnable {
    using SafeMath for uint256;

    mapping(address => uint256) public minters; // minter's address => minter's max cap
    mapping(address => uint256) public minters_minted;

    /* ========== EVENTS ========== */
    event MinterUpdate(address indexed account, uint256 cap);
    event MaxTotalSupplyUpdated(uint256 _newCap);

    /* ========== Modifiers =============== */

    modifier onlyMinter() {
        require(minters[msg.sender] > 0, "Only minter can interact");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function initialize(uint256 _initial) public initializer {
        super._mint(_msgSender(), _initial); // mint initial supply to add liquidity
    }

    // Airdrop
    function airdrop(address account) external {
        uint256 AIRDROP_AMOUNT = 100 ether;
        _mint(account, AIRDROP_AMOUNT);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function mint(address _recipient, uint256 _amount) public onlyMinter {
        minters_minted[_msgSender()] = minters_minted[_msgSender()].add(
            _amount
        );
        require(
            minters[_msgSender()] >= minters_minted[_msgSender()],
            "Minting amount exceeds minter cap"
        );
        _mint(_recipient, _amount);
    }

    /* ========== OWNER FUNCTIONS ========== */

    function setMinter(address _account, uint256 _minterCap)
        external
        onlyOwner
    {
        require(_account != address(0), "invalid address");
        require(
            minters_minted[_account] <= _minterCap,
            "Minter already minted a larger amount than new cap"
        );
        minters[_account] = _minterCap;
        emit MinterUpdate(_account, _minterCap);
    }
}
