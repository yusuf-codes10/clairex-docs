# Scoped Middleware

Controllers support two levels of scoped middleware: **controller-level** and **route-level**.

## Controller-Level Middleware

Passed in the constructor — applies to all routes in the controller:

```ts
class UserController extends ClaireController {
  constructor() {
    super('/users', [new AuthMiddleware(), new LogMiddleware()])
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('post', '/', this.create)
  }

  // Both routes go through AuthMiddleware and LogMiddleware
}
```

## Route-Level Middleware

Passed as the 4th argument to `this.routes()` — applies only to that specific route:

```ts
register(): void {
  this.routes('get', '/', this.getAll)
  this.routes('post', '/', this.create, [new ValidationMiddleware()])
  //                                     ^^^ only POST /users
}
```

## Execution Order

Middleware runs in the onion model:

**Before (outside-in):**
1. Global middleware
2. Controller-level middleware
3. Route-level middleware

**After (inside-out):**
1. Route-level middleware (reverse)
2. Controller-level middleware (reverse)
3. Global middleware (reverse)

## Short-Circuiting

If any middleware's `before()` returns a `Response`, the chain stops immediately. The handler and subsequent middleware never run.
