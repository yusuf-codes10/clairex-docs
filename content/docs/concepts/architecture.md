# Architecture

## The pieces

```
┌──────────────────────────────────────────────────────┐
│                      ClaireX                          │
│        unlock() · use() · listen()                    │
│        owns: ClaireRouter, ClaireMiddleware[]          │
└──────────┬─────────────────────┬─────────────────────┘
           │                     │
    ┌──────▼──────┐       ┌──────▼──────────┐
    │  ClaireKey  │       │ ClaireMiddleware │
    │  prefix     │       │ before() after() │
    │  routes     │       └─────────────────┘
    │  handlers   │
    │  middleware │
    └──────┬──────┘
           │
    ┌──────▼───────────────────────────────┐
    │      ClaireRouter (internal)          │
    │      RouterEntry[] — route storage    │
    └──────┬───────────────────────────────┘
           │
    ┌──────▼────────┐
    │ ClaireContext  │  one per request
    │ .request       │──  ClaireRequest
    │ .response      │──  ClaireResponse
    │ .valid<T>()    │──  full validated body
    │ .patched<T>()  │──  partial validated body
    │ .auth<T>()     │──  JWT payload
    └───────────────┘
```

## Composition, not inheritance

`ClaireX` **owns** a router rather than extending one:

```ts
export class ClaireX {
  private router = new ClaireRouter();
}
```

That single decision produces the framework's central constraint: because the router is private, `app.get()` does not exist, so routes must live on keys. See [ClaireKey: Five Roles](/docs/concepts/claire-key).

`ClaireContext` uses composition the same way — it owns a request and a response rather than extending either. So you write `c.request.params` and `c.response.json()`, and the two never blur.

Inheritance is reserved for extension points: `ClaireKey`, `ClaireMiddleware`, `ClaireValidator` are abstract classes you subclass.

## Request lifecycle

```
HTTP request (Bun.serve)
      │
      ▼
scan routes — method, then path pattern
      │  no match → 404 ClaireException
      ▼
match found
      │
      ▼
new ClaireContext(req, params)      ← created after matching
      │
      ▼
global before  →  key before  →  route before
      │  any returns a Response → short-circuit
      ▼
HANDLER
      │
      ▼
route after  ←  key after  ←  global after
      │
      ▼
Response → client

  ╳ anything throws
  ▼
global catch → ClaireException → structured JSON
```

**Context is created after matching, not before.** Path parameters are passed to the constructor, so `ClaireRequest._params` is private with no setter — nothing can mutate it afterwards. It also avoids allocating a context for routes that do not match.

## Route matching

Routes are a flat array scanned in registration order. First match wins.

```ts
type RouterEntry = {
  method: string;
  pattern: string;
  handler: ClaireHandler;
  middlewares?: ClaireMiddleware[];        // key level
  routeMiddlewares?: ClaireMiddleware[];   // route level
};
```

Two separate middleware fields keep the levels distinct so the onion executes in the right order.

Matching compares method first, then splits both pattern and path on `/` and compares segment by segment. `:param` segments capture; everything else must match exactly.

A linear scan is fine at the scale ClaireX targets. A trie would be faster with hundreds of routes and harder to reason about; the flat array is a deliberate simplicity trade.

## Middleware

Three levels — global, key, route — running as an onion. See [The Middleware Onion](/docs/concepts/middleware-onion).

`ClaireValidator` extends `ClaireMiddleware` rather than being a separate concept. Validation *is* middleware: it runs in `before()`, short-circuits on failure, and writes its result to the context. Nothing new to learn.

## Errors

One `ClaireException` class. One try/catch around the whole request. Known exceptions carry their status; anything else becomes a generic 500.

Framework guards throw the same type, always with a message naming the fix. Nothing fails silently — a missing validator, a mismatched body accessor, or a misplaced validator all surface immediately.

## State

| Lives for | What |
|---|---|
| App lifetime | ClaireX, keys, middleware instances, route table |
| One request | ClaireContext, ClaireRequest, ClaireResponse |

Middleware instances are shared across requests, so instance fields are shared too. Per-request data belongs on the context.

## Zero dependencies

No runtime dependencies. JWT signing uses Bun's `crypto.subtle`; validation is hand-written; the terminal styling is raw ANSI codes.

That is partly philosophy — a framework claiming to remove your dependency on Zod should not add three of its own — and partly practical: no supply chain, no version conflicts, no bundle weight.

## The `.claire` layer

Sitting alongside the framework is an optional file extension enforced by a Bun plugin:

```
.claire imported → plugin validates → valid? load as TS : exit
```

Enforcement is at **load time**, not build time or editor time. There is no build step to forget and no cache to go stale — but only files that are actually imported get checked.

Editor support is separate: `@clairex/typescript-plugin` teaches TypeScript to resolve `.claire` imports, and the VS Code extension ships it. See [.claire Files](/docs/claire-files/overview).

## Next

- [ClaireKey: Five Roles](/docs/concepts/claire-key)
- [Why Explicit Types](/docs/concepts/explicit-types)
