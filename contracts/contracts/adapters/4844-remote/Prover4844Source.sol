// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Adapter4844Source {
    address public constant POINT_EVALUATION_PRECOMPILE_ADDRESS = address(0x0A);
    uint32 public constant FIELD_ELEMENTS_PER_BLOB = 4096;
    uint256 public constant BLS_MODULUS =
        52_435_875_175_126_190_479_447_740_508_185_965_837_690_552_500_527_637_822_603_658_699_938_581_184_513;

    mapping(bytes32 => bytes32) private _commitments;

    error InvalidCommitmentLength();
    error InvalidProofLength();
    error PointXTooLarge();
    error PointYTooLarge();
    error FailedToEvaluate();

    function prove(
        bytes32 blobHash,
        uint256 x,
        uint256 y,
        bytes1[48] calldata commitment,
        bytes1[48] memory proof
    ) external {
        if (x >= BLS_MODULUS) revert PointXTooLarge();
        if (y >= BLS_MODULUS) revert PointYTooLarge();

        (bool ok, bytes memory ret) = POINT_EVALUATION_PRECOMPILE_ADDRESS.staticcall(
            abi.encodePacked(blobHash, x, y, commitment, proof)
        );

        if (!ok) revert FailedToEvaluate();
        if (ret.length != 64) revert FailedToEvaluate();

        bytes32 first;
        bytes32 second;
        assembly {
            first := mload(add(ret, 32))
            second := mload(add(ret, 64))
        }
        if (uint256(first) != FIELD_ELEMENTS_PER_BLOB || uint256(second) != BLS_MODULUS) {
            revert FailedToEvaluate();
        }

        // NOTE: this is needed to prove the blob on other chains using axiom
        _commitments[blobHash] = keccak256(abi.encode(commitment));
    }
}
