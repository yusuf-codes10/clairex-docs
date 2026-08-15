# ClaireX

`ClaireX` is the main application class. It uses **composition** — it owns a `ClaireRouter` internally rather than extending one. You create an instance, unlock keys, register global middleware, and call `listen()`.

## Creating an Application

```ts
import { ClaireX } from 'clairex-core'

const app = new ClaireX(3000)
```

The constructor takes an optional port number (defaults to 3000). No config objects, no options.

## Composition Model

```
ClaireX
├── owns ClaireRouter (route storage)
├── owns ClaireMiddleware[] (global middleware chain)
└── calls Bun.serve() on listen()
```

ClaireX does not extend ClaireRouter. It composes one internally. This keeps the application class focused on orchestration while the router handles route storage.

## Inline Routes

Because ClaireX exposes the router's HTTP method helpers, you can register routes directly:

```ts
app.get('/health', (c: ClaireContext) => {
  return c.response.text('OK')
})

app.post('/users', async (c: ClaireContext) => {
  const body = await c.request.json()
  return c.response.json(body, 201)
})
```

Available methods: `get`, `post`, `put`, `patch`, `delete`.

## Unlocking Keys

Keys are the primary way to organize routes in ClaireX. Use `unlock()` to compose a key into the app:

```ts
import { UserKey } from './keys/users.key'
import { PostKey } from './keys/posts.key'

app.unlock(new UserKey())
app.unlock(new PostKey())
```

When you unlock a key, its routes are registered into the app's route table with the key's prefix and scoped middleware attached.

## Method Chaining

`use()` and `unlock()` both return `this`, enabling clean chaining:

```ts
new ClaireX(3000)
  .use(new CorsMiddleware())
  .unlock(new UserKey())
  .unlock(new PostKey())
  .listen()
```

## Global Middleware

Register middleware that runs on every request:

```ts
app.use(new AuthMiddleware())
app.use(new CorsMiddleware())
```

Middleware executes in registration order for `before()` hooks and in reverse order for `after()` hooks (onion model).

## Starting the Server

```ts
app.listen()
```

This calls `Bun.serve()` internally. The server starts on the configured port and prints the ClaireX banner to the console.

## Built-in Behavior

- **ClaireLogger** is automatically registered as the first global middleware. It logs the HTTP method, URL, and response duration for every request.
- **404 handling** — If no route matches, a `ClaireException` with status 404 is returned as a structured JSON response.
- **Error catching** — All handlers are wrapped in try/catch. Thrown `ClaireException` instances are converted to structured JSON responses. Unknown errors return a generic 500.

## Request Lifecycle

1. Request arrives via `Bun.serve()`
2. `ClaireContext` is created (wraps native Request into ClaireRequest + ClaireResponse)
3. Route matching — iterates registered routes, checks method and pattern, extracts path params
4. Global middleware `before()` runs (short-circuits if a Response is returned)
5. Key-level (scoped) middleware `before()` runs
6. Route-level middleware `before()` runs
7. Handler executes
8. Route-level middleware `after()` runs (reverse order)
9. Key-level middleware `after()` runs (reverse order)
10. Global middleware `after()` runs (reverse order)
11. Response returned to client

## Full Example

```ts
import { ClaireX } from 'clairex-core'
import { UserKey } from './keys/users.key'
import { AuthGuard } from './middlewares/auth'

new ClaireX(3000)
  .use(new AuthGuard())
  .unlock(new UserKey())
  .listen()
```
