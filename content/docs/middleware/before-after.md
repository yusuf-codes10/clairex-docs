# Before & After

Every `ClaireMiddleware` has two lifecycle hooks: `before()` runs before the handler, `after()` runs after it. You can override one or both.

## `before()`

```ts
before(ctx: ClaireContext): void | Response | Promise<void | Response>
```

Runs before the route handler. Two possible outcomes:

- **Return `void`** (or return nothing) — the pipeline continues to the next middleware or handler
- **Return a `Response`** — short-circuits the entire pipeline; the response goes directly to the client

### Example: Logging

```ts
class RequestLogger extends ClaireMiddleware {
  override before(c: ClaireContext): void {
    console.log(`→ ${c.request.method} ${c.request.pathname}`)
  }
}
```

### Example: Auth Check

```ts
class AuthGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    if (!c.request.headers['authorization']) {
      return c.response.json({ error: 'Unauthorized' }, 401)
    }
    // returning nothing = continue
  }
}
```

## `after()`

```ts
after(ctx: ClaireContext, response: Response): Response | Promise<Response>
```

Runs after the handler. It receives the response and **must return a response** (the same one or a modified one).

### Example: Response Logging

```ts
class ResponseLogger extends ClaireMiddleware {
  override after(c: ClaireContext, response: Response): Response {
    console.log(`← ${response.status} ${c.request.pathname}`)
    return response
  }
}
```

### Example: Adding Headers

```ts
class CorsMiddleware extends ClaireMiddleware {
  override after(c: ClaireContext, response: Response): Response {
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}
```

## Execution Order

`before()` hooks run in **registration order** (first registered = first to run).
`after()` hooks run in **reverse order** (last registered = first to run after handler).

This creates the onion model:

```
Middleware A before
  Middleware B before
    Middleware C before
      → Handler →
    Middleware C after
  Middleware B after
Middleware A after
```

## Async Support

Both hooks fully support async/await:

```ts
class SlowCheck extends ClaireMiddleware {
  override async before(c: ClaireContext): Promise<void | Response> {
    const allowed = await checkRateLimit(c.request.headers['x-api-key'])
    if (!allowed) {
      return c.response.json({ error: 'Rate limited' }, 429)
    }
  }
}
```

## Default Behavior

The base class provides default implementations:

- `before()` — does nothing, returns `void` (pipeline continues)
- `after()` — returns the response unchanged

You only need to override the hooks you care about.
