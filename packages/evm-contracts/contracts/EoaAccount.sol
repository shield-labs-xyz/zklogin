// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {JwtVerifierP256} from "./JwtVerifierP256.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";
import {UltraVerifier} from "../noir/target/jwt_account.sol";

contract EoaAccount is JwtVerifierP256 {
    bytes32 public accountId;
    bytes32 public authProviderId = keccak256("google");
    PublicKeyRegistry public publicKeyRegistry;
    UltraVerifier public proofVerifier;

    struct WebauthnPublicKey {
        uint256 x;
        uint256 y;
    }
    WebauthnPublicKey public webauthnPublicKey;

    function setAccountId(
        WebauthnPublicKey calldata webauthnPublicKey_,
        bytes32 accountId_,
        PublicKeyRegistry publicKeyRegistry_,
        UltraVerifier proofVerifier_
    ) external {
        require(msg.sender == address(this), "not self");
        webauthnPublicKey = webauthnPublicKey_;

        accountId = accountId_;
        publicKeyRegistry = publicKeyRegistry_;
        proofVerifier = proofVerifier_;
    }

    function recover(
        VerificationData calldata verificationData,
        WebauthnPublicKey calldata newP256PublicKey
    ) external {
        require(
            _verifyJwtProof(
                verificationData,
                accountId,
                authProviderId,
                publicKeyRegistry,
                proofVerifier
            ),
            "invalid proof"
        );
        require(
            // TODO(security): don't truncate hash
            address(bytes20(keccak256(abi.encode(newP256PublicKey)))) ==
                (verificationData.jwtNonce),
            "invalid p256 public key"
        );
        webauthnPublicKey = newP256PublicKey;
    }

    function dummy() external {}

    function hello() external pure returns (string memory) {
        return "hello world";
    }
}
