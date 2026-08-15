# Routing

ClaireX has a two-level routing system: `ClaireRouter` handles route storage, and `ClaireX` handles route matching at runtime.

## ClaireRouter

`ClaireRouter` is a simple class that stores route entries and provides HTTP method helpers:

```ts
class ClaireRouter {
  get routes(): RouterEntry[]

  get(path: string, handler: ClaireHandler): void
  post(path: string, handler: ClaireHandler): void
  put(path: string, handler: ClaireHandler): void
  patch(path: string, handler: ClaireHandler): void
  delete(path: string, handler: ClaireHandler): void
}
```

You rarely interact with `ClaireRouter` directly — ClaireX exposes the same method helpers on the app instance, and Keys use their own `routes()` method internally.

## Route Entry

Every registered route becomes a `RouterEntry`:

```ts
type RouterEntry = {
  method: string
  pattern: string
  handler: ClaireHandler
  middlewares?: ClaireMiddleware[]       // key-level middleware
  routeMiddlewares?: ClaireMiddleware[]  // route-level middleware
}
```

## Handler Signature

Every route handler follows the `ClaireHandler` type:

```ts
type ClaireHandler = (c: ClaireContext) => Response | Promise<Response>
```

Handlers receive a `ClaireContext` and must return a native `Response` (sync or async).

## Registering Inline Routes

On the app instance directly:

```ts
const app = new ClaireX(3000)

app.get('/users', (c: ClaireContext) => {
  return c.response.json([])
})

app.post('/users', async (c: ClaireContext) => {
  const body = await c.request.json()
  return c.response.json(body, 201)
})
```

## Path Parameters

Use `:paramName` syntax to define dynamic segments:

```ts
app.get('/users/:id', (c: ClaireContext) => {
  const { id } = c.request.params
  return c.response.json({ id })
})
```

Parameters are extracted during route matching and available on `c.request.params` as a `Record<string, string>`.

## Route Matching

ClaireX matches routes by iterating through the registered route table in order:

1. Skip if the HTTP method doesn't match
2. Split both the pattern and the incoming path into segments
3. Compare segment-by-segment — static segments must match exactly, `:param` segments capture the value
4. First full match wins

If no route matches, ClaireX returns a 404 `ClaireException` response.

## Route Priority

Routes match in registration order — first match wins. If you have overlapping patterns, register more specific routes before general ones:

```ts
// Register specific before general
app.get('/users/me', handleMe)
app.get('/users/:id', handleById)
```

## Routes in Keys

When using Keys, routes are registered via the `routes()` method with the key's prefix prepended automatically:

```ts
class UserKey extends ClaireKey {
  constructor() {
    super('/users')
  }

  register(): void {
    this.routes('get', '/', this.getAll)        // matches GET /users/
    this.routes('get', '/:id', this.getById)    // matches GET /users/:id
    this.routes('post', '/', this.create)       // matches POST /users/
  }
}
```

See [Keys Overview](/docs/keys/overview) for full details.
