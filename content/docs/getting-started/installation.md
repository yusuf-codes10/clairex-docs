# Installation

ClaireX is built for [Bun](https://bun.sh) — a fast all-in-one JavaScript runtime. You need Bun installed before using ClaireX.

## Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

## Install Bun

If you don't already have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

Verify it's working:

```bash
bun --version
```

## Create a New Project

```bash
mkdir my-app
cd my-app
bun init
```

## Install ClaireX

```bash
bun add clairex-core
```

## Project Structure

A typical ClaireX project follows this structure:

```
my-app/
├── src/
│   ├── keys/
│   │   └── users.key.ts
│   ├── validators/
│   │   └── userValidator.ts
│   ├── middlewares/
│   │   └── auth.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## TypeScript Configuration

ClaireX uses explicit typing throughout. Ensure your `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["bun-types"]
  }
}
```

## Next Steps

- [Quick Start](/docs/getting-started/quick-start) — Build your first ClaireX application
