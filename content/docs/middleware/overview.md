# Middleware Overview

`ClaireMiddleware` is an abstract class for creating reusable logic that runs before and/or after route handlers. Extend it, override `before()` and/or `after()`, and attach it globally, to a key, or to a single route.

## Class Signature

```ts
abstract class ClaireMiddleware {
  before(ctx: ClaireContext): void | Response | Promise<void | Response>
  after(ctx: ClaireContext, response: Response): Response | Promise<Response>
}
```

## Creating a Middleware

Extend `ClaireMiddleware` and override the hooks you need:

```ts
import { ClaireMiddleware } from 'clairex-core/core/middleware'
import { ClaireContext } from 'clairex-core/core/context'

export class AuthGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    const token = c.request.headers['authorization']
    if (!token) {
      return c.response.json({ error: 'Unauthorized' }, 401)
    }
  }
}
```

## Attaching Middleware

### Global — runs on every request

```ts
app.use(new AuthGuard())
```

### Key-level — runs on every route in a key

```ts
export class UserKey extends ClaireKey {
  constructor() {
    super('/users', [new AuthGuard()])
  }
}
```

### Route-level — runs on a single route

```ts
this.routes('post', '/', this.create, [new UserValidator()])
```

## Execution Order (Onion Model)

Middleware follows the onion model — `before()` runs outside-in, `after()` runs inside-out:

```
Global before → Key before → Route before → Handler → Route after → Key after → Global after
```

Within each level, `before()` runs in registration order. `after()` runs in **reverse** registration order.

## Key Concepts

| Concept | Description |
|---------|-------------|
| `before()` | Runs before the handler. Return `void` to continue, or a `Response` to short-circuit. |
| `after()` | Runs after the handler in reverse order. Receives and returns the `Response`. |
| Short-circuit | Returning a `Response` from `before()` skips the handler and all remaining middleware. |
| Async-safe | Both hooks support `async` — you can `await` inside them. |
| Onion model | `after()` hooks run in reverse order, wrapping around the handler symmetrically. |

## Built-in Middleware

ClaireX ships with one built-in middleware:

- **ClaireLogger** — Automatically registered on every app. Logs method, URL, and response duration.

## Next Steps

- [Before & After](/docs/middleware/before-after) — Deep dive into the two lifecycle hooks
- [Short-Circuiting](/docs/middleware/short-circuiting) — How to stop the pipeline early
- [ClaireLogger](/docs/middleware/claire-logger) — The built-in request logger
