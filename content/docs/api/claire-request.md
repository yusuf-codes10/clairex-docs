# ClaireRequest

Wraps the native `Request`. Accessed via `c.request`.

## Getters

### `params`

```ts
get params(): Record<string, string>
```

Path parameters captured from `:name` segments. Always strings.

```ts
// route "/users/:id", request /users/123
const { id } = c.request.params;   // "123"
```

### `query`

```ts
get query(): Record<string, string>
```

Query parameters, one value per key. Last occurrence wins.

```ts
// /users?page=2&limit=10
c.request.query;   // { page: "2", limit: "10" }
```

### `queries`

```ts
get queries(): Record<string, string[]>
```

Query parameters with every value preserved.

```ts
// /users?tag=admin&tag=editor
c.request.queries;   // { tag: ["admin", "editor"] }
```

### `headers`

```ts
get headers(): {
  get(key: string): string | null;
  has(key: string): boolean;
  all(): Record<string, string>;
}
```

Case-insensitive. Values are read lazily.

```ts
c.request.headers.get("authorization");
c.request.headers.has("authorization");
c.request.headers.all();
```

### `method`

```ts
get method(): string
```

Uppercase HTTP method.

### `pathname`

```ts
get pathname(): string
```

Path without query string.

```ts
// /users/123?page=2
c.request.pathname;   // "/users/123"
```

### `url`

```ts
get url(): URL
```

The full parsed URL.

```ts
c.request.url.origin;   // "http://localhost:3000"
c.request.url.search;   // "?page=2"
```

## Methods

### `json()`

```ts
async json(): Promise<unknown>
```

Parses the body as JSON. Returns `unknown` — runtime data has no compile-time type.

For typed access, use a validator and read via `c.valid<T>()` or `c.patched<T>()`.

### `text()`

```ts
async text(): Promise<string>
```

Returns the raw body as text.

::alert{type="warning"}
The body is a one-shot stream — reading it twice throws. If a validator is attached to the route it has already consumed the body; read the result via `valid<T>()` or `patched<T>()`.
::

## Next

- [Reading Requests](/docs/guides/requests)
- [ClaireResponse](/docs/api/claire-response)
