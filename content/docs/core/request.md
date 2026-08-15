# Request

`ClaireRequest` wraps the native `Request` object and provides typed getters for common data — URL, pathname, method, params, query strings, and headers.

## Class Overview

```ts
class ClaireRequest {
  public params: Record<string, string>

  get url(): URL
  get pathname(): string
  get method(): string
  get query(): Record<string, string>
  get queries(): Record<string, string[]>
  get headers(): Record<string, string>

  async json(): Promise<unknown>
  async text(): Promise<string>
}
```

## Path Parameters

Path params are extracted during route matching and stored on `params`:

```ts
app.get('/users/:id', (c: ClaireContext) => {
  const { id } = c.request.params
  return c.response.json({ id })
})
```

`params` is a `Record<string, string>` — all values are strings.

## URL & Pathname

```ts
app.get('/users', (c: ClaireContext) => {
  c.request.url       // URL object: http://localhost:3000/users?page=1
  c.request.pathname  // "/users"
})
```

- `url` returns the full `URL` object (native Web API)
- `pathname` returns just the path portion as a string

## HTTP Method

```ts
c.request.method // "GET", "POST", "PUT", "PATCH", "DELETE"
```

## Query Parameters

### Single Values — `query`

Returns a `Record<string, string>`. If a key appears multiple times, only the last value is kept:

```ts
// URL: /users?page=1&limit=10
c.request.query // { page: "1", limit: "10" }
```

### Multiple Values — `queries`

Returns a `Record<string, string[]>`. Preserves all values for repeated keys:

```ts
// URL: /users?tag=admin&tag=editor
c.request.queries // { tag: ["admin", "editor"] }
```

## Headers

Returns all request headers as a `Record<string, string>`:

```ts
const token = c.request.headers['authorization']
const contentType = c.request.headers['content-type']
```

## Body Methods

### `json()`

Parses the request body as JSON. Returns `Promise<unknown>`:

```ts
const body = await c.request.json()
```

> **Note:** For typed body access, use `ClaireValidator` + `c.valid<T>()` instead of casting manually.

### `text()`

Returns the raw request body as a string. Returns `Promise<string>`:

```ts
const raw = await c.request.text()
```

## Design Notes

- **Getters for derived state** — `url`, `pathname`, `method`, `query`, `queries`, `headers` are all getters because they derive data from the underlying request without side effects.
- **Methods for actions** — `json()` and `text()` are methods because they perform async I/O (reading the body stream).
