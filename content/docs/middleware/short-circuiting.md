# Short-Circuiting

Short-circuiting lets middleware stop the request pipeline early by returning a `Response` from `before()`. When this happens, the handler and all subsequent middleware are skipped.

## How It Works

In the `before()` hook, you have two options:

- **Return nothing** (`void`) — the pipeline continues
- **Return a `Response`** — the pipeline stops immediately; the response is sent to the client

```ts
class AuthGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    const token = c.request.headers['authorization']

    if (!token) {
      // Short-circuit: skip handler, return 401 directly
      return c.response.json({ error: 'Unauthorized' }, 401)
    }

    // No return = continue to next middleware/handler
  }
}
```

## What Gets Skipped

When a middleware short-circuits:

1. All remaining `before()` hooks at the same level and deeper levels are skipped
2. The route handler is skipped
3. All `after()` hooks are skipped

The response returned from `before()` goes directly back to the client.

## Short-Circuit at Different Levels

Short-circuiting works the same at every middleware level:

### Global Level

```ts
app.use(new RateLimiter()) // if this short-circuits, nothing else runs
app.use(new AuthGuard())
```

### Key Level

```ts
super('/admin', [new AdminCheck()]) // if this short-circuits, no routes in this key execute
```

### Route Level

```ts
this.routes('post', '/', this.create, [new UserValidator()])
// if UserValidator short-circuits, the handler is skipped
```

## Common Patterns

### Authentication

```ts
class AuthGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    if (!c.request.headers['authorization']) {
      return c.response.json({ error: 'Unauthorized' }, 401)
    }
  }
}
```

### Rate Limiting

```ts
class RateLimiter extends ClaireMiddleware {
  private requests = new Map<string, number>()

  override before(c: ClaireContext): void | Response {
    const ip = c.request.headers['x-forwarded-for'] ?? 'unknown'
    const count = (this.requests.get(ip) ?? 0) + 1
    this.requests.set(ip, count)

    if (count > 100) {
      return c.response.json({ error: 'Too many requests' }, 429)
    }
  }
}
```

### Validation (Built-in)

`ClaireValidator` extends `ClaireMiddleware` and short-circuits with a 400 response when validation fails:

```ts
// Internally, ClaireValidator does this in before():
return new ClaireException(400, 'Validation failed: name is required').toResponse()
```

## Key Points

- Only `before()` can short-circuit — `after()` always runs on the response it receives
- A short-circuit response is a **normal** `Response` object — same as what a handler would return
- ClaireX checks `if (early instanceof Response) return early` after every `before()` call
- This is the same pattern at global, key, and route levels — no special API needed
