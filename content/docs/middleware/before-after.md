# Before & After Hooks

Every middleware has two hooks that execute at different stages of the request lifecycle.

## `before(ctx)`

Runs **before** the route handler. Can either continue the chain or short-circuit.

```ts
async before(ctx: ClaireContext): Promise<Response | void> {
  // Return void → continue to next middleware / handler
  // Return Response → stop the chain, send this response
}
```

### Use Cases

- Authentication checks
- Rate limiting
- Request validation
- Logging request start

## `after(ctx, response)`

Runs **after** the route handler (and after inner middleware). Receives the response that will be sent.

```ts
async after(ctx: ClaireContext, response: Response): Promise<Response> {
  // Must return a Response (pass-through or modified)
  return response
}
```

### Use Cases

- Adding response headers
- Logging response status / duration
- Response transformation

## Execution Order Example

With three middleware registered in order A, B, C:

```
→ A.before()
  → B.before()
    → C.before()
      → Handler
    ← C.after()
  ← B.after()
← A.after()
```

This is the onion model — before hooks wrap the handler from outside-in, after hooks unwrap from inside-out.
