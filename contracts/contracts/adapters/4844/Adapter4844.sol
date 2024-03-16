// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { IAdapter } from "../../interfaces/IAdapter.sol";

contract Adapter4844 is IAdapter {
    address public constant POINT_EVALUATION_PRECOMPILE_ADDRESS = address(0x0A);
    uint32 public constant FIELD_ELEMENTS_PER_BLOB = 4096;
    uint256 public constant BLS_MODULUS =
        52_435_875_175_126_190_479_447_740_508_185_965_837_690_552_500_527_637_822_603_658_699_938_581_184_513;

    error InvalidCommitmentLength();
    error InvalidProofLength();
    error PointXTooLarge();
    error PointYTooLarge();

    function verify(bytes calldata data) external view returns (bool) {
        (bytes32 blobHash, uint256 x, uint256 y, bytes1[48] memory commitment, bytes1[48] memory proof) = abi.decode(
            data,
            (bytes32, uint256, uint256, bytes1[48], bytes1[48])
        );

        if (x >= BLS_MODULUS) revert PointXTooLarge();
        if (y >= BLS_MODULUS) revert PointYTooLarge();

        (bool ok, bytes memory ret) = POINT_EVALUATION_PRECOMPILE_ADDRESS.staticcall(
            abi.encodePacked(blobHash, x, y, commitment, proof)
        );

        if (!ok) return false;
        if (ret.length != 64) return false;

        bytes32 first;
        bytes32 second;
        assembly {
            first := mload(add(ret, 32))
            second := mload(add(ret, 64))
        }
        if (uint256(first) != FIELD_ELEMENTS_PER_BLOB || uint256(second) != BLS_MODULUS) {
            return false;
        }
        return true;
    }
}
