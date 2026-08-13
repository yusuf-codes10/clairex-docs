# Route Registration

Controllers register routes inside the `register()` method using `this.routes()`.

## Signature

```ts
this.routes(method: string, path: string, handler: ClaireHandler, middlewares?: ClaireMiddleware[])
```

## Parameters

| Param | Type | Description |
|-------|------|-------------|
| `method` | `string` | HTTP method — `'get'`, `'post'`, `'put'`, `'patch'`, `'delete'` |
| `path` | `string` | Route pattern relative to the controller prefix |
| `handler` | `ClaireHandler` | The handler method (bound to `this` automatically) |
| `middlewares` | `ClaireMiddleware[]` | Optional route-level middleware |

## Example

```ts
class PostController extends ClaireController {
  constructor() {
    super('/posts')
  }

  register(): void {
    this.routes('get', '/', this.getAll)           // GET /posts
    this.routes('get', '/:id', this.getById)       // GET /posts/:id
    this.routes('post', '/', this.create)          // POST /posts
    this.routes('put', '/:id', this.update)        // PUT /posts/:id
    this.routes('delete', '/:id', this.delete)     // DELETE /posts/:id
  }

  // ... handlers
}
```

## Path Concatenation

The controller prefix + route path are joined:

- Controller prefix: `/posts`
- Route path: `/:id`
- Final pattern: `/posts/:id`

## Handler Binding

Handlers are bound to the controller instance via `.bind(this)`. You can safely access `this` inside handlers without manual binding.
