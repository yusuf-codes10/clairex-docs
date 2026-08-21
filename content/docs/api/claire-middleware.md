# ClaireMiddleware

Abstract base class for middleware. Override `before()`, `after()`, or both.

```ts
import { ClaireMiddleware, ClaireContext } from "@clairex/core";

export class authGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    if (!c.request.headers.has("authorization")) {
      return c.response.json({ error: "Unauthorized" }, 401);
    }
  }
}
```

## `before(ctx)`

```ts
before(ctx: ClaireContext): void | Response | Promise<void | Response>
```

Runs before the handler.

| Return | Effect |
|---|---|
| `void` | continue to the next middleware, then the handler |
| `Response` | short-circuit — handler and all `after()` hooks are skipped |

Default implementation does nothing.

## `after(ctx, response)`

```ts
after(ctx: ClaireContext, response: Response): Response | Promise<Response>
```

Runs after the handler, in reverse order. Must return a `Response`.

Default implementation returns the response unchanged.

```ts
override after(c: ClaireContext, response: Response): Response {
  response.headers.set("X-Powered-By", "ClaireX");
  return response;
}
```

## Registration levels

```ts
app.use(new mw());                                   // global
super("/users", [new mw()]);                         // key
this.routes("post", "/", this.create, [new mw()]);   // route
```

## Execution order

```
global before → key before → route before → HANDLER
global after  ← key after  ← route after  ←
```

Within a level, registration order. See [The Middleware Onion](/docs/concepts/middleware-onion).

## Async

Both hooks may return promises. The framework awaits each before continuing.

## Instance state

Middleware instances live for the lifetime of the app, so instance fields persist across requests. Safe for a `before`/`after` pair within one request; use the context for anything else.

## No `next()`

Flow control belongs to the framework. Middleware decides only whether to stop the request by returning a `Response`.

## Next

- [Writing Middleware](/docs/guides/middleware)
- [Built-in Middleware](/docs/api/built-in-middleware)
