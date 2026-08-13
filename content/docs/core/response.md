# Response

`ClaireResponse` is a response builder class. Each method creates and returns a native `Response` object with the appropriate headers and status code.

## Methods

### `json(data, status?)`

Returns a JSON response with `Content-Type: application/json`:

```ts
ctx.response.json({ message: 'Hello' })        // 200
ctx.response.json({ created: true }, 201)       // 201
ctx.response.json({ error: 'Not found' }, 404)  // 404
```

### `text(data, status?)`

Returns a plain text response with `Content-Type: text/plain`:

```ts
ctx.response.text('OK')                  // 200
ctx.response.text('Created', 201)        // 201
```

### `html(data, status?)`

Returns an HTML response with `Content-Type: text/html`:

```ts
ctx.response.html('<h1>Hello</h1>')              // 200
ctx.response.html('<p>Not found</p>', 404)       // 404
```

### `redirect(url, status?)`

Returns a redirect response with a `Location` header:

```ts
ctx.response.redirect('/login')          // 302 (default)
ctx.response.redirect('/new-url', 301)   // 301 permanent
```

Only `301` and `302` are accepted as status codes.

## Default Status

All methods default to status `200` unless specified. The `redirect` method defaults to `302`.

## Return Type

Every method returns a native `Response` object. This is what Bun.serve expects from the fetch handler.

```ts
app.get('/example', (ctx) => {
  // This IS the native Response returned to the client
  return ctx.response.json({ ok: true })
})
```

## Design Notes

- **No chaining** — Each method returns a final `Response`, not the builder. One call = one response.
- **Explicit status** — Status is always a parameter, never set separately. What you see is what you get.
- **Backing field pattern** — The internal `_status` field is private with a getter for encapsulation.
