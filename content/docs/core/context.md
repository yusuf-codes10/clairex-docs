# Context

`ClaireContext` is a per-request object that composes `ClaireRequest` and `ClaireResponse`. It's created fresh for every incoming request and passed to handlers and middleware.

## Structure

```ts
class ClaireContext {
  public request: ClaireRequest
  public response: ClaireResponse
}
```

That's it. No magic properties, no hidden state. Context is just a container for the two things you need: the incoming request and the response builder.

## Usage in Handlers

```ts
app.get('/users/:id', (ctx) => {
  // Read from the request
  const id = ctx.request.params.id
  const format = ctx.request.query.format

  // Build and return a response
  return ctx.response.json({ id, format })
})
```

## Usage in Middleware

Middleware receives the same context:

```ts
class TimingMiddleware extends ClaireMiddleware {
  async before(ctx: ClaireContext): Promise<Response | void> {
    console.log(`→ ${ctx.request.method} ${ctx.request.pathname}`)
  }

  async after(ctx: ClaireContext, response: Response): Promise<Response> {
    console.log(`← ${ctx.request.method} ${ctx.request.pathname}`)
    return response
  }
}
```

## Composition Over Inheritance

ClaireContext uses **composition** — it holds a request and response rather than extending them. This keeps the API surface explicit:

- Need request data? → `ctx.request.___`
- Need to build a response? → `ctx.response.___`

There's no `ctx.json()` shorthand or `ctx.params` alias. You always go through the specific object. This makes it clear where data comes from and what you're operating on.

## Lifecycle

1. Native `Request` arrives from Bun.serve
2. `new ClaireContext(request)` is created — wraps the native request in `ClaireRequest` and instantiates a fresh `ClaireResponse`
3. Context is passed through middleware and handlers
4. A native `Response` is returned to the client

The context is never reused across requests.
