# Contributing

## Requirements

- Node.js: recommended to use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- pnpm: `npm install -g pnpm`

## Running locally

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
