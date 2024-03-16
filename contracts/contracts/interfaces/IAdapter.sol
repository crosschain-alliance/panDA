// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAdapter {
    function verify(bytes calldata data) external view returns (bool);
}
