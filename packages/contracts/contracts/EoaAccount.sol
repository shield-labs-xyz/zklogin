// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {ZkLogin} from "./ZkLogin.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";
import {UltraVerifier} from "../noir/target/jwt_account.sol";
import {WebAuthnP256} from "./WebAuthnP256.sol";
import {ECDSA} from "./ECDSA.sol";

contract EoaAccount {
    ZkLogin.AccountData public accountData;

    uint256 public nonce;

    ECDSA.PublicKey public webauthnPublicKey;

    function setAccountId(
        ECDSA.PublicKey calldata webauthnPublicKey_,
        ZkLogin.AccountData memory accountData_
    ) external {
        require(msg.sender == address(this), "not self");

        webauthnPublicKey = webauthnPublicKey_;

        accountData = accountData_;
    }

    function recover(
        ZkLogin.VerificationData calldata verificationData,
        ECDSA.PublicKey calldata newP256PublicKey
    ) external {
        require(
            keccak256(abi.encode(newP256PublicKey)) ==
                verificationData.jwtNonce,
            "invalid WebAuthn public key"
        );

        require(
            ZkLogin.verifyProof(accountData, verificationData),
            "invalid proof"
        );

        webauthnPublicKey = newP256PublicKey;
    }

    function execute(
        address to,
        bytes calldata data,
        uint256 value,
        ECDSA.Signature calldata signature,
        WebAuthnP256.Metadata calldata metadata
    ) public {
        bytes32 challenge = keccak256(abi.encode(nonce++, to, data, value));
        require(
            WebAuthnP256.verify(
                challenge,
                metadata,
                signature,
                webauthnPublicKey
            )
        );

        (bool success, ) = to.call{value: value}(data);
        require(success, "call failed");
    }

    function getWebAuthnPublicKey()
        external
        view
        returns (ECDSA.PublicKey memory)
    {
        return webauthnPublicKey;
    }

    receive() external payable {}
}
