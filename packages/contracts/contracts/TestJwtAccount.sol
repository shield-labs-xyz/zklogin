// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {ZkLogin} from "./ZkLogin.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";

contract TestJwtAccount {
    ZkLogin.AccountData public accountData;

    constructor(ZkLogin.AccountData memory accountData_) {
        accountData = accountData_;
    }

    function verify(
        ZkLogin.VerificationData calldata verificationData
    ) external {
        bool result = ZkLogin.verifyProof(accountData, verificationData);
        require(result, "JwtAccount: invalid proof");
    }
}
