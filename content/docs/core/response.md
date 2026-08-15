# Response

`ClaireResponse` provides helper methods for building native `Response` objects. Every method returns a standard Web API `Response` — ClaireX never wraps or abstracts the response further.

## Class Overview

```ts
class ClaireResponse {
  get status(): number

  json(data: unknown, status?: number): Response
  text(data: string, status?: number): Response
  html(data: string, status?: number): Response
  redirect(url: string, status?: 301 | 302): Response
}
```

## JSON Response

Returns a `Response` with `Content-Type: application/json`:

```ts
return c.response.json({ message: 'Hello' })
return c.response.json({ error: 'Not found' }, 404)
return c.response.json(users, 200)
```

- `data` — Any serializable value (objects, arrays, primitives)
- `status` — HTTP status code, defaults to 200

## Text Response

Returns a `Response` with `Content-Type: text/plain`:

```ts
return c.response.text('OK')
return c.response.text('Not found', 404)
```

- `data` — A plain string
- `status` — HTTP status code, defaults to 200

## HTML Response

Returns a `Response` with `Content-Type: text/html`:

```ts
return c.response.html('<h1>Hello</h1>')
return c.response.html('<p>Error</p>', 500)
```

- `data` — An HTML string
- `status` — HTTP status code, defaults to 200

## Redirect

Returns a `Response` with a `Location` header and null body:

```ts
return c.response.redirect('/login')
return c.response.redirect('/new-page', 301)
```

- `url` — The URL to redirect to
- `status` — Either `301` (permanent) or `302` (temporary), defaults to 302

## Status Getter

The `status` getter returns the current status code stored on the response instance:

```ts
c.response.status // 200 (default)
```

The status is updated internally whenever you call `json()`, `text()`, `html()`, or `redirect()`.

## Design Notes

- Every method returns a **native `Response`** — no wrapper, no custom class.
- The `_status` field uses the backing field pattern (private `_status`, public getter `status`).
- Status defaults to 200 in the constructor and is updated by each response method.
- You always return the result of a response method from your handler — ClaireX sends it directly to the client.
