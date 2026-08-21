# .claire Files

A `.claire` file is TypeScript with extra rules enforced when the file loads.

```ts
// user.key.claire
export class userKey extends ClaireKey {
  constructor() {
    super("/users");
  }

  protected register(): void {
    this.routes("get", "/", this.getUsers);
  }

  private getUsers(c: ClaireContext): Response {
    return c.response.json(users);
  }
}
```

That is ordinary TypeScript. The extension does not add syntax, it adds enforcement.

## Why

ClaireX has conventions: everything is a class, every method declares its return type. Conventions rely on discipline, and discipline erodes.

The `.claire` extension turns those conventions into rules the runtime enforces. A file that breaks them stops the process before the server starts.

```
   ╔════════════════════════════════════════════════════════╗
   ║  ClairePlugin — 1 violation                             ║
   ╠════════════════════════════════════════════════════════╣
   ║  user.key.claire:42  Missing explicit return type       ║
   ║                                                        ║
   ╚════════════════════════════════════════════════════════╝
```

## Setup

One line in `bunfig.toml` at your project root:

```toml
preload = ["@clairex/core/plugin"]
```

::alert{type="warning"}
Without this line, Bun parses `.claire` files with no loader and their exports come back empty. The error you get is `Export named 'userKey' not found in module '...user.key.claire'`, which does not point at the real cause.

Scaffolded projects include this file already.
::

## How it works

```
.claire file imported
        │
        ▼
Bun plugin intercepts (filter: /\.claire$/)
        │
        ▼
read the file, check it against the ClaireX rules
        │
        ├── violation  → styled terminal error → exit
        └── valid      → hand to Bun as TypeScript
```

Because the check happens at load time, the file is validated every run, there is no build step to forget and no cache to go stale.

## What is enforced

| Rule | Requires |
|---|---|
| 1 | The file exports a class |
| 2 | Methods with an access modifier declare an explicit return type |

See [Rules](/docs/claire-files/rules) for detail and examples.

## Limitation worth knowing

Validation runs **on load**, which means only files that are actually imported get checked. An orphan `.claire` file that nothing imports is never validated.

This is a consequence of the design rather than an oversight: the loader is a hard gate on code that runs, not a linter over your whole project.

## When to use it

Use `.claire` for the class-based parts of your app, keys, validators, middleware. Those are exactly where the rules add value.

Use plain `.ts` for types, constants, and helpers. A rule requiring every file to export a class would be actively wrong for a file of type aliases.

Both can import each other freely.

## Editor support

VS Code does not resolve `.claire` imports on its own, and will underline them in red. The ClaireX extension fixes that and gives `.claire` files the complete TypeScript experience.

It is optional, your app runs identically without it. See [Editor Setup](/docs/claire-files/editor-setup).

## Next

- [Rules](/docs/claire-files/rules)
- [Editor Setup](/docs/claire-files/editor-setup)
