// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

interface IOracle {
    function consult() external view returns (uint256);
}