# Reading Requests

Everything about the incoming request is on `c.request`.

## Path parameters

```ts
this.routes("get", "/:id", this.getUserById);
```

```ts
private getUserById(c: ClaireContext): Response {
  const { id } = c.request.params;      // Record<string, string>
  const found = users.find((u) => u.id === Number(id));
  // ...
}
```

Always strings — convert as needed. URL segments carry no type information.

## Query strings

Two getters, depending on whether you care about repeated keys.

**`query`** — single value per key, last one wins:

```ts
// GET /users?page=2&limit=10
const { page, limit } = c.request.query;   // { page: "2", limit: "10" }
```

**`queries`** — all values, as arrays:

```ts
// GET /users?tag=admin&tag=editor
const { tag } = c.request.queries;         // { tag: ["admin", "editor"] }
```

## Headers

```ts
c.request.headers.get("authorization");    // string | null
c.request.headers.has("authorization");    // boolean
c.request.headers.all();                   // Record<string, string>
```

Case-insensitive — `Authorization` and `authorization` both work. Values are read lazily, so `get()` does not build the whole object.

## Body

In almost all cases, read the body through a validator:

```ts
const body = c.valid<User>();       // POST / PUT
const patch = c.patched<User>();    // PATCH
```

See [Validating Input](/docs/guides/validation).

The raw body is available if you need it:

```ts
const data = await c.request.json();   // Promise<unknown>
const text = await c.request.text();   // Promise<string>
```

`json()` returns `unknown` on purpose — runtime data has no compile-time type. Casting it with `as` is a claim the compiler cannot check. Use a validator instead and get a typed body backed by runtime proof.

::alert{type="warning"}
The body is a one-shot stream. Reading it twice throws. If a validator is attached to the route, it has already consumed the body — read the result via `valid<T>()` or `patched<T>()`, not `json()`.
::

## Method and URL

```ts
c.request.method;       // "GET" | "POST" | ...
c.request.pathname;     // "/users/123"
c.request.url;          // native URL object
```

```ts
c.request.url.origin;   // "http://localhost:3000"
c.request.url.search;   // "?page=2"
```

## Auth payload

After `ClaireJWT` has run:

```ts
type TokenPayload = { userId: number; role: string };

const user = c.auth<TokenPayload>();
```

Throws if no JWT middleware ran on the route. See [Protecting Routes](/docs/guides/auth).

## Reference

| | Type | |
|---|---|---|
| `params` | `Record<string, string>` | path parameters |
| `query` | `Record<string, string>` | query, single value |
| `queries` | `Record<string, string[]>` | query, all values |
| `headers.get(k)` | `string \| null` | one header |
| `headers.has(k)` | `boolean` | presence check |
| `headers.all()` | `Record<string, string>` | every header |
| `method` | `string` | uppercase |
| `pathname` | `string` | path only |
| `url` | `URL` | full parsed URL |
| `json()` | `Promise<unknown>` | raw parsed body |
| `text()` | `Promise<string>` | raw body text |

## Next

- [Sending Responses](/docs/guides/responses)
- [ClaireRequest reference](/docs/api/claire-request)
