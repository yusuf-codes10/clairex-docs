# Introduction

ClaireX is a class-based, type-safe web framework built natively for Bun. It embraces Object-Oriented Programming as the core architecture — not as an afterthought.

## Philosophy

- **Explicit types** — No type inference. You declare your types like you mean it.
- **Class-based everything** — Controllers, middleware, exceptions, validators — all classes you instantiate, extend, or override.
- **Built-in validation** — No Zod, no Yup, no external libraries. Validation lives in classes alongside your types.
- **Bun-native** — Built on `Bun.serve()` from the ground up. No compatibility layers.
- **No magic** — No decorators, no hidden behavior. What you write is what runs.

## Who Is This For?

ClaireX is for developers who:

- Want structure and predictability in their web framework
- Prefer OOP patterns over functional composition
- Value explicit typing over inference
- Want validation baked into the framework, not bolted on

## Core Concepts

ClaireX is built around a few key classes:

| Class | Role |
|-------|------|
| `ClaireX` | The application — extends ClaireRouter, wraps Bun.serve |
| `ClaireRouter` | Route registration and matching |
| `ClaireContext` | Per-request composition of Request + Response |
| `ClaireRequest` | Wraps the native Request with typed getters |
| `ClaireResponse` | Response builder with json, text, html, redirect |
| `ClaireController` | Abstract class for grouping routes with a prefix |
| `ClaireMiddleware` | Abstract class with before/after hooks |
| `ClaireException` | Typed errors with structured responses |

## Next Steps

- [Installation](/docs/getting-started/installation) — Get ClaireX set up in your project
- [Quick Start](/docs/getting-started/quick-start) — Build your first route in under a minute
