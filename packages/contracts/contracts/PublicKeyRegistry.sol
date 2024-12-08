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

    struct PublicKeyValidity {
        bytes32 providerId;
        bytes32 publicKeyHash;
        bool valid;
    }

    function setPublicKeysValid(
        PublicKeyValidity[] calldata validity
    ) external onlyOwner {
        for (uint256 i = 0; i < validity.length; i++) {
            PublicKeyValidity calldata v = validity[i];
            isPublicKeyHashValid[v.providerId][v.publicKeyHash] = v.valid;
        }
    }

    function checkPublicKey(
        bytes32 providerId,
        bytes32 publicKeyHash
    ) external view returns (bool) {
        return isPublicKeyHashValid[providerId][publicKeyHash];
    }
}
