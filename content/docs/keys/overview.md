# Keys Overview

A `ClaireKey` is a self-contained unit of routes, handlers, and middleware. It's how you organize your API into logical resources — each key owns a prefix, a scoped middleware chain, and its route handlers.

## The Key Metaphor

In ClaireX, a Key **unlocks** access to a set of routes. You compose your application by unlocking keys into it:

```ts
new ClaireX(3000)
  .unlock(new UserKey())
  .unlock(new PostKey())
  .listen()
```

## Defining a Key

Extend `ClaireKey` and implement the abstract `register()` method:

```ts
import { ClaireKey } from 'clairex-core/core/key'
import { ClaireContext } from 'clairex-core/core/context'

export class UserKey extends ClaireKey {
  constructor() {
    super('/users')
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('get', '/:id', this.getById)
    this.routes('post', '/', this.create)
  }

  private getAll(c: ClaireContext): Response {
    return c.response.json([])
  }

  private getById(c: ClaireContext): Response {
    const { id } = c.request.params
    return c.response.json({ id })
  }

  private async create(c: ClaireContext): Promise<Response> {
    const body = await c.request.json()
    return c.response.json(body, 201)
  }
}
```

## Constructor

The `ClaireKey` constructor takes two arguments:

```ts
constructor(prefix: string, middlewares: ClaireMiddleware[] = [])
```

- `prefix` — The URL prefix for all routes in this key (e.g. `'/users'`)
- `middlewares` — Optional array of scoped middlewares that run on every route in this key

## How It Works

1. You call `super('/users')` in your constructor — this sets the prefix
2. The base class constructor calls `register()` automatically after the prefix is set
3. Inside `register()`, you define your routes using `this.routes()`
4. Handlers are automatically bound to `this` — you can access instance properties and methods
5. When `app.unlock(key)` is called, the key's routes are registered into the app's route table with the prefix prepended

## Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `prefix` | `string` | The URL prefix for this key's routes |
| `router` | `RouterEntry[]` | Getter — returns all registered route entries |
| `middlewares` | `ClaireMiddleware[] \| undefined` | Getter — returns the key's scoped middleware chain |

## File Naming Convention

Keys follow the `*.key.ts` naming pattern:

```
src/keys/
├── users.key.ts
├── posts.key.ts
├── auth.key.ts
└── admin.key.ts
```

## Next Steps

- [Route Registration](/docs/keys/route-registration) — How to register routes inside a key
- [Scoped Middleware](/docs/keys/scoped-middleware) — Attach middleware to an entire key or specific routes
