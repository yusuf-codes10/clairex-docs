# ClaireX

`ClaireX` is the main application class. It extends `ClaireRouter`, meaning the app itself is a router — you can register routes directly on it or mount controllers.

## Creating an Application

```ts
import { ClaireX } from 'clairex-core'

const app = new ClaireX(3000)
```

The constructor takes a single argument: the port number. No config objects, no options.

## Class Hierarchy

```
ClaireX extends ClaireRouter
```

Because `ClaireX` inherits from `ClaireRouter`, it has all routing methods available directly:

```ts
app.get('/path', handler)
app.post('/path', handler)
app.put('/path', handler)
app.patch('/path', handler)
app.delete('/path', handler)
```

## Mounting Controllers

Controllers are mounted onto the app, registering their routes into the main route table:

```ts
import { UserController } from './controllers/user.controller'

app.mount(new UserController())
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

This calls `Bun.serve()` internally. The server starts on the port passed to the constructor.

## Built-in Behavior

- **ClaireLogger** is automatically registered as the first global middleware. It logs the HTTP method, URL, and response duration for every request.
- **404 handling** — If no route matches, a `ClaireException` with status 404 is returned.
- **Error catching** — All handlers are wrapped in try/catch. Thrown `ClaireException` instances are converted to structured JSON responses. Unknown errors return a generic 500.

## Request Lifecycle

1. Request arrives via `Bun.serve()`
2. `ClaireContext` is created (wraps native Request into ClaireRequest + ClaireResponse)
3. Route matching — iterates registered routes, extracts path params
4. Global middleware `before()` runs (short-circuits if a Response is returned)
5. Controller middleware `before()` runs
6. Route-level middleware `before()` runs
7. Handler executes
8. Route-level middleware `after()` runs (reverse order)
9. Controller middleware `after()` runs (reverse order)
10. Global middleware `after()` runs (reverse order)
11. Response returned to client

## Example

```ts
import { ClaireX } from 'clairex-core'

const app = new ClaireX(3000)

app.get('/', (ctx) => {
  return ctx.response.json({ status: 'running' })
})

app.get('/health', (ctx) => {
  return ctx.response.text('OK')
})

app.listen()
```
