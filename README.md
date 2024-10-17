# Monorepo

## Requirements

- Node.js: recommended to use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- pnpm: `npm install -g pnpm`

## Project structure

- `apps/` - Applications
- `packages/` - Packages

## Common scripts

Scripts follow the same pattern in all `apps/` and `packages/`:

- `pnpm dev` - Start in development mode
- `pnpm build` - Build for production
- `pnpm test:lint` - Type-check and lint code
- `pnpm test` - Run tests and `pnpm test:lint`
- `pnpm compile` - If available, compile contracts
