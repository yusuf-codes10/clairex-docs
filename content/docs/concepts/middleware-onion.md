# The Middleware Onion

ClaireX runs middleware at three levels, wrapped around the handler.

```
┌────────────────────────────────────────────────────┐
│  GLOBAL — app.use()                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │  KEY — super(prefix, [middlewares])           │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  ROUTE — this.routes(..., [middlewares]) │  │  │
│  │  │  ┌──────────────────────────────────┐  │  │  │
│  │  │  │            HANDLER                │  │  │  │
│  │  │  └──────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

## Order

1. Global `before()` — registration order
2. Key `before()` — registration order
3. Route `before()` — registration order
4. **Handler**
5. Route `after()` — reverse
6. Key `after()` — reverse
7. Global `after()` — reverse

Inbound outermost-first, outbound innermost-first.

## Why three levels

Each maps to a real scope:

| Level | Applies to | Typical use |
|---|---|---|
| Global | every request | CORS, logging, rate limiting |
| Key | one resource | authentication for `/users/*` |
| Route | one endpoint | validation, admin-only checks |

Two levels would force a choice between repetition and over-application. With global and route only, protecting eight routes on a resource means attaching the guard eight times — or globally, which also protects your login endpoint.

## Short-circuiting

Any `before()` that returns a `Response` stops everything below it:

```
global before  ✓
key before     ✗ returns 401
                 ↓
               response sent — handler and all after() hooks skipped
```

::alert{type="info"}
`after()` hooks do **not** run on a short-circuit — including ones that already ran their `before()`. The model is deliberately simple: if `before()` stops the request, it is stopped.

Consequence: do not rely on `after()` for cleanup that must always happen.
::

## Explicit hooks instead of `next()`

Most frameworks pass a `next()` callback:

```js
// not ClaireX
function middleware(req, res, next) {
  if (!req.headers.authorization) return res.status(401).send();
  next();
}
```

ClaireX splits it into two methods and keeps flow control in the framework:

```ts
export class authGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    if (!c.request.headers.has("authorization")) {
      return c.response.json({ error: "Unauthorized" }, 401);
    }
  }
}
```

You cannot forget to call `next()`, cannot call it twice, and "run something after the handler" is a separate method rather than code placed after an `await next()`.

The cost is flexibility: you cannot wrap the handler in a try/catch or a transaction from inside a single middleware. ClaireX accepts that — the global error handler covers the common case.

## Instance state

Middleware instances persist across requests, so instance fields are shared:

```ts
export class ClaireLogger extends ClaireMiddleware {
  private start: number = 0;

  override before(c: ClaireContext): void {
    this.start = performance.now();
  }

  override after(c: ClaireContext, response: Response): Response {
    console.log(`${performance.now() - this.start}ms`);
    return response;
  }
}
```

This is safe in Bun's single-threaded model for a `before`/`after` pair within one request. For anything longer-lived, store per-request state on the context instead.

## Passing data forward

Middleware writes to the context; handlers read from it:

| Writes | Reads |
|---|---|
| `ClaireValidator` → `c.body`, `c.partial` | `c.valid<T>()`, `c.patched<T>()` |
| `ClaireJWT` → `c.setAuth` | `c.auth<T>()` |

Each accessor throws with a hint if its middleware never ran, so a missing middleware surfaces immediately rather than as an undefined value.

## Cost

Three nested loops sounds expensive but is not. Middleware chains are two to five entries; the loops are skipped entirely when a level has none. Clarity of three explicit levels outweighs the overhead.

## Next

- [Writing Middleware](/docs/guides/middleware)
- [Architecture](/docs/concepts/architecture)
