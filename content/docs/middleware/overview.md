# Middleware Overview

`ClaireMiddleware` is an abstract class with two hooks: `before()` and `after()`. Middleware runs in an onion model — before hooks execute outside-in, after hooks execute inside-out.

## Defining Middleware

```ts
import { ClaireMiddleware, ClaireContext } from 'clairex-core'

class AuthMiddleware extends ClaireMiddleware {
  async before(ctx: ClaireContext): Promise<Response | void> {
    const token = ctx.request.headers['authorization']
    if (!token) {
      return ctx.response.json({ error: 'Unauthorized' }, 401)
    }
    // Return void to continue
  }

  async after(ctx: ClaireContext, response: Response): Promise<Response> {
    // Optionally inspect or transform the response
    return response
  }
}
```

## Registering Middleware

### Global

```ts
app.use(new AuthMiddleware())
```

### Controller-Level

```ts
class UserController extends ClaireController {
  constructor() {
    super('/users', [new AuthMiddleware()])
  }
}
```

### Route-Level

```ts
this.routes('post', '/', this.create, [new ValidationMiddleware()])
```

## Three Scopes

| Scope | Registered via | Applies to |
|-------|----------------|-----------|
| Global | `app.use(mw)` | All requests |
| Controller | Constructor 2nd arg | All routes in that controller |
| Route | `this.routes()` 4th arg | That specific route only |
