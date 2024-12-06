// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

library Strings {
    bytes16 private constant HEX_DIGITS = "0123456789abcdef";

    /**
     * @dev The `value` string doesn't fit in the specified `length`.
     */
    error StringsInsufficientHexLength(uint256 value, uint256 length);

    function toHexStringWithoutPrefix(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory) {
        uint256 localValue = value;
        bytes memory buffer = new bytes(2 * length);
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i - 2] = HEX_DIGITS[localValue & 0xf];
            localValue >>= 4;
        }
        if (localValue != 0) {
            revert StringsInsufficientHexLength(value, length);
        }
        return string(buffer);
    }

    function toHexStringWithoutPrefix(
        bytes32 value
    ) internal pure returns (string memory) {
        return toHexStringWithoutPrefix(uint256(value), 32);
    }
}
