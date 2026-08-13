# Controllers Overview

`ClaireController` is an abstract class for grouping related routes under a shared prefix and optional middleware.

## Defining a Controller

```ts
import { ClaireController, ClaireContext } from 'clairex-core'

class UserController extends ClaireController {
  constructor() {
    super('/users')
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('get', '/:id', this.getById)
    this.routes('post', '/', this.create)
  }

  getAll(ctx: ClaireContext): Response {
    return ctx.response.json({ users: [] })
  }

  getById(ctx: ClaireContext): Response {
    const id = ctx.request.params.id
    return ctx.response.json({ id })
  }

  async create(ctx: ClaireContext): Promise<Response> {
    const body = await ctx.request.json()
    return ctx.response.json({ created: body }, 201)
  }
}
```

## Mounting

Controllers are mounted onto the app instance:

```ts
app.mount(new UserController())
```

This registers all the controller's routes into the app's route table, prefixed with the controller's path.

## Key Points

- `register()` is abstract — every controller must implement it
- Handlers are automatically bound to `this` (you can access instance methods/properties)
- The prefix is prepended to each route pattern
- Controllers can have their own middleware (see Scoped Middleware)
