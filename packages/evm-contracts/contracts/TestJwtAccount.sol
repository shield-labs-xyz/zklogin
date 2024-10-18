// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {JwtVerifier} from "./JwtVerifier.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";
import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";

contract TestJwtAccount is JwtVerifier {
    constructor(
        bytes32 accountId_,
        string memory jwtAud_,
        bytes32 authProviderId_,
        UltraVerifier ultraVerifier_,
        PublicKeyRegistry publicKeyRegistry_
    ) JwtVerifier(ultraVerifier_, publicKeyRegistry_) {
        __JwtVerifier_initialize(accountId_, jwtAud_, authProviderId_);
    }

    function verify(VerificationData calldata verificationData) external {
        bool result = _verifyJwtProof(verificationData);
        require(result, "JwtAccount: invalid proof");
    }
}
