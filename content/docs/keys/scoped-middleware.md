# Scoped Middleware

ClaireX supports middleware at three levels: **global**, **key-level**, and **route-level**. This page covers key-level and route-level scoping.

## Middleware Levels

| Level | Scope | Registered via |
|-------|-------|----------------|
| Global | Every request | `app.use(middleware)` |
| Key-level | Every route in a key | `super(prefix, [middlewares])` |
| Route-level | A single route | `this.routes(method, path, handler, [middlewares])` |

## Key-Level Middleware

Pass middleware instances as the second argument to `super()` in your key's constructor:

```ts
import { ClaireKey } from 'clairex-core/core/key'
import { AuthGuard } from '../middlewares/auth'
import { Logger } from '../middlewares/logger'

export class UserKey extends ClaireKey {
  constructor() {
    super('/users', [new AuthGuard(), new Logger()])
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('post', '/', this.create)
  }
}
```

`AuthGuard` and `Logger` will run on **every route** inside this key — both `GET /users/` and `POST /users/`.

## Route-Level Middleware

Pass middleware instances as the fourth argument to `this.routes()`:

```ts
import { UserValidator } from '../validators/userValidator'

register(): void {
  this.routes('get', '/', this.getAll)
  this.routes('post', '/', this.create, [new UserValidator()])
}
```

`UserValidator` only runs on `POST /users/` — not on `GET /users/`.

## Combining All Levels

You can combine global, key-level, and route-level middleware. They execute in this order:

```
Global before → Key-level before → Route-level before → Handler → Route-level after → Key-level after → Global after
```

Example:

```ts
// Global middleware
new ClaireX(3000)
  .use(new CorsMiddleware())         // runs on ALL routes
  .unlock(new UserKey())
  .listen()

// Key with scoped middleware
export class UserKey extends ClaireKey {
  constructor() {
    super('/users', [new AuthGuard()])  // runs on all /users/* routes
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('post', '/', this.create, [new UserValidator()])  // only on POST /users/
  }
}
```

For `POST /users/`, the execution order is:

1. `CorsMiddleware.before()` (global)
2. `AuthGuard.before()` (key-level)
3. `UserValidator.before()` (route-level — validates the body)
4. `this.create()` (handler)
5. `UserValidator.after()` (route-level, reverse)
6. `AuthGuard.after()` (key-level, reverse)
7. `CorsMiddleware.after()` (global, reverse)

## Short-Circuiting

Any middleware at any level can short-circuit by returning a `Response` from `before()`:

```ts
class AuthGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    if (!c.request.headers['authorization']) {
      return c.response.json({ error: 'Unauthorized' }, 401)
    }
  }
}
```

If `AuthGuard` returns a Response, the handler and all subsequent middlewares are skipped — the response goes directly to the client.

## Real-World Example

```ts
import { ClaireKey } from 'clairex-core/core/key'
import { ClaireContext } from 'clairex-core/core/context'
import { ClaireException } from 'clairex-core/core/exception'
import { AuthGuard } from '../middlewares/auth'
import { UserValidator } from '../validators/userValidator'

type User = { id: number; name: string; age: number }

const users: User[] = [
  { id: 1, name: 'Claire', age: 23 },
  { id: 2, name: 'John', age: 33 },
]

export class UserKey extends ClaireKey {
  constructor() {
    super('/users', [new AuthGuard()])
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('get', '/:id', this.getById)
    this.routes('post', '/', this.create, [new UserValidator()])
  }

  private getAll(c: ClaireContext): Response {
    return c.response.json(users)
  }

  private getById(c: ClaireContext): Response {
    const { id } = c.request.params
    const user = users.find(u => u.id === Number(id))
    if (!user) throw new ClaireException(404, 'User not found')
    return c.response.json(user)
  }

  private async create(c: ClaireContext): Promise<Response> {
    const body = c.valid<User>()
    users.push(body)
    return c.response.json(users, 201)
  }
}
```
