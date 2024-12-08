// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {UltraVerifier} from "../noir/target/jwt_account.sol";
import {Strings} from "./Strings.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";

library ZkLogin {
    struct AccountData {
        bytes32 accountId;
        bytes32 authProviderId;
        PublicKeyRegistry publicKeyRegistry;
        UltraVerifier proofVerifier;
    }

    struct VerificationData {
        bytes proof;
        uint256 jwtIat;
        bytes32 jwtNonce;
        bytes32 publicKeyHash;
    }

    function verifyProof(
        AccountData memory accountData,
        VerificationData memory verificationData
    ) internal view returns (bool) {
        require(
            accountData.publicKeyRegistry.checkPublicKey(
                accountData.authProviderId,
                verificationData.publicKeyHash
            ),
            "public key hash mismatch"
        );

        bytes memory jwtNonce = bytes(
            Strings.toHexStringWithoutPrefix(verificationData.jwtNonce)
        );

        uint256 staticInputLength = 3;
        bytes32[] memory publicInputs = new bytes32[](
            staticInputLength + jwtNonce.length
        );
        uint256 j = 0;
        publicInputs[j++] = accountData.accountId;
        publicInputs[j++] = bytes32(verificationData.jwtIat);
        publicInputs[j++] = verificationData.publicKeyHash;

        for (uint256 i = 0; i < jwtNonce.length; i++) {
            publicInputs[j++] = bytes32(uint256(uint8(jwtNonce[i])));
        }

        return
            accountData.proofVerifier.verify(
                verificationData.proof,
                publicInputs
            );
    }
}