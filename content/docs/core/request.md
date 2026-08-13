# Request

`ClaireRequest` wraps the native `Request` object and provides typed getters for common operations.

## Getters

All read-only properties are exposed as getters — they derive state from the underlying request, no side effects.

### `method`

The HTTP method as a string:

```ts
ctx.request.method // "GET", "POST", "PUT", etc.
```

### `url`

The full URL as a `URL` object:

```ts
ctx.request.url // URL { href: "http://localhost:3000/users?page=1", ... }
```

### `pathname`

Just the path portion:

```ts
ctx.request.pathname // "/users"
```

### `params`

Route parameters extracted from dynamic segments:

```ts
// Route: /users/:id
ctx.request.params // { id: "123" }
```

Return type: `Record<string, string>`

### `query`

Query string parameters (single values — last value wins for duplicates):

```ts
// URL: /search?q=claire&page=2
ctx.request.query // { q: "claire", page: "2" }
```

Return type: `Record<string, string>`

### `queries`

Query string parameters (all values preserved as arrays):

```ts
// URL: /filter?tag=bun&tag=typescript
ctx.request.queries // { tag: ["bun", "typescript"] }
```

Return type: `Record<string, string[]>`

### `headers`

Request headers as a flat object:

```ts
ctx.request.headers // { "content-type": "application/json", "authorization": "Bearer ..." }
```

Return type: `Record<string, string>`

## Methods

Methods perform actions — they do something (parse, read) and may be async.

### `json()`

Parse the request body as JSON:

```ts
const body = await ctx.request.json()
```

Return type: `Promise<unknown>`

### `text()`

Read the request body as plain text:

```ts
const raw = await ctx.request.text()
```

Return type: `Promise<string>`

## Design Notes

- **Getters vs methods** — Getters are for derived state (no args, no side effects). Methods are for actions that require work (body parsing is async I/O).
- **Explicit return types** — Every getter and method has a declared return type. No inference.
- **Backing field pattern** — Internal state uses private `_field` with a public getter for encapsulation.
