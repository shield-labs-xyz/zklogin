
# zkLogin for Ethereum/Base

Sign in with Apple/Google on any EVM chain. Self-custodial. Try it now: <https://zklogin.shield-labs.xyz>

<a href="https://zklogin.shield-labs.xyz">

> ## WARNING: zkLogin is not audited and should not be used in production

## How it works

Create a Base(or any EVM) account using "Sign in with Google" flow (Apple is in progress). The account is tied to your Google account and can only be controlled by you.

zkLogin uses zero knowledge proofs to verify the ownership of a Google account to sign transactions on-chain without compromising on security or privacy. Create a self-custodial account now: <https://zklogin.shield-labs.xyz>.

zkLogin uses [Noir](https://noir-lang.org/) to generate zk proofs and verify them on-chain.

Checkout slides from my talk at NoirCon 0 for an in depth explanation of the technology: [NoirCon 0 zkLogin slides](https://www.canva.com/design/DAGVuaqexRM/Tq8sEd2AE60vh3PZwbsWjw/view?utm_content=DAGVuaqexRM&utm_campaign=designshare&utm_medium=link&utm_source=editor).

## Integrate into your project

[zkLogin SDK Docs](./packages/sdk/README.md)

## Contributing

[Contributing guide](./CONTRIBUTING.md)
