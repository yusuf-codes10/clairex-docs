# Error Handling

ClaireX has a built-in global error handler in the `fetch` function of `Bun.serve()`. Every route handler runs inside a try/catch — you never need to wrap your own handlers manually.

## How It Works

The global catch block in ClaireX distinguishes between two cases:

1. **`ClaireException`** — Converted to a structured JSON response via `.toResponse()`
2. **Unknown errors** — Caught and returned as a generic 500 response

```ts
// Simplified internal logic:
try {
  // ... route matching, middleware, handler execution
} catch (e) {
  if (e instanceof ClaireException) return e.toResponse()
  return new ClaireException(500, 'Internal Server Error').toResponse()
}
```

## Throwing Exceptions

Throw a `ClaireException` anywhere in your handler or middleware — it bubbles to the global catch:

```ts
private getById(c: ClaireContext): Response {
  const user = users.find(u => u.id === Number(c.request.params.id))
  if (!user) throw new ClaireException(404, 'User not found')
  return c.response.json(user)
}
```

The client receives:

```json
HTTP/1.1 404
Content-Type: application/json

{
  "exception": "User not found"
}
```

## Returning Inline

For cases where you don't want to throw, call `.toResponse()` and return it directly:

```ts
private async create(c: ClaireContext): Promise<Response> {
  const body = c.valid<User>()
  if (users.find(u => u.id === body.id)) {
    return new ClaireException(400, 'User id already exists!').toResponse()
  }
  users.push(body)
  return c.response.json(users, 201)
}
```

Both approaches produce the same response format — the difference is flow control.

## 404 — Route Not Found

If no registered route matches the incoming request, ClaireX automatically returns a 404:

```json
HTTP/1.1 404
Content-Type: application/json

{
  "exception": "Route Not Found!"
}
```

This happens after the route matching loop exhausts all entries without a match.

## 500 — Unknown Errors

If something unexpected throws (a runtime error, an unhandled promise rejection, etc.), the global catch returns a generic 500:

```json
HTTP/1.1 500
Content-Type: application/json

{
  "exception": " Internal Server Error"
}
```

The actual error is also logged to the console via `console.log('something went wrong!', e)` for debugging.

## Validation Errors

`ClaireValidator` short-circuits with a `ClaireException` when validation fails. These are returned inline (not thrown), so they don't hit the global catch — they're handled within the middleware pipeline:

```json
HTTP/1.1 400
Content-Type: application/json

{
  "exception": "Validation failed!: name is required!"
}
```

## Error Flow Summary

| Source | Mechanism | Status | Handled By |
|--------|-----------|--------|------------|
| Handler throws `ClaireException` | `throw` | Custom | Global catch |
| Handler returns `.toResponse()` | `return` | Custom | Normal response flow |
| Validator fails | Short-circuit `return` | 400 | Middleware pipeline |
| No route matches | End of route loop | 404 | Built-in fallback |
| Unknown runtime error | `throw` (unintentional) | 500 | Global catch |

## Best Practices

- **Use `throw`** when the error is exceptional — the handler can't continue
- **Use `.toResponse()`** when it's a conditional check — the handler stays in control
- **Create subclasses** for repeated error types (`NotFoundException`, `UnauthorizedException`)
- **Let unknown errors bubble** — don't catch them yourself unless you need custom cleanup
- **Trust the global catch** — it ensures every request gets a response, even if your code fails
