# ClaireResponse

Response builder. Accessed via `c.response`. Every method returns a native `Response`.

## `json(data, status?)`

```ts
json(data: unknown, status: number = 200): Response
```

Serialises with `JSON.stringify`. Sets `Content-Type: application/json`.

```ts
return c.response.json(users);
return c.response.json({ created: true }, 201);
```

## `text(data, status?)`

```ts
text(data: string, status: number = 200): Response
```

Sets `Content-Type: text/plain`.

```ts
return c.response.text("OK");
return c.response.text("Not found", 404);
```

## `html(data, status?)`

```ts
html(data: string, status: number = 200): Response
```

Sets `Content-Type: text/html`.

```ts
return c.response.html("<h1>Hello</h1>");
```

## `redirect(url, status?)`

```ts
redirect(url: string, status: 301 | 302 = 302): Response
```

Sets `Location` and sends a null body. Status is constrained to `301 | 302`.

```ts
return c.response.redirect("/login");
return c.response.redirect("/new-home", 301);
```

## `status`

```ts
get status(): number
```

The status of the most recently built response. Read-only.

## Reference

| Method | Content-Type | Default status |
|---|---|---|
| `json()` | `application/json` | 200 |
| `text()` | `text/plain` | 200 |
| `html()` | `text/html` | 200 |
| `redirect()` | — | 302 |

Streaming is not currently supported. For anything unusual, construct a native `Response` directly.

## Next

- [Sending Responses](/docs/guides/responses)
- [ClaireException](/docs/api/claire-exception)
