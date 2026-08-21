# Project Structure

ClaireX does not enforce a directory layout, but the scaffolded project follows one that scales.

## The convention

```
my-app/
├── bunfig.toml                       registers the .claire loader
├── tsconfig.json
├── package.json
└── src/
    ├── index.ts                      the app — unlock keys, start the server
    ├── types/
    │   ├── user.ts
    │   └── post.ts
    ├── keys/
    │   ├── user.key.claire
    │   └── post.key.claire
    ├── validators/
    │   ├── user.validator.claire
    │   └── post.validator.claire
    └── middlewares/
        └── auth.guard.claire
```

## One folder per concern

**`types/`** — plain TypeScript types. The compile-time shape of each resource.

**`keys/`** — one key per resource. A key owns its prefix, routes, handlers, and scoped middleware. This is where most of your code lives.

**`validators/`** — one validator per resource, not per action. A single `rules()` schema serves POST, PUT, and PATCH.

**`middlewares/`** — reusable middleware. Auth guards, rate limiters, anything you attach at the global, key, or route level.

## Naming

The scaffolded project uses a `.type.ext` suffix so a file's role is obvious from its name:

| File | Role |
|---|---|
| `user.key.claire` | a ClaireKey |
| `user.validator.claire` | a ClaireValidator |
| `auth.guard.claire` | a ClaireMiddleware |
| `user.ts` | a type |

This is convention, not enforcement — name files however you like.

## `.claire` or `.ts`?

Both work. `.claire` files are TypeScript with extra rules checked at load time:

- the file must export a class
- every method with an access modifier must declare an explicit return type

Use `.claire` for keys, validators, and middleware — the class-based parts of your app where those rules add value. Use plain `.ts` for types, constants, and anything that is not a class.

Mixing them freely is fine. A `.claire` file can import a `.ts` file and the reverse.

::alert{type="info"}
`.claire` files require `preload = ["@clairex/core/plugin"]` in `bunfig.toml`. See [.claire Files](/docs/claire-files/overview).
::

## Scaling up

Adding a resource means adding three files and one line:

```ts
// src/index.ts
new ClaireX(3000)
  .unlock(new userKey())
  .unlock(new postKey())   // ← the new resource
  .listen();
```

Everything else — the prefix, the routes, the validation, the scoped middleware — is inside the key. Nothing about adding a resource touches existing code.

## Next

- [Defining Routes](/docs/guides/routes)
- [ClaireKey: Five Roles](/docs/concepts/claire-key)
