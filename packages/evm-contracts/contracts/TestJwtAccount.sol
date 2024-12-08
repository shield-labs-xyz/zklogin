// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {JwtVerifier} from "./JwtVerifier.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";

contract TestJwtAccount {
    JwtVerifier.AccountData public accountData;

    constructor(JwtVerifier.AccountData memory accountData_) {
        accountData = accountData_;
    }

    function verify(
        JwtVerifier.VerificationData calldata verificationData
    ) external {
        bool result = JwtVerifier.verifyJwtProof(accountData, verificationData);
        require(result, "JwtAccount: invalid proof");
    }
}
