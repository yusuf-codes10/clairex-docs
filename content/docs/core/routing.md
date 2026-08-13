# Routing

ClaireX uses a flat, linear route matching system. Routes are registered in order and the first match wins.

## Registering Routes

Routes are registered via HTTP method helpers on the app (or on a controller's internal router):

```ts
app.get('/users', handler)
app.post('/users', handler)
app.put('/users/:id', handler)
app.patch('/users/:id', handler)
app.delete('/users/:id', handler)
```

Each method takes a pattern string and a handler function.

## Handler Signature

Every handler receives a `ClaireContext` and must return a `Response`:

```ts
type ClaireHandler = (ctx: ClaireContext) => Response | Promise<Response>
```

## Path Parameters

Dynamic segments are prefixed with `:` — they match any value and are extracted into `ctx.request.params`:

```ts
app.get('/users/:id', (ctx) => {
  const id = ctx.request.params.id
  return ctx.response.json({ userId: id })
})

app.get('/posts/:postId/comments/:commentId', (ctx) => {
  const { postId, commentId } = ctx.request.params
  return ctx.response.json({ postId, commentId })
})
```

## Route Matching

The matching algorithm:

1. Splits both the registered pattern and the incoming pathname by `/`
2. If segment counts differ — no match
3. Static segments must match exactly
4. Segments starting with `:` are dynamic — any value matches, extracted into params
5. First registered route that matches wins

```ts
// These are checked in registration order
app.get('/users', getAll)        // matches /users
app.get('/users/:id', getById)   // matches /users/123, /users/abc
```

## Route Priority

Routes are matched in the order they are registered. There is no specificity ranking — if you register a dynamic route before a static one, the dynamic route wins:

```ts
// ❌ Bad — :id catches "settings" too
app.get('/users/:id', getById)
app.get('/users/settings', getSettings)

// ✅ Good — static first
app.get('/users/settings', getSettings)
app.get('/users/:id', getById)
```

## Controllers

For grouping related routes, use `ClaireController`:

```ts
class PostController extends ClaireController {
  constructor() {
    super('/posts')
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('get', '/:id', this.getById)
    this.routes('post', '/', this.create)
  }

  // ... handler methods
}

app.mount(new PostController())
```

The controller prefix is prepended to each route pattern. `this.routes('get', '/:id', ...)` becomes `GET /posts/:id`.
