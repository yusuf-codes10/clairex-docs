# Writing Middleware

Middleware is a class with two optional hooks: `before()` runs on the way in, `after()` runs on the way out.

## A middleware

```ts
// src/middlewares/auth.guard.claire
import { ClaireMiddleware, ClaireContext } from "@clairex/core";

export class authGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    const token = c.request.headers.get("authorization");

    if (!token) {
      return c.response.json({ error: "Unauthorized" }, 401);
    }
  }
}
```

Returning a `Response` from `before()` **short-circuits** — the handler never runs.

Returning nothing continues to the next middleware, and eventually the handler.

## `after()`

```ts
export class timingHeader extends ClaireMiddleware {
  private start: number = 0;

  override before(c: ClaireContext): void {
    this.start = performance.now();
  }

  override after(c: ClaireContext, response: Response): Response {
    response.headers.set("X-Duration", `${performance.now() - this.start}ms`);
    return response;
  }
}
```

`after()` receives the response and must return one — modified or not.

## Three levels

Middleware attaches at three scopes:

```ts
// global — every route in the app
app.use(new claireCors(...));

// key — every route on this resource
constructor() {
  super("/users", [new authGuard()]);
}

// route — this route only
this.routes("post", "/", this.createUser, [new userValidator()]);
```

## Execution order

```
global before   →  key before   →  route before   →  HANDLER
global after    ←  key after    ←  route after    ←
```

`before()` hooks run outermost first. `after()` hooks run in reverse — the onion model.

Within a level, order follows registration.

```ts
app.use(new a());
app.use(new b());

// a.before → b.before → handler → b.after → a.after
```

## Short-circuiting

Any `before()` returning a `Response` stops everything below it — remaining middleware, the handler, and **all** `after()` hooks:

```ts
override before(c: ClaireContext): void | Response {
  if (!c.request.headers.has("authorization")) {
    return c.response.json({ error: "Unauthorized" }, 401);
  }
}
```

::alert{type="info"}
`after()` does not run when a request short-circuits. The mental model is simple: if `before()` stops it, it is stopped. Do not put cleanup logic in `after()` that must run unconditionally.
::

## Async

Both hooks may be async:

```ts
override async before(c: ClaireContext): Promise<void | Response> {
  const valid = await checkToken(c.request.headers.get("authorization"));
  if (!valid) return c.response.json({ error: "Invalid token" }, 401);
}
```

The framework awaits each hook before moving on.

## Passing data to handlers

Middleware writes to the context, handlers read from it. Built-in examples:

| Middleware writes | Handler reads |
|---|---|
| `ClaireValidator` | `c.valid<T>()` / `c.patched<T>()` |
| `ClaireJWT` | `c.auth<T>()` |

Each accessor throws with a hint if the middleware never ran.

## Validators are route-level only

```ts
// ✅
this.routes("post", "/", this.createUser, [new userValidator()]);

// ❌ throws at startup
super("/users", [new userValidator()]);
app.use(new userValidator());
```

A validator reads the request body. At key or global level it cannot know which route it is validating or what shape that route expects, and it would break bodyless GET routes. The framework refuses to start rather than let you discover this at runtime.

## Built-in middleware

| | Level | |
|---|---|---|
| `ClaireLogger` | global | auto-registered, logs method + timing |
| `ClaireCors` | global | preflight + CORS headers |
| `ClaireJWT` | key or route | verifies Bearer tokens |
| `ClaireValidator` | route only | body validation |

## No `next()`

ClaireX has no `next()` callback. The framework controls flow; middleware only decides whether to stop it by returning a `Response`. There is no way to forget to call `next()`, and no way to call it twice.

## Next

- [Protecting Routes](/docs/guides/auth)
- [The Middleware Onion](/docs/concepts/middleware-onion)
