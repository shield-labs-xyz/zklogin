// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";

contract JwtVerifier {
    bytes32 public accountId;
    uint256[18] public publicKeyLimbs;
    uint256[18] public publicKeyRedcLimbs;
    UltraVerifier public ultraVerifier;

    struct VerificationData {
        bytes proof;
        uint256 jwtIat;
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
        // TODO(security): check jwt.aud and jwt.nonce
        bytes32[] memory publicInputs = new bytes32[](
            2 + publicKeyLimbs.length + publicKeyRedcLimbs.length
        );
        publicInputs[0] = accountId;
        publicInputs[1] = bytes32(verificationData.jwtIat);
        for (uint256 i = 0; i < publicKeyLimbs.length; i++) {
            publicInputs[2 + i] = bytes32(publicKeyLimbs[i]);
        }
        for (uint256 i = 0; i < publicKeyRedcLimbs.length; i++) {
            publicInputs[2 + publicKeyLimbs.length + i] = bytes32(
                publicKeyRedcLimbs[i]
            );
        }

        return ultraVerifier.verify(verificationData.proof, publicInputs);
    }
}
