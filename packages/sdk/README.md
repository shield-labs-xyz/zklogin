# zkLogin SDK

## Usage

### Solidity contract

Write a simple account contract that is controlled by an EOA. The EOA can be changed only if you provide a valid zkLogin proof.

```solidity
import {ZkLogin} from "@shield-labs/zklogin-contracts/contracts/ZkLogin.sol";

contract ZkLoginAccount {
    ZkLogin.AccountData public accountData;
    address public owner;

    constructor(ZkLogin.AccountData memory data) {
        accountData = data;
    }

    function recover(bytes calldata proof, bytes32 publicKeyHash, uint256 jwtIat, address newOwner) public view returns (address) {
        require(jwtIat + 1 hours >= block.timestamp, "jwt expired");
        require(
            ZkLogin.verifyProof(
                accountData,
                ZkLogin.VerificationData({
                    proof: proof,
                    publicKeyHash: publicKeyHash,
                    jwtIat: jwtIat,
                    jwtNonce: keccak256(abi.encode(newOwner))
                })
            ),
            "invalid proof"
        );
        owner = newOwner;
    }
}
```

### JavaScript

Write a script to request a JWT from Google, deploy an account contract and update the owner address.

```ts
import { encodeAbiParameters, parseAbiParameters, keccak256 } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { zklogin } from "@shield-labs/zklogin";

const zkLogin = new zklogin.ZkLogin();

// EOA owner of the account
const owner = privateKeyToAccount(generatePrivateKey());

// Must match solidity encoding
const jwtNonce = keccak256(
  encodeAbiParameters(parseAbiParameters("address"), [owner.address]),
).slice("0x".length);
// Request JWT from Google with `jwt.payload.nonce` set to `jwtNonce`
const jwt: string = await getJwtFromGoogle({ nonce: jwtNonce });

// Deploy account contract
const chain = baseSepolia;
const accountData = await zkLogin.getAccountDataFromJwt(jwt, chain.id);
const hash = await walletClient.deployContract({
  abi,
  account,
  bytecode,
  args: [accountData],
});
const { contractAddress } = await publicClient.waitForTransactionReceipt({
  hash,
});

// Generate a proof of JWT ownership with nonce linked to the EOA owner
const { proof, input } = await zkLogin.proveJwt(jwt, jwtNonce);

// Send proof to chain to update the owner address
const hash = await writeContract({
  address,
  abi,
  functionName: "recover",
  args: [proof, input.public_key_hash, input.jwt_iat, owner.address],
});
await publicClient.waitForTransactionReceipt({ hash });

// Verify that the owner was updated
const ownerOnChain = await publicClient.readContract({
  address,
  abi,
  functionName: "owner",
});
assert(isAddressEqual(ownerOnChain, owner.address));
```
