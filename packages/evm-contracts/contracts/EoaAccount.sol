// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import {JwtVerifierP256} from "./JwtVerifierP256.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";
import {UltraVerifier} from "../noir/target/jwt_account.sol";
import {WebAuthnP256} from "./WebAuthnP256.sol";
import {ECDSA} from "./ECDSA.sol";

contract EoaAccount is JwtVerifierP256 {
    bytes32 public accountId;
    bytes32 public authProviderId;
    PublicKeyRegistry public publicKeyRegistry;
    UltraVerifier public proofVerifier;

    uint256 public nonce;

    ECDSA.PublicKey public webauthnPublicKey;

    function setAccountId(
        ECDSA.PublicKey calldata webauthnPublicKey_,
        bytes32 accountId_,
        bytes32 authProviderId_,
        PublicKeyRegistry publicKeyRegistry_,
        UltraVerifier proofVerifier_
    ) external {
        require(msg.sender == address(this), "not self");

        webauthnPublicKey = webauthnPublicKey_;

        accountId = accountId_;
        authProviderId = authProviderId_;
        publicKeyRegistry = publicKeyRegistry_;
        proofVerifier = proofVerifier_;
    }

    function recover(
        VerificationData calldata verificationData,
        ECDSA.PublicKey calldata newP256PublicKey
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

    function getDigest(
        address to,
        bytes memory data,
        uint256 value
    ) public view returns (bytes32) {
        return keccak256(abi.encode(nonce, to, data, value));
    }

    function dummy() external {}

    function hello() external pure returns (string memory) {
        return "hello world";
    }
}
