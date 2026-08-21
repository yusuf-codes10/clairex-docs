# Built-in Middleware

Three middlewares ship with the framework.

| | Level | |
|---|---|---|
| `ClaireLogger` | global | auto-registered |
| `ClaireCors` | global | preflight + CORS headers |
| `ClaireJWT` | key or route | Bearer token verification |

---

## ClaireLogger

Logs every request with its duration. **Registered automatically** as the first global middleware — you do not add it.

```
→ GET http://localhost:3000/users
← GET http://localhost:3000/users 2.34ms
```

`before()` records the start time and logs the inbound request; `after()` logs the outbound one with elapsed time. HTTP methods are colour-coded — GET green, POST blue, PUT yellow, PATCH purple, DELETE red.

Because it is registered first, its `after()` runs last, so timings cover the whole request.

```ts
import { ClaireLogger } from "@clairex/core";   // exported if you need the class
```

---

## ClaireCors

```ts
new ClaireCors(
  origin: string,
  allowedHeaders: string[],
  allowedMethods: string[],
  exposeHeaders: string[],
)
```

All four arguments required and positional.

```ts
app.use(new ClaireCors(
  "https://myapp.com",
  ["Content-Type", "Authorization"],
  ["GET", "POST", "PATCH", "DELETE"],
  ["X-Total-Count"],
));
```

| Argument | Header |
|---|---|
| `origin` | `Access-Control-Allow-Origin` |
| `allowedHeaders` | `Access-Control-Allow-Headers` |
| `allowedMethods` | `Access-Control-Allow-Methods` |
| `exposeHeaders` | `Access-Control-Expose-Headers` |

**Preflight:** `before()` intercepts `OPTIONS` and returns `204` with the CORS headers, short-circuiting before route matching. You never define `OPTIONS` routes — there is no `options()` method on the router.

**Actual responses:** `after()` adds the headers to whatever the handler returned.

Register globally. At route level, preflight for other routes goes unanswered. See [Enabling CORS](/docs/guides/cors).

---

## ClaireJWT

```ts
new ClaireJWT(secret: string)
```

Verifies a Bearer token and stores the decoded payload on the context.

```ts
// key level — protects every route on the resource
super("/users", [new ClaireJWT(process.env.JWT_SECRET!)]);

// route level — protects one endpoint
this.routes("delete", "/:id", this.deleteUser, [new ClaireJWT(SECRET)]);
```

Expects:

```
Authorization: Bearer <token>
```

`before()` checks the header exists, extracts the token, verifies signature and expiry via `ClaireUtil.verifyToken()`, then stores the payload. Any failure short-circuits with 401.

Read it in the handler:

```ts
type TokenPayload = { userId: number; role: string };
const { userId, role } = c.auth<TokenPayload>();
```

Issue tokens with `ClaireUtil.signToken()`. See [Protecting Routes](/docs/guides/auth).

---

## Writing your own

Extend `ClaireMiddleware`:

```ts
export class rateLimiter extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    if (overLimit(c.request.headers.get("x-forwarded-for"))) {
      return c.response.json({ error: "Too many requests" }, 429);
    }
  }
}
```

See [Writing Middleware](/docs/guides/middleware).

## Next

- [Writing Middleware](/docs/guides/middleware)
- [ClaireMiddleware](/docs/api/claire-middleware)
