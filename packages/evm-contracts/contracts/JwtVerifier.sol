// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";
import {Strings} from "./Strings.sol";
import {PublicKeyRegistry, calcPublicKeyHash} from "./PublicKeyRegistry.sol";

// Note: keep in sync with Noir
uint256 constant JWT_AUD_MAX_LEN = 256;

contract JwtVerifier {
    UltraVerifier public immutable proofVerifier;
    PublicKeyRegistry public immutable publicKeyRegistry;

    bytes32 public accountId;
    bytes public jwtAud;
    bytes32 public authProviderId;

    constructor(address proofVerifier_, PublicKeyRegistry publicKeyRegistry_) {
        proofVerifier = UltraVerifier(proofVerifier_);
        publicKeyRegistry = publicKeyRegistry_;
    }

    function __JwtVerifier_initialize(
        bytes32 accountId_,
        string memory jwtAud_,
        bytes32 authProviderId_
    ) internal {
        accountId = accountId_;
        jwtAud = bytes(jwtAud_);
        require(jwtAud.length == JWT_AUD_MAX_LEN, "jwt.aud length mismatch");
        authProviderId = authProviderId_;
    }

    struct VerificationData {
        bytes proof;
        uint256 jwtIat;
        address jwtNonce;
        uint256[18] publicKeyLimbs;
        uint256[18] publicKeyRedcLimbs;
    }

    function _verifyJwtProof(
        VerificationData memory verificationData
    ) internal view returns (bool) {
        require(
            publicKeyRegistry.checkPublicKey(
                authProviderId,
                calcPublicKeyHash(
                    verificationData.publicKeyLimbs,
                    verificationData.publicKeyRedcLimbs
                )
            ),
            "public key hash mismatch"
        );

        bytes memory jwtNonce = bytes(
            Strings.toHexStringWithoutPrefix(verificationData.jwtNonce)
        );

        uint256 staticInputLength = 2;
        bytes32[] memory publicInputs = new bytes32[](
            staticInputLength +
                JWT_AUD_MAX_LEN +
                jwtNonce.length +
                verificationData.publicKeyLimbs.length +
                verificationData.publicKeyRedcLimbs.length
        );
        uint256 j = 0;
        publicInputs[j++] = accountId;
        publicInputs[j++] = bytes32(verificationData.jwtIat);

        for (uint256 i = 0; i < JWT_AUD_MAX_LEN; i++) {
            publicInputs[j++] = bytes32(uint256(uint8(jwtAud[i])));
        }

        for (uint256 i = 0; i < jwtNonce.length; i++) {
            publicInputs[j++] = bytes32(uint256(uint8(jwtNonce[i])));
        }

        for (uint256 i = 0; i < verificationData.publicKeyLimbs.length; i++) {
            publicInputs[j++] = bytes32(verificationData.publicKeyLimbs[i]);
        }

        for (
            uint256 i = 0;
            i < verificationData.publicKeyRedcLimbs.length;
            i++
        ) {
            publicInputs[j++] = bytes32(verificationData.publicKeyRedcLimbs[i]);
        }

        return proofVerifier.verify(verificationData.proof, publicInputs);
    }
}
