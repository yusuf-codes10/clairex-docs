# Handling Errors

`ClaireException` is the one error class. You give it a status code and a message.

## Throwing

```ts
private getUserById(c: ClaireContext): Response {
  const { id } = c.request.params;
  const found = users.find((u) => u.id === Number(id));

  if (!found) throw new ClaireException(404, "User not found!");

  return c.response.json(found);
}
```

The framework catches it and converts it into a structured response:

```json
{ "exception": "User not found!" }
```

Status `404`, `Content-Type: application/json`.

## Returning

You can also convert it yourself and return it:

```ts
if (!found) return new ClaireException(404, "User not found!").toResponse();
```

Same output. The difference is control flow:

| | Behaviour |
|---|---|
| `throw` | unwinds to the framework's global catch |
| `return .toResponse()` | never leaves your handler |

Use `throw` to bail out from deep in a call stack. Use `return` when the handler should stay in charge. Both are idiomatic.

## Metadata

An optional third argument carries extra detail:

```ts
throw new ClaireException(400, "Invalid input", { field: "email" });
```

Available on the instance as `.metadata`. Not currently included in the response body.

## The global catch

Every request is wrapped in a try/catch:

```ts
catch (e) {
  if (e instanceof ClaireException) return e.toResponse();
  return new ClaireException(500, "Internal Server Error").toResponse();
}
```

So:

- **`ClaireException`** → your status and message
- **Anything else** → generic 500, details logged but not exposed

An unexpected error cannot crash the process or leak a stack trace to the client.

## Terminal output

Errors are logged in a styled box as well as returned:

```
   ╔════════════════════════════════════════════════════════╗
   ║  ClaireException [404]                                  ║
   ╠════════════════════════════════════════════════════════╣
   ║  User not found!                                        ║
   ╚════════════════════════════════════════════════════════╝
```

## Unmatched routes

A request matching no route gets the same treatment:

```json
{ "exception": "Route Not Found!" }
```

## Validation errors

Validators produce `ClaireException` responses too, so error shape is consistent across the framework:

```json
{ "exception": "Validation failed!: \"name\" must be at least 3 characters" }
```

## Framework guards

ClaireX throws deliberately when it detects misuse, always with a message naming the fix:

| Situation | Message |
|---|---|
| `c.valid<T>()` with no validator | *No validated body found. Did you forget to attach a ClaireValidator middleware to this route?* |
| `c.valid<T>()` on a PATCH route | *This route received a partial body (PATCH). Use `c.patched<T>()` instead.* |
| `c.patched<T>()` on a POST route | *This route received a full body. Use `c.valid<T>()` instead.* |
| `c.auth<T>()` with no JWT middleware | *No auth payload found. Did you forget to attach a ClaireJWT middleware?* |
| Validator at key or global level | *Validators must be used on the route level only!* |

The framework does not fail silently. If something is wired wrong, it says so.

## Why no exception subclasses

`NotFoundException`, `ValidationException` and friends were considered and rejected. Status codes are universal — every developer knows 404. Wrapping them in class names adds a layer to learn without adding information.

```ts
throw new ClaireException(404, "User not found!");
```

is more explicit than

```ts
throw new NotFoundException("User not found!");
```

One class, explicit codes.

## Next

- [ClaireException reference](/docs/api/claire-exception)
- [Validating Input](/docs/guides/validation)
