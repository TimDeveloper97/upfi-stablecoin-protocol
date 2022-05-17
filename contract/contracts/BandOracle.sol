// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
pragma experimental ABIEncoderV2;

import "./interfaces/IStdReference.sol";

contract BandOracle {
    IStdReference ref;

    uint256 public price;

    constructor(IStdReference _ref) {
        ref = _ref;
    }

    function getPrice(string memory base, string memory quote) external view returns (uint256){
        IStdReference.ReferenceData memory data = ref.getReferenceData(base, quote);
        return data.rate;
    }

    function savePrice(string memory base, string memory quote) external {
        IStdReference.ReferenceData memory data = ref.getReferenceData(base,quote);
        price = data.rate;
    }
}