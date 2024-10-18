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

    function getPublicKeyHash(
        uint256[18] memory publicKeyLimbs,
        uint256[18] memory publicKeyRedcLimbs
    ) external pure returns (bytes32) {
        return calcPublicKeyHash(publicKeyLimbs, publicKeyRedcLimbs);
    }
}

function calcPublicKeyHash(
    uint256[18] memory publicKeyLimbs,
    uint256[18] memory publicKeyRedcLimbs
) pure returns (bytes32) {
    return keccak256(abi.encodePacked(publicKeyLimbs, publicKeyRedcLimbs));
}
