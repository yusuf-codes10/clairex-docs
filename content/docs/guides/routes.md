# Defining Routes

Routes live on a **ClaireKey**, never on the app. You cannot write `app.get('/users', ...)` — that is deliberate.

## A key

```ts
// src/keys/user.key.claire
import { ClaireKey, ClaireContext } from "@clairex/core";

export class userKey extends ClaireKey {
  constructor() {
    super("/users");
  }

  protected register(): void {
    this.routes("get", "/", this.getUsers);
    this.routes("get", "/:id", this.getUserById);
    this.routes("post", "/", this.createUser);
    this.routes("patch", "/:id", this.updateUser);
    this.routes("delete", "/:id", this.deleteUser);
  }

  private getUsers(c: ClaireContext): Response {
    return c.response.json(users);
  }

  // ...
}
```

Mount it:

```ts
new ClaireX(3000).unlock(new userKey()).listen();
```

## `super(prefix)`

The prefix is prepended to every route on the key:

| `routes()` path | Actual URL |
|---|---|
| `"/"` | `/users` |
| `"/:id"` | `/users/:id` |
| `"/:id/posts"` | `/users/:id/posts` |

Composition happens once, at registration — there is no runtime cost per request.

## `register()`

Called automatically by the base constructor, after the prefix is set. Routes exist the moment you write `new userKey()`.

It must be `protected` and declare `: void`:

```ts
protected register(): void { ... }
```

## `this.routes()`

```ts
this.routes(method, path, handler, middlewares?);
```

| Argument | Type | |
|---|---|---|
| `method` | `"get" \| "post" \| "put" \| "patch" \| "delete"` | lowercase |
| `path` | `string` | relative to the prefix |
| `handler` | `ClaireHandler` | a method on this class |
| `middlewares` | `ClaireMiddleware[]` | optional, route-scoped |

The handler is bound to the key automatically, so `this` works inside it.

## Path parameters

`:name` segments are captured and exposed as strings:

```ts
this.routes("get", "/:id", this.getUserById);
```

```ts
private getUserById(c: ClaireContext): Response {
  const { id } = c.request.params;        // "123" — always a string
  const found = users.find((u) => u.id === Number(id));
  // ...
}
```

Multiple parameters work as expected:

```ts
this.routes("get", "/:userId/posts/:postId", this.getPost);
```

```ts
const { userId, postId } = c.request.params;
```

Wildcard routes are not supported.

## Handlers

Every handler takes a `ClaireContext` and returns a `Response`:

```ts
private getUsers(c: ClaireContext): Response { ... }
private async createUser(c: ClaireContext): Promise<Response> { ... }
```

Both sync and async are fine. `ClaireHandler` is typed as `(c: ClaireContext) => Response | Promise<Response>`, so forgetting to return is a compile error.

Handlers are usually `private` — the framework calls them, not your code.

## Route-level middleware

The fourth argument scopes middleware to one route:

```ts
this.routes("post", "/", this.createUser, [new userValidator()]);
this.routes("delete", "/:id", this.deleteUser, [new adminGuard()]);
```

Validators must be attached here — never at key or global level. See [Writing Middleware](/docs/guides/middleware).

## Key-level middleware

Pass middleware to `super()` to apply it to every route on the key:

```ts
constructor() {
  super("/users", [new authGuard()]);
}
```

## Multiple keys

```ts
new ClaireX(3000)
  .unlock(new userKey())
  .unlock(new postKey())
  .unlock(new authKey())
  .listen();
```

Each key is independent. Adding a resource never touches an existing one.

## Matching

Routes are matched by a linear scan in registration order — the first match wins. Method is compared first, then the path pattern segment by segment.

A request that matches nothing gets a structured 404:

```json
{ "exception": "Route Not Found!" }
```

## Next

- [Reading Requests](/docs/guides/requests)
- [ClaireKey: Five Roles](/docs/concepts/claire-key)
