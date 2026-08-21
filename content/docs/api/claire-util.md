# ClaireUtil

Static utility class. Cannot be instantiated — it is `abstract` and exposes only static members.

```ts
import { ClaireUtil } from "@clairex/core";
```

## `signToken(payload, secret, expiresInSeconds?)`

```ts
static signToken(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds?: number,
): Promise<string>
```

Creates a JWT signed with HMAC-SHA256.

| Parameter | Default |
|---|---|
| `payload` | required |
| `secret` | required |
| `expiresInSeconds` | `3600` |

`iat` and `exp` are added automatically.

```ts
const token = await ClaireUtil.signToken(
  { userId: 1, role: "admin" },
  process.env.JWT_SECRET!,
  3600,
);
```

## `verifyToken(token, secret)`

```ts
static verifyToken(
  token: string,
  secret: string,
): Promise<Record<string, unknown>>
```

Verifies the signature and expiry, and returns the decoded payload.

**Throws** if the token is malformed, the signature is invalid, or the token has expired.

```ts
const payload = await ClaireUtil.verifyToken(token, process.env.JWT_SECRET!);
```

## Zero dependencies

Both methods are built on Bun's native `crypto.subtle` — no `jose`, no `jsonwebtoken`.

## Usage

You normally only call `signToken()` yourself, in a login handler. Verification is handled by `ClaireJWT`:

```ts
super("/users", [new ClaireJWT(process.env.JWT_SECRET!)]);
```

```ts
const { userId, role } = c.auth<TokenPayload>();
```

`verifyToken()` is there for cases outside the request lifecycle.

## Next

- [Protecting Routes](/docs/guides/auth)
- [Built-in Middleware](/docs/api/built-in-middleware)
