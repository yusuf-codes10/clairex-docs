# Quick Start

Build a working API with ClaireX in under 5 minutes.

## Create the Application

```ts
import { ClaireX } from 'clairex-core'

const app = new ClaireX(3000)
```

The constructor takes the port number. That's it — no config objects, no options bags.

## Register Routes

```ts
app.get('/hello', (ctx) => {
  return ctx.response.json({ message: 'Hello ClaireX!' })
})

app.get('/users/:id', (ctx) => {
  const id = ctx.request.params.id
  return ctx.response.json({ userId: id })
})

app.post('/users', async (ctx) => {
  const body = await ctx.request.json()
  return ctx.response.json({ created: body }, 201)
})
```

Every handler receives a `ClaireContext` containing the `request` and `response` objects.

## Use a Controller

For grouping related routes, use a controller:

```ts
import { ClaireController } from 'clairex-core'

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

Mount it on the app:

```ts
app.mount(new UserController())
```

## Add Middleware

```ts
import { ClaireMiddleware, ClaireContext } from 'clairex-core'

class AuthMiddleware extends ClaireMiddleware {
  async before(ctx: ClaireContext): Promise<Response | void> {
    const token = ctx.request.headers['authorization']
    if (!token) {
      return ctx.response.json({ error: 'Unauthorized' }, 401)
    }
  }
}

app.use(new AuthMiddleware())
```

Returning a `Response` from `before()` short-circuits the request — the handler never runs.

## Start the Server

```ts
app.listen()
```

That's it. Your full file:

```ts
import { ClaireX } from 'clairex-core'

const app = new ClaireX(3000)

app.get('/', (ctx) => {
  return ctx.response.json({ message: 'Hello ClaireX!' })
})

app.listen()
```

## Next Steps

- [ClaireX Core](/docs/core/clairex) — Understand the main application class
- [Routing](/docs/core/routing) — Learn about route matching and params
- [Middleware](/docs/middleware/overview) — Dive deeper into the onion model
