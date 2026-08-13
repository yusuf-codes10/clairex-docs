# Short-Circuiting

When a middleware's `before()` hook returns a `Response` instead of `void`, the request chain stops immediately.

## How It Works

```ts
class RateLimitMiddleware extends ClaireMiddleware {
  async before(ctx: ClaireContext): Promise<Response | void> {
    if (this.isRateLimited(ctx)) {
      // This Response is sent directly — handler never executes
      return ctx.response.json({ error: 'Too many requests' }, 429)
    }
    // Return nothing → continue to next middleware / handler
  }
}
```

## What Doesn't Run

When middleware short-circuits:

- ❌ Subsequent `before()` hooks
- ❌ The route handler
- ❌ `after()` hooks of middleware that didn't execute

## What Still Runs

- ✅ `after()` hooks of middleware that already ran their `before()`

If middleware A, B, C are registered and B short-circuits:

```
→ A.before()   ✅ runs
  → B.before() ✅ runs, returns Response (short-circuit)
    → C.before() ❌ skipped
      → Handler  ❌ skipped
    ← C.after()  ❌ skipped
  ← B.after()   ❌ skipped
← A.after()     ✅ runs
```

## Common Patterns

- **Authentication** — Return 401 if no token present
- **Authorization** — Return 403 if user lacks permissions
- **Validation** — Return 400 if request body is malformed
- **Rate limiting** — Return 429 if limit exceeded
- **Maintenance mode** — Return 503 for all requests
