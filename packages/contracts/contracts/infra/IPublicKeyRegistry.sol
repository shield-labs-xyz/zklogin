// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

interface IPublicKeyRegistry {
    function checkPublicKey(
        bytes32 providerId,
        bytes32 publicKeyHash
    ) external view returns (bool);
}
