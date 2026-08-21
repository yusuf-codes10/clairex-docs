# Installation

## Requirements

[Bun](https://bun.sh) v1.0 or higher. ClaireX targets Bun only — it is built on `Bun.serve` and uses Bun's plugin API.

```bash
curl -fsSL https://bun.sh/install | bash
bun --version
```

## Scaffold a project

The fastest way to start, and the recommended one:

```bash
bun create clairex my-app
cd my-app
bun install
bun dev
```

You get a running API on `http://localhost:3000` with a complete `users` resource — routes, validation, and error handling already wired up.

```bash
curl http://localhost:3000/users
```

Continue to [Your First API](/docs/getting-started/first-api) for a tour of what was generated.

## Manual installation

If you would rather assemble it yourself:

```bash
mkdir my-app && cd my-app
bun init -y
bun add @clairex/core
```

### Configure `bunfig.toml`

Create `bunfig.toml` in the project root:

```toml
preload = ["@clairex/core/plugin"]
```

::alert{type="warning"}
**This step is required if you use `.claire` files.** The line registers the ClaireX loader. Without it, Bun parses `.claire` files with no loader and their exports come back empty — you get `Export named 'userKey' not found`, which does not hint at the real cause.

If you only use `.ts` files, you can skip this.
::

### Configure `tsconfig.json`

ClaireX expects strict, explicit typing:

```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "types": ["bun"],

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    "strict": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  },
  "include": ["src/**/*"]
}
```

`noImplicitOverride` matters — ClaireX relies on `override` being explicit when you extend its classes.

### Minimal app

```ts
// src/index.ts
import { ClaireX } from "@clairex/core";
import { userKey } from "./keys/user.key";

new ClaireX(3000).unlock(new userKey()).listen();
```

```json
// package.json
{
  "scripts": {
    "dev": "bun run src/index.ts"
  }
}
```

## Editor support (optional)

`.claire` files work at runtime without any editor setup, but VS Code will not resolve `.claire` imports on its own. The ClaireX extension fixes that and gives `.claire` files the full TypeScript experience.

```bash
code --install-extension packages/vscode-extension/clairex-vscode-0.1.0.vsix
```

This is optional. Nothing about running your app depends on it. See [Editor Setup](/docs/claire-files/editor-setup).

## Packages

| Package | Install | Purpose |
|---|---|---|
| `@clairex/core` | `bun add @clairex/core` | The framework |
| `create-clairex` | `bun create clairex` | Project scaffolding |
| `@clairex/typescript-plugin` | bundled in the extension | Resolves `.claire` imports in the editor |
| `clairex-vscode` | `.vsix` | `.claire` editing support |

## Next

- [Your First API](/docs/getting-started/first-api)
- [Project Structure](/docs/getting-started/project-structure)
