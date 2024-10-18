// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/core/Helpers.sol";
import "@account-abstraction/contracts/samples/callback/TokenCallbackHandler.sol";

import {UltraVerifier} from "@repo/circuits/target/jwt_account.sol";
import {PublicKeyRegistry} from "./PublicKeyRegistry.sol";
import {JwtVerifier} from "./JwtVerifier.sol";

uint256 constant OWNER_EXPIRATION_TIME = 1 hours;

/**
 * minimal account.
 *  this is sample minimal account.
 *  has execute, eth handling methods
 *  has a single signer that can send requests through the entryPoint.
 */
contract SimpleAccount is
    BaseAccount,
    TokenCallbackHandler,
    UUPSUpgradeable,
    Initializable,
    JwtVerifier
{
    IEntryPoint private immutable _entryPoint;

    struct Owner {
        address owner;
        uint256 expirationTimestamp;
    }
    Owner public ownerInfo;

    constructor(
        IEntryPoint anEntryPoint,
        UltraVerifier ultraVerifier_,
        PublicKeyRegistry publicKeyRegistry_
    ) JwtVerifier(ultraVerifier_, publicKeyRegistry_) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    struct InitializeParams {
        bytes32 accountId;
        string jwtAud;
        bytes32 authProviderId;
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
     * the implementation by calling `upgradeTo()`
     */
    function initialize(
        InitializeParams calldata params
    ) public virtual initializer {
        __JwtVerifier_initialize(
            params.accountId,
            params.jwtAud,
            params.authProviderId
        );
    }

    /// implement template method of BaseAccount
    function _validateSignature(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(userOpHash);
        if (currentOwner() != ECDSA.recover(hash, userOp.signature))
            return SIG_VALIDATION_FAILED;
        return SIG_VALIDATION_SUCCESS;
    }

    function currentOwner() public view returns (address) {
        Owner memory ownerInfo_ = ownerInfo;
        if (block.timestamp > ownerInfo_.expirationTimestamp) {
            return address(0);
        }
        return ownerInfo_.owner;
    }

    function setOwner(VerificationData calldata verificationData) public {
        uint256 expirationTimestamp = block.timestamp + OWNER_EXPIRATION_TIME;
        require(
            expirationTimestamp > block.timestamp,
            "JwtAccount: expired proof"
        );
        bool result = _verifyJwtProof(verificationData);
        require(result, "JwtAccount: invalid proof");

        ownerInfo = Owner({
            owner: verificationData.jwtNonce,
            expirationTimestamp: expirationTimestamp
        });
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     * @param dest destination address to call
     * @param value the value to pass in this call
     * @param func the calldata to pass in this call
     */
    function execute(
        address dest,
        uint256 value,
        bytes calldata func
    ) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    /// @notice Represents a call to make.
    struct Call {
        /// @dev The address to call.
        address target;
        /// @dev The value to send when making the call.
        uint256 value;
        /// @dev The data of the call.
        bytes data;
    }

    /**
     * execute a sequence of transactions
     */
    function executeBatch(Call[] calldata calls) external {
        _requireFromEntryPointOrOwner();
        for (uint256 i; i < calls.length; i++) {
            _call(calls[i].target, calls[i].value, calls[i].data);
        }
    }

    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value: msg.value}(address(this));
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(
        address payable withdrawAddress,
        uint256 amount
    ) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    // Require the function call went through EntryPoint or owner
    function _requireFromEntryPointOrOwner() internal view {
        require(
            msg.sender == address(entryPoint()) || msg.sender == currentOwner(),
            "account: not Owner or EntryPoint"
        );
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(
            msg.sender == currentOwner() || msg.sender == address(this),
            "only owner"
        );
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    function _authorizeUpgrade(
        address newImplementation
    ) internal view override {
        (newImplementation);
        _onlyOwner();
    }
}
