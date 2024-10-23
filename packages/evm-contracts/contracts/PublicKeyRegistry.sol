// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PublicKeyRegistry is Ownable(msg.sender) {
    /// providerId => publicKeyHash => isValid
    mapping(bytes32 => mapping(bytes32 => bool)) public isPublicKeyHashValid;

    function setPublicKeyValid(
        bytes32 providerId,
        bytes32 publicKeyHash,
        bool valid
    ) external onlyOwner {
        isPublicKeyHashValid[providerId][publicKeyHash] = valid;
    }

    function checkPublicKey(
        bytes32 providerId,
        bytes32 publicKeyHash
    ) external view returns (bool) {
        return isPublicKeyHashValid[providerId][publicKeyHash];
    }
}
