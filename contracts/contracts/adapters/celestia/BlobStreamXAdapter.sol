// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IDAOracle } from "blobstream-contracts/src/IDAOracle.sol";
import { DAVerifier, SharesProof } from "blobstream-contracts/src/lib/verifier/DAVerifier.sol";
import { IAdapter } from "../../interfaces/IAdapter.sol";

contract BlobStreamXAdapter is IAdapter {
    function verify(bytes calldata data) external view returns (bool) {
        (address bridge, SharesProof memory sharesProof, bytes32 root) = abi.decode(
            data,
            (address, SharesProof, bytes32)
        );
        (bool res, ) = DAVerifier.verifySharesToDataRootTupleRoot(IDAOracle(bridge), sharesProof, root);
        return res;
    }
}
