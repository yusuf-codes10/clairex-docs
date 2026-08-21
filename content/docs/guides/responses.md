# Sending Responses

`c.response` builds replies. Every method returns a native `Response`, which is what your handler must return.

## JSON

```ts
return c.response.json(users);
return c.response.json({ created: true }, 201);
```

Serialises with `JSON.stringify` and sets `Content-Type: application/json`. Status defaults to 200.

## Text

```ts
return c.response.text("OK");
return c.response.text("Not found", 404);
```

`Content-Type: text/plain`.

## HTML

```ts
return c.response.html("<h1>Hello</h1>");
```

`Content-Type: text/html`.

## Redirect

```ts
return c.response.redirect("/login");            // 302
return c.response.redirect("/new-home", 301);    // permanent
```

Sets `Location` and sends a null body. Status is constrained to `301 | 302` — no arbitrary codes.

## Status codes

Every method takes an optional status as its last argument:

```ts
return c.response.json(user, 201);
return c.response.json({ error: "Forbidden" }, 403);
```

The most recent status is readable via `c.response.status`, though you rarely need it.

## Errors

For error responses, prefer `ClaireException` over a hand-built JSON body — you get a consistent shape and a styled terminal log:

```ts
// throw — the framework catches and converts it
throw new ClaireException(404, "User not found!");

// or return inline
return new ClaireException(404, "User not found!").toResponse();
```

```json
{ "exception": "User not found!" }
```

See [Handling Errors](/docs/guides/errors).

## Handlers must return a Response

```ts
private getUsers(c: ClaireContext): Response {
  return c.response.json(users);
}
```

`ClaireHandler` is typed as `(c: ClaireContext) => Response | Promise<Response>`, so forgetting the return is a compile error rather than a runtime crash.

## Native Responses

Nothing stops you constructing one directly:

```ts
return new Response(file, {
  status: 200,
  headers: { "Content-Type": "application/pdf" },
});
```

`c.response` is a convenience, not a requirement.

## Reference

| | Content-Type | Default status |
|---|---|---|
| `json(data, status?)` | `application/json` | 200 |
| `text(data, status?)` | `text/plain` | 200 |
| `html(data, status?)` | `text/html` | 200 |
| `redirect(url, status?)` | — | 302 |

Response streaming is not currently supported.

## Next

- [Handling Errors](/docs/guides/errors)
- [ClaireResponse reference](/docs/api/claire-response)
