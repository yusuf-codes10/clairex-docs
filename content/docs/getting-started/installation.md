# Installation

ClaireX requires [Bun](https://bun.sh) as the runtime. It does not support Node.js or Deno.

## Prerequisites

- **Bun** v1.0 or higher
- **TypeScript** 5.0+

## Install Bun

If you don't have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
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

## TypeScript Configuration

ClaireX works with a standard `tsconfig.json`. Ensure you have strict mode enabled for the best type-safety experience:

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

## Verify Installation

Create an `index.ts` file:

```ts
import { ClaireX } from 'clairex-core'

const app = new ClaireX(3000)

app.get('/', (ctx) => {
  return ctx.response.json({ message: 'ClaireX is running!' })
})

app.listen()
```

Run it:

```bash
bun run index.ts
```

Visit `http://localhost:3000` — you should see your JSON response.

## Next Steps

- [Quick Start](/docs/getting-started/quick-start) — Build a full CRUD example
