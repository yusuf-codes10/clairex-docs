# ClaireContext

Created once per request and passed to every handler.

```ts
private getUsers(c: ClaireContext): Response {
  const { id } = c.request.params;
  return c.response.json(users);
}
```

## Properties

| | Type | |
|---|---|---|
| `request` | `ClaireRequest` | reads the incoming request |
| `response` | `ClaireResponse` | builds the reply |

## `valid<T>()`

```ts
valid<T>(): T
```

Returns the validated request body. For POST and PUT — every field is guaranteed present.

**Throws** `ClaireException` 500 if:
- the body was partial (a PATCH route) — use `patched<T>()`
- no validated body exists — no `ClaireValidator` on the route

```ts
const body = c.valid<User>();
```

## `patched<T>()`

```ts
patched<T>(): Partial<T>
```

Returns the validated PATCH body as `Partial<T>`. Only the fields the client sent were validated and stored, so every property is optional.

**Throws** `ClaireException` 500 if the body was full — use `valid<T>()`.

```ts
const patch = c.patched<User>();

if (patch.name !== undefined) found.name = patch.name;
if (patch.age !== undefined) found.age = patch.age;
```

The return type is `Partial<T>` rather than `T` on purpose — it makes an unguarded assignment a compile error. See [Partial Updates](/docs/guides/partial-updates).

## `auth<T>()`

```ts
auth<T>(): T
```

Returns the decoded JWT payload stored by `ClaireJWT`.

**Throws** `ClaireException` 500 if no JWT middleware ran on the route.

```ts
type TokenPayload = { userId: number; role: string };
const { userId, role } = c.auth<TokenPayload>();
```

## Which body accessor

| Route method | Accessor | Returns |
|---|---|---|
| POST, PUT | `valid<T>()` | `T` |
| PATCH | `patched<T>()` | `Partial<T>` |

Using the wrong one throws with a message naming the correct one.

## Internal members

`body`, `partial`, and `setAuth` setters are written by middleware — `ClaireValidator` and `ClaireJWT` — not by application code.

## Next

- [Partial Updates](/docs/guides/partial-updates)
- [ClaireRequest](/docs/api/claire-request)
