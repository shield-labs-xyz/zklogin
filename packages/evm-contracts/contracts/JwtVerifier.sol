// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";

// Note: keep in sync with Noir
uint256 constant JWT_AUD_MAX_LEN = 256;

contract JwtVerifier {
    bytes32 public accountId;
    uint256[18] public publicKeyLimbs;
    uint256[18] public publicKeyRedcLimbs;
    UltraVerifier public ultraVerifier;

    struct VerificationData {
        bytes proof;
        uint256 jwtIat;
        string jwtAud;
    }

    function __JwtVerifier_initialize(
        bytes32 accountId_,
        uint256[18] memory publicKeyLimbs_,
        uint256[18] memory publicKeyRedcLimbs_,
        UltraVerifier ultraVerifier_
    ) internal {
        accountId = accountId_;
        publicKeyLimbs = publicKeyLimbs_;
        publicKeyRedcLimbs = publicKeyRedcLimbs_;
        ultraVerifier = ultraVerifier_;
    }

    function _verify(
        VerificationData memory verificationData
    ) internal view returns (bool) {
        uint256 staticInputLength = 2;
        // TODO(security): check jwt.aud and jwt.nonce
        bytes32[] memory publicInputs = new bytes32[](
            staticInputLength +
                JWT_AUD_MAX_LEN +
                publicKeyLimbs.length +
                publicKeyRedcLimbs.length
        );
        publicInputs[0] = accountId;
        publicInputs[1] = bytes32(verificationData.jwtIat);

        bytes memory jwtAudBytes = bytes(verificationData.jwtAud);
        require(
            jwtAudBytes.length == JWT_AUD_MAX_LEN,
            "jwt.aud length mismatch"
        );
        for (uint256 i = 0; i < JWT_AUD_MAX_LEN; i++) {
            publicInputs[staticInputLength + i] = bytes32(
                uint256(uint8(jwtAudBytes[i]))
            );
        }

        for (uint256 i = 0; i < publicKeyLimbs.length; i++) {
            publicInputs[staticInputLength + JWT_AUD_MAX_LEN + i] = bytes32(
                publicKeyLimbs[i]
            );
        }
        for (uint256 i = 0; i < publicKeyRedcLimbs.length; i++) {
            publicInputs[
                staticInputLength + JWT_AUD_MAX_LEN + publicKeyLimbs.length + i
            ] = bytes32(publicKeyRedcLimbs[i]);
        }

        return ultraVerifier.verify(verificationData.proof, publicInputs);
    }
}
