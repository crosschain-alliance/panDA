// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAdapter } from "./interfaces/IAdapter.sol";

contract Panda {
    function verify(
        address[] calldata adapters,
        bytes[] calldata data,
        uint256 threshold
    ) external view returns (bool) {
        uint256 ok = 0;
        for (uint256 i = 0; i < adapters.length; ) {
            if (IAdapter(adapters[i]).verify(data[i])) {
                unchecked {
                    ++ok;
                }
            }

            unchecked {
                ++i;
            }
        }

        return ok >= threshold;
    }
}
