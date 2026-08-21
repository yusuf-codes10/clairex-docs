# Your First API

This is a tour of what `bun create clairex` generated. Four files, one working resource.

```bash
bun create clairex my-app
cd my-app && bun install && bun dev
```

```
src/
├── index.ts                          the app
├── types/user.ts                     compile-time shape
├── keys/user.key.claire              routes + handlers
└── validators/user.validator.claire  runtime shape
```

## The app

```ts
// src/index.ts
import { ClaireX } from "@clairex/core";
import { userKey } from "./keys/user.key.claire";

new ClaireX(3000).unlock(new userKey()).listen();
```

`ClaireX` has exactly three methods:

- `unlock(key)`: mounts a resource and all its routes
- `use(middleware)`: registers global middleware
- `listen()`: starts the server

Notice there are no route definitions here. You cannot write `app.get('/users', ...)`, routes live on keys. That constraint is deliberate; see [ClaireKey: Five Roles](/docs/concepts/claire-key).

`unlock()` and `use()` return `this`, so they chain.

## The type

```ts
// src/types/user.ts
export type User = {
  id: number;
  name: string;
  age: number;
};
```

Just a TypeScript type. ClaireX does not generate types from schemas or infer them, you have to declare the shape you expect, and the validator proves it at runtime. Two declarations, two purposes.

## The validator

```ts
// src/validators/user.validator.claire
import { ClaireValidator } from "@clairex/core";
import type { ValidationSchema } from "@clairex/core";

export class userValidator extends ClaireValidator {
  override rules(): ValidationSchema {
    return {
      id:   { type: "number", required: true, immutable: true },
      name: { type: "string", required: true, min: 3, max: 50 },
      age:  { type: "number", required: true, min: 18 },
    };
  }
}
```

One validator for the whole resource. `rules()` is the only method you have to write.

`immutable: true` on `id` means it is required when creating a user and **rejected** when updating one.

## The key

```ts
// src/keys/user.key.claire
import { ClaireKey, ClaireContext, ClaireException } from "@clairex/core";
import { userValidator } from "../validators/user.validator.claire";
import type { User } from "../types/user";

const users: User[] = [
  { id: 1, name: "Claire", age: 23 },
  { id: 2, name: "Veronica", age: 28 },
];

export class userKey extends ClaireKey {
  constructor() {
    super("/users");
  }

  protected register(): void {
    this.routes("get", "/", this.getUsers);
    this.routes("get", "/:id", this.getUserById);
    this.routes("post", "/", this.createUser, [new userValidator()]);
    this.routes("patch", "/:id", this.updateUser, [new userValidator()]);
  }

  // ...handlers
}
```

`super("/users")` sets the prefix, every route is relative to it, so `"/"` becomes `/users` and `"/:id"` becomes `/users/:id`.

`register()` is called automatically when the key is constructed. Routes exist the moment you write `new userKey()`.

The fourth argument to `routes()` is route-level middleware. The same validator instance is attached to both `post` and `patch`, the framework works out what each method needs.

## Reading a request

```ts
private getUserById(c: ClaireContext): Response {
  const { id } = c.request.params;
  const found: User | undefined = users.find((u) => u.id === Number(id));

  if (!found) throw new ClaireException(404, "User not found!");

  return c.response.json(found);
}
```

Every handler receives a `ClaireContext` and returns a `Response`.

`c.request` reads the request, `c.response` builds the reply. Path parameters come from `c.request.params` as strings, `:id` in the pattern becomes `params.id`.

Throwing a `ClaireException` is caught by the framework and converted into a structured JSON response. You can also return `.toResponse()` inline if you would rather stay in control.

## Creating — full validation

```ts
private createUser(c: ClaireContext): Response {
  const body: User = c.valid<User>();

  if (users.find((u) => u.id === body.id)) {
    return new ClaireException(400, "User id already exists!").toResponse();
  }

  users.push(body);
  return c.response.json(users, 201);
}
```

`c.valid<User>()` returns the validated body. Because this is a POST, every `required` field was enforced, so every property is guaranteed present.

Try it:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"id":3,"name":"Ada","age":36}'
```

And a failure:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"id":4,"name":"Ad","age":36}'

# {"exception":"Validation failed!: \"name\" must be at least 3 characters"}
```

## Updating — partial validation

```ts
private updateUser(c: ClaireContext): Response {
  const { id } = c.request.params;
  const patch: Partial<User> = c.patched<User>();

  const found: User | undefined = users.find((u) => u.id === Number(id));
  if (!found) return new ClaireException(404, "User not found!").toResponse();

  if (patch.name !== undefined) found.name = patch.name;
  if (patch.age !== undefined) found.age = patch.age;

  return c.response.json(found);
}
```

This is the part worth slowing down on.

On a PATCH, only the fields the client actually sent were validated and stored. So the handler reads with `c.patched<User>()`, which returns **`Partial<User>`** — not `User`.

That means TypeScript types `patch.name` as `string | undefined`, and refuses to let you assign it directly to `found.name`. You are forced to check first.

Without that, `PATCH { "age": 24 }` would leave `patch.name` as `undefined`, and `found.name = patch.name` would silently erase the stored name. The type system makes that unwritable.

```bash
# update just the age — name is untouched
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":24}'

# {"id":1,"name":"Claire","age":24}
```

Bounds still apply on PATCH:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"ab"}'

# {"exception":"Validation failed!: \"name\" must be at least 3 characters"}
```

And `immutable` fields are rejected:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"id":99}'

# {"exception":"Validation failed!: \"id\" cannot be updated"}
```

See [Partial Updates](/docs/guides/partial-updates) for the full explanation.

## What you get for free

The server logs every request with timing — `ClaireLogger` is registered automatically:

```
→ GET http://localhost:3000/users
← GET http://localhost:3000/users 2.34ms
```

Unhandled errors are caught and returned as structured JSON rather than crashing the process.

## Next

- [Project Structure](/docs/getting-started/project-structure) — conventions and where things go
- [Validating Input](/docs/guides/validation) — one validator per resource
- [.claire Files](/docs/claire-files/overview) — what the extension enforces
