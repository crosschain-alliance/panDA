// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAdapter } from "../../interfaces/IAdapter.sol";

interface IDataAvailabilityRouter {
    function roots(uint32 blockNumber) external view returns (bytes32 root);
}

contract AvailAdapter is IAdapter {
    address public immutable ROUTER;

    error InvalidRoot();

    constructor(address router) {
        ROUTER = router;
    }

    function verify(bytes calldata data) public view virtual returns (bool) {
        (
            uint32 blockNumber,
            bytes32[] memory proof,
            uint256 width, // number of leaves
            uint256 index,
            bytes32 leaf
        ) = abi.decode(data, (uint32, bytes32[], uint256, uint256, bytes32));

        bool isMember = false;
        bytes32 rootHash = IDataAvailabilityRouter(ROUTER).roots(blockNumber);
        if (rootHash == bytes32(0)) revert InvalidRoot();
        assembly ("memory-safe") {
            if mload(proof) {
                let i := add(proof, 0x20)
                let end := add(i, shl(5, mload(proof)))

                for {

                } 1 {

                } {
                    let leafSlot := shl(5, and(0x1, index))
                    if eq(add(index, 1), width) {
                        leafSlot := 0x20
                    }
                    mstore(leafSlot, leaf)
                    mstore(xor(leafSlot, 32), calldataload(i))
                    leaf := keccak256(0, 64)
                    index := shr(1, index)
                    i := add(i, 32)
                    width := add(shr(1, sub(width, 1)), 1)
                    if iszero(lt(i, end)) {
                        break
                    }
                }
            }
            isMember := eq(leaf, rootHash)
        }
        return isMember;
    }
}
