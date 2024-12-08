// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {JwtVerifier} from "./JwtVerifier.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";

contract TestJwtAccount is JwtVerifier {
    AccountData public accountData;

    constructor(AccountData memory accountData_) {
        accountData = accountData_;
    }

    function verify(VerificationData calldata verificationData) external {
        bool result = _verifyJwtProof(accountData, verificationData);
        require(result, "JwtAccount: invalid proof");
    }
}
