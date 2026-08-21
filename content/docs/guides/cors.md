# Enabling CORS

`ClaireCors` handles the browser's preflight request and adds CORS headers to every response.

## Setup

```ts
import { ClaireX, ClaireCors } from "@clairex/core";

new ClaireX(3000)
  .use(new ClaireCors(
    "https://myapp.com",                      // origin
    ["Content-Type", "Authorization"],        // allowed request headers
    ["GET", "POST", "PATCH", "DELETE"],       // allowed methods
    ["X-Total-Count"],                        // headers the client may read
  ))
  .unlock(new userKey())
  .listen();
```

All four arguments are required and positional.

## Arguments

| | Header | |
|---|---|---|
| `origin` | `Access-Control-Allow-Origin` | `"*"` or a specific origin |
| `allowedHeaders` | `Access-Control-Allow-Headers` | what the client may send |
| `allowedMethods` | `Access-Control-Allow-Methods` | what verbs are permitted |
| `exposeHeaders` | `Access-Control-Expose-Headers` | what the client may read back |

## Development

```ts
app.use(new ClaireCors("*", ["Content-Type"], ["GET", "POST", "PATCH", "DELETE"], []));
```

`"*"` is fine locally. In production, name your origin — a wildcard cannot be combined with credentialed requests.

## Preflight

Browsers send an `OPTIONS` request before certain cross-origin calls. `ClaireCors` answers it in `before()` and short-circuits with `204`, so the request never reaches your routes.

**You do not define `OPTIONS` routes.** There is no `options()` method on the router, because preflight is browser plumbing rather than application logic. Middleware is the right place for it.

## Actual responses

For non-preflight requests, `after()` adds the CORS headers to whatever your handler returned. Since `after()` runs on the way out, every response gets them — including error responses.

## Register globally

CORS is not a per-route concern:

```ts
// ✅
app.use(new ClaireCors(...));

// ⚠️ works, but you probably don't want this
this.routes("get", "/", this.getUsers, [new ClaireCors(...)]);
```

At route level the preflight for *other* routes goes unanswered, and browsers will block them.

## Ordering

Register CORS first, so its `after()` runs last and applies headers to everything — including responses produced by short-circuiting middleware further in:

```ts
app.use(new ClaireCors(...));
app.use(new rateLimiter());
```

## Troubleshooting

**"No 'Access-Control-Allow-Origin' header"** — the middleware is not registered globally, or the origin does not match exactly. Scheme and port count: `http://localhost:3000` ≠ `http://localhost:8080`.

**Preflight returns 404** — `ClaireCors` is registered at route level instead of globally, so `OPTIONS` fell through to route matching.

**Custom header rejected** — add it to `allowedHeaders`.

## Next

- [Protecting Routes](/docs/guides/auth)
- [Built-in Middleware](/docs/api/built-in-middleware)
