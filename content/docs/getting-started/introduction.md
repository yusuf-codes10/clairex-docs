# Introduction

ClaireX is a class-based, explicitly-typed web framework built natively for Bun. It treats Object-Oriented Programming as the foundation — not an afterthought.

## Philosophy

- **Explicit types** — No type inference. Every type is declared, like Java.
- **Class-based everything** — Keys, middleware, validators, exceptions — all classes you instantiate, extend, or override.
- **Built-in validation** — No Zod, no Yup, no external libraries. Validation lives in classes alongside your types.
- **Bun-native** — Built on `Bun.serve()` from the ground up. No compatibility layers.
- **No magic** — No decorators, no hidden behavior. What you write is what runs.
- **Composition over inheritance** — ClaireX owns a router internally rather than extending one. Keys are composed into the app via `unlock()`.

## Who Is This For?

ClaireX is for developers who:

- Want structure and predictability in their web framework
- Prefer OOP patterns over functional composition
- Value explicit typing over inference
- Want validation baked into the framework, not bolted on
- Like method chaining for clean, readable setup code

## Core Concepts

ClaireX is built around a few key classes:

| Class | Role |
|-------|------|
| `ClaireX` | The application — owns a ClaireRouter via composition, wraps Bun.serve |
| `ClaireRouter` | Route storage and HTTP method helpers |
| `ClaireContext` | Per-request composition of Request + Response |
| `ClaireRequest` | Wraps the native Request with typed getters |
| `ClaireResponse` | Response builder with json, text, html, redirect |
| `ClaireKey` | Abstract class for self-contained route units with prefix + scoped middleware |
| `ClaireMiddleware` | Abstract class with before/after hooks (onion model) |
| `ClaireValidator` | Abstract class for request body validation — extends ClaireMiddleware |
| `ClaireException` | Typed errors with structured JSON responses |

## The Key Metaphor

In ClaireX, a **Key** unlocks access to a set of routes. Each `ClaireKey` is a self-contained unit — it owns a prefix, its own middleware chain, and its route handlers. You compose your app by unlocking keys into it:

```ts
const app = new ClaireX(3000)
app.unlock(new UserKey())
app.unlock(new PostKey())
app.listen()
```

## Next Steps

- [Installation](/docs/getting-started/installation) — Get ClaireX set up in your project
- [Quick Start](/docs/getting-started/quick-start) — Build your first route in under a minute
