// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";
import {Strings} from "./Strings.sol";

// Note: keep in sync with Noir
uint256 constant JWT_AUD_MAX_LEN = 256;

contract JwtVerifier {
    UltraVerifier public immutable ultraVerifier;

    bytes32 public accountId;
    uint256[18] public publicKeyLimbs;
    uint256[18] public publicKeyRedcLimbs;

    constructor(UltraVerifier ultraVerifier_) {
        ultraVerifier = ultraVerifier_;
    }

    function __JwtVerifier_initialize(
        bytes32 accountId_,
        uint256[18] memory publicKeyLimbs_,
        uint256[18] memory publicKeyRedcLimbs_
    ) internal {
        accountId = accountId_;
        publicKeyLimbs = publicKeyLimbs_;
        publicKeyRedcLimbs = publicKeyRedcLimbs_;
    }

    struct VerificationData {
        bytes proof;
        uint256 jwtIat;
        string jwtAud;
        address jwtNonce;
    }

    function _verify(
        VerificationData memory verificationData
    ) internal view returns (bool) {
        bytes memory jwtNonce = bytes(
            Strings.toHexStringWithoutPrefix(verificationData.jwtNonce)
        );

        uint256 staticInputLength = 2;
        bytes32[] memory publicInputs = new bytes32[](
            staticInputLength +
                JWT_AUD_MAX_LEN +
                jwtNonce.length +
                publicKeyLimbs.length +
                publicKeyRedcLimbs.length
        );
        uint256 j = 0;
        publicInputs[j++] = accountId;
        publicInputs[j++] = bytes32(verificationData.jwtIat);

        bytes memory jwtAudBytes = bytes(verificationData.jwtAud);
        require(
            jwtAudBytes.length == JWT_AUD_MAX_LEN,
            "jwt.aud length mismatch"
        );
        for (uint256 i = 0; i < JWT_AUD_MAX_LEN; i++) {
            publicInputs[j++] = bytes32(uint256(uint8(jwtAudBytes[i])));
        }

        for (uint256 i = 0; i < jwtNonce.length; i++) {
            publicInputs[j++] = bytes32(uint256(uint8(jwtNonce[i])));
        }

        for (uint256 i = 0; i < publicKeyLimbs.length; i++) {
            publicInputs[j++] = bytes32(publicKeyLimbs[i]);
        }

        for (uint256 i = 0; i < publicKeyRedcLimbs.length; i++) {
            publicInputs[j++] = bytes32(publicKeyRedcLimbs[i]);
        }

        return ultraVerifier.verify(verificationData.proof, publicInputs);
    }
}
