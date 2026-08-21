# ClaireKey

Abstract base class for a resource: prefix, routes, handlers, and scoped middleware.

```ts
import { ClaireKey, ClaireContext } from "@clairex/core";

export class userKey extends ClaireKey {
  constructor() {
    super("/users", [new authGuard()]);
  }

  protected register(): void {
    this.routes("get", "/", this.getUsers);
    this.routes("post", "/", this.createUser, [new userValidator()]);
  }

  private getUsers(c: ClaireContext): Response {
    return c.response.json(users);
  }
}
```

## `constructor(prefix, middlewares?)`

| Parameter | Type | Default |
|---|---|---|
| `prefix` | `string` | required |
| `middlewares` | `ClaireMiddleware[]` | `[]` |

Call via `super()`. `register()` runs automatically afterwards, so routes exist as soon as the key is constructed.

**Throws** `ClaireException` 500 if a `ClaireValidator` is passed — validators are route-level only.

## `register()`

```ts
protected abstract register(): void;
```

Define your routes here. Called by the base constructor after the prefix is set.

Must be `protected` and declare `: void`.

## `routes(method, path, handler, middlewares?)`

```ts
protected routes(
  method: "get" | "post" | "put" | "patch" | "delete",
  path: string,
  handler: ClaireHandler,
  middlewares?: ClaireMiddleware[],
): void
```

| Parameter | Notes |
|---|---|
| `method` | lowercase; uppercased internally |
| `path` | relative to the prefix |
| `handler` | a method on this class — bound automatically |
| `middlewares` | optional, scoped to this route only |

Prefix composition happens here, once, at registration.

```ts
this.routes("get", "/:id", this.getUserById);
this.routes("post", "/", this.createUser, [new userValidator()]);
```

## Handler binding

Handlers are bound to the key instance, so `this` works inside them:

```ts
export class userKey extends ClaireKey {
  private users: User[] = [];

  protected register(): void {
    this.routes("get", "/", this.getUsers);
  }

  private getUsers(c: ClaireContext): Response {
    return c.response.json(this.users);
  }
}
```

## Internal members

`router` and `middlewares` getters exist for `ClaireX.unlock()` to read when mounting. Not intended for application code.

## Limitations

- No nesting — a key cannot mount another key
- One prefix per key
- No wildcard routes

## Next

- [Defining Routes](/docs/guides/routes)
- [ClaireKey: Five Roles](/docs/concepts/claire-key)
