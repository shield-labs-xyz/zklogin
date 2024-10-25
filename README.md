<img align="right" width="150" height="150" top="100" src="https://github.com/user-attachments/assets/1494344f-f013-4872-bed6-ac7f116f35e3">

# zkLogin for Base blockchain

Sign in with Apple/Google on Base. Self-custodial. Try it now: <https://zklogin.oleh.wtf>

<a href="https://zklogin.oleh.wtf">
<img src="https://github.com/user-attachments/assets/6c3a34c9-7f11-4275-9c55-8714ac55ffa3" width="200"></a>

## How it works

Create a Base(or any EVM) account using "Sign in with Google" flow (Apple is in progress). The account is tied to your Google account and can only be controlled by you.

zkLogin uses zero knowledge proofs to verify the ownership of a Google account to sign transactions on-chain without compromising on security or privacy. Create a self-custodial account now: <https://zklogin.oleh.wtf>.

zkLogin uses [Noir](https://noir-lang.org/) to generate zk proofs and verify them on-chain.

## Running locally

### Requirements

- Node.js: recommended to use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- pnpm: `npm install -g pnpm`

### Run UI

Fill in your .env file and run:

```bash
cd apps/interface
pnpm dev
```

### Solidity contracts

Test:

```bash
pnpm run test
```

Deploy:

```bash
pnpm run deploy --network baseSepolia --gasprice 0.002gwei
```

### Project structure

- `apps/` - Applications
- `packages/` - Packages

### Common scripts

Scripts follow the same pattern in all `apps/` and `packages/`:

- `pnpm dev` - Start in development mode
- `pnpm build` - Build for production
- `pnpm test:lint` - Type-check and lint code
- `pnpm test` - Run tests and `pnpm test:lint`
- `pnpm compile` - If available, compile contracts
