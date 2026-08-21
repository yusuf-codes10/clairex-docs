# Introduction

ClaireX is a class-based, explicitly-typed web framework for [Bun](https://bun.sh).

Everything is a class you instantiate, extend, and override. Every type is declared, nothing is inferred. Validation is built into the framework, not bolted on from a third-party library.

```ts
new ClaireX(3000)
  .unlock(new userKey())
  .listen();
```

## Four principles

**Explicit types only.** No inference. You declare types the way you would in Java. This is a deliberate constraint: when the compiler never guesses, you never debug a guess.

**Built-in validation.** No Zod, no Yup, no Joi. `ClaireValidator` is part of the framework, and it is a class you extend like everything else.

**Object-oriented.** Routes, middleware, validators, exceptions — all classes. You instantiate them, and you override the parts you want to change.

**Bun-native.** Built directly on `Bun.serve`. Zero runtime dependencies.

## What makes it different

Most frameworks give you a router and let you assemble the rest. ClaireX gives you one building block — the **ClaireKey** — that covers five concepts other frameworks keep separate:

| Elsewhere you need | ClaireX uses |
|---|---|
| Controller | ClaireKey |
| Router group | ClaireKey (prefix) |
| Plugin | ClaireKey (self-contained, mountable) |
| Middleware scope | ClaireKey (owns its middleware) |
| Module | ClaireKey (self-registers) |

One class per resource: its prefix, its routes, its handlers, its middleware. Mount it with `unlock()` and every route comes with it.

## Validation that knows the method

You write one validator per resource, not one per action:

```ts
export class userValidator extends ClaireValidator {
  override rules(): ValidationSchema {
    return {
      id:   { type: "number", required: true, immutable: true },
      name: { type: "string", required: true, min: 3, max: 50 },
      age:  { type: "number", required: true, min: 18 },
    };
  }
}
```

ClaireX adjusts enforcement based on the HTTP method `POST` requires every field, `PATCH` treats them all as optional while still checking types and bounds. One schema, every action.

See [Validating Input](/docs/guides/validation) for the full picture.

## The `.claire` extension

ClaireX ships an optional file extension. A `.claire` file is TypeScript with extra rules enforced at load time: it must export a class, and every method with an access modifier must declare an explicit return type. Break a rule and the process stops before the server starts.

```
   ╔════════════════════════════════════════════════════════╗
   ║  ClairePlugin — 1 violation                             ║
   ╠════════════════════════════════════════════════════════╣
   ║  user.key.claire:42  Missing explicit return type       ║
   ╚════════════════════════════════════════════════════════╝
```

See [.claire Files](/docs/claire-files/overview).

## Who this is for

ClaireX suits you if you like explicit structure, prefer classes to configuration objects, and would rather the framework enforce conventions than trust you to follow them.

It is probably not for you if you want maximum flexibility, prefer functional composition, or like type inference doing the work. Those are reasonable preferences. ClaireX just makes the opposite trade.

## Next

- [Installation](/docs/getting-started/installation) — get a project running
- [Your First API](/docs/getting-started/first-api) — a guided tour of the scaffolded app
