# Route Registration

Inside a `ClaireKey`, routes are registered using the `this.routes()` method within the `register()` lifecycle hook.

## The `routes()` Method

```ts
protected routes(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  handler: ClaireHandler,
  middleware?: ClaireMiddleware[]
): void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `method` | `string` | HTTP method (get, post, put, patch, delete) |
| `path` | `string` | Route path — appended to the key's prefix |
| `handler` | `ClaireHandler` | The handler method for this route |
| `middleware` | `ClaireMiddleware[]` | Optional route-level middlewares |

## Basic Usage

```ts
export class UserKey extends ClaireKey {
  constructor() {
    super('/users')
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('get', '/:id', this.getById)
    this.routes('post', '/', this.create)
    this.routes('put', '/:id', this.update)
    this.routes('delete', '/:id', this.remove)
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

  private async update(c: ClaireContext): Promise<Response> {
    const { id } = c.request.params
    const body = await c.request.json()
    return c.response.json({ id, ...body as object })
  }

  private remove(c: ClaireContext): Response {
    return c.response.json({ deleted: true })
  }
}
```

## Path Prefixing

The key's prefix is automatically prepended to each route path:

```ts
super('/users')

this.routes('get', '/', this.getAll)       // → GET /users/
this.routes('get', '/:id', this.getById)   // → GET /users/:id
this.routes('post', '/', this.create)      // → POST /users/
```

## Route-Level Middleware

Pass an array of middleware instances as the fourth argument to scope them to a single route:

```ts
register(): void {
  this.routes('get', '/', this.getAll)
  this.routes('post', '/', this.create, [new UserValidator()])
  this.routes('put', '/:id', this.update, [new UserValidator()])
}
```

These middlewares run **after** global and key-level middlewares, but **before** the handler.

## Handler Binding

Handlers are bound to `this` automatically when registered via `this.routes()`. This means you can access instance properties, call other methods, and use `this` safely:

```ts
private users: User[] = []

private getAll(c: ClaireContext): Response {
  return c.response.json(this.users)
}
```

## Async Handlers

Handlers can be synchronous or asynchronous — both are supported:

```ts
// Sync — no body reading needed
private getAll(c: ClaireContext): Response {
  return c.response.json([])
}

// Async — needs to await body
private async create(c: ClaireContext): Promise<Response> {
  const body = await c.request.json()
  return c.response.json(body, 201)
}
```

## Throwing Exceptions

Throw a `ClaireException` anywhere in a handler to short-circuit and return an error response:

```ts
import { ClaireException } from 'clairex-core/core/exception'

private getById(c: ClaireContext): Response {
  const { id } = c.request.params
  const user = this.users.find(u => u.id === Number(id))
  if (!user) throw new ClaireException(404, 'User not found')
  return c.response.json(user)
}
```

The global catch block in ClaireX converts thrown `ClaireException` instances into structured JSON responses.
