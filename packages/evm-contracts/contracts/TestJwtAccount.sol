// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

import {JwtVerifier} from "./JwtVerifier.sol";
import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";

contract TestJwtAccount is JwtVerifier {
    constructor(
        bytes32 accountId_,
        uint256[18] memory publicKeyLimbs_,
        uint256[18] memory publicKeyRedcLimbs_,
        UltraVerifier ultraVerifier_
    ) JwtVerifier(ultraVerifier_) {
        __JwtVerifier_initialize(
            accountId_,
            publicKeyLimbs_,
            publicKeyRedcLimbs_
        );
    }

    function verify(VerificationData calldata verificationData) external {
        _verify(verificationData);
    }
}
