# Context

`ClaireContext` is the per-request object passed to every handler and middleware. It composes a `ClaireRequest` and a `ClaireResponse` together, and stores validated data from the validator pipeline.

## Structure

```ts
class ClaireContext {
  public request: ClaireRequest
  public response: ClaireResponse

  set body(data: unknown)
  valid<T>(): T
}
```

## Accessing Request & Response

Every handler receives a `ClaireContext` (commonly named `c`):

```ts
app.get('/users', (c: ClaireContext) => {
  // Read from the request
  const page = c.request.query.page

  // Build a response
  return c.response.json({ users: [], page })
})
```

- `c.request` — A `ClaireRequest` instance wrapping the native Request
- `c.response` — A `ClaireResponse` instance with helper methods for building responses

## Validated Data

When a `ClaireValidator` middleware runs before your handler, it parses and validates the request body, then stores it on the context. You retrieve it with `valid<T>()`:

```ts
type User = { id: number; name: string; age: number }

private async createUser(c: ClaireContext): Promise<Response> {
  const body = c.valid<User>()
  // body is typed as User — no casting needed
  return c.response.json(body, 201)
}
```

### How It Works

1. The validator calls `c.body = validatedData` (setter)
2. Your handler calls `c.valid<T>()` to retrieve it with your type applied
3. The internal storage is `unknown` — the generic cast is safe because validation already passed

## Lifecycle

A new `ClaireContext` is created for every incoming request:

```
Request arrives → new ClaireContext(req) → middleware → handler → Response
```

The context lives for the duration of a single request/response cycle. It is never shared between requests.

## Type Signature

```ts
class ClaireContext {
  public request: ClaireRequest
  public response: ClaireResponse

  // Validator integration
  set body(data: unknown)
  valid<T>(): T
}
```

The `body` setter is used by `ClaireValidator` internally. You should only ever call `valid<T>()` in your handlers.
