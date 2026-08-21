# Protecting Routes

ClaireX ships JWT authentication with no external dependencies — signing and verification are built on Bun's native `crypto.subtle`.

## Issue a token

```ts
import { ClaireUtil, ClaireKey, ClaireContext, ClaireException } from "@clairex/core";

const SECRET = process.env.JWT_SECRET!;

export class authKey extends ClaireKey {
  constructor() {
    super("/auth");
  }

  protected register(): void {
    this.routes("post", "/login", this.login, [new loginValidator()]);
  }

  private async login(c: ClaireContext): Promise<Response> {
    const { email, password } = c.valid<Credentials>();

    const user = await findUser(email, password);
    if (!user) throw new ClaireException(401, "Invalid credentials");

    const token = await ClaireUtil.signToken(
      { userId: user.id, role: user.role },
      SECRET,
      3600,
    );

    return c.response.json({ token });
  }
}
```

`signToken(payload, secret, expiresInSeconds?)` uses HMAC-SHA256. Expiry defaults to 3600 seconds.

## Protect routes

Attach `ClaireJWT` at the level you want:

```ts
// every route on this key
constructor() {
  super("/users", [new ClaireJWT(process.env.JWT_SECRET!)]);
}
```

```ts
// one route
this.routes("delete", "/:id", this.deleteUser, [
  new ClaireJWT(process.env.JWT_SECRET!),
]);
```

The middleware expects a Bearer token:

```
Authorization: Bearer <token>
```

It checks the header exists, extracts the token, verifies the signature and expiry, and stores the decoded payload on the context. Any failure short-circuits with 401.

## Read the payload

```ts
type TokenPayload = { userId: number; role: string };

private getProfile(c: ClaireContext): Response {
  const { userId, role } = c.auth<TokenPayload>();
  return c.response.json({ userId, role });
}
```

`c.auth<T>()` throws if no JWT middleware ran on the route:

```
No auth payload found. Did you forget to attach a ClaireJWT middleware?
```

## Role checks

Authentication and authorization are separate concerns. `ClaireJWT` proves *who* — a small middleware decides *whether*:

```ts
export class adminGuard extends ClaireMiddleware {
  override before(c: ClaireContext): void | Response {
    const { role } = c.auth<TokenPayload>();

    if (role !== "admin") {
      return c.response.json({ error: "Forbidden" }, 403);
    }
  }
}
```

Order matters — `ClaireJWT` must run first, or `c.auth<T>()` will throw:

```ts
this.routes("delete", "/:id", this.deleteUser, [
  new ClaireJWT(SECRET),
  new adminGuard(),
]);
```

## Verify manually

`ClaireUtil` exposes the primitives if you need them outside the middleware:

```ts
const payload = await ClaireUtil.verifyToken(token, SECRET);
```

Throws on a malformed token, a bad signature, or expiry.

## A typical layout

```ts
new ClaireX(3000)
  .unlock(new authKey())      // public — login
  .unlock(new userKey())      // protected — JWT at key level
  .use(new claireCors(...))
  .listen();
```

Keep public and protected routes on separate keys. That way the key constructor declares the security posture of everything inside it, in one place.

## Reference

| | |
|---|---|
| `new ClaireJWT(secret)` | verifies Bearer tokens, stores payload |
| `ClaireUtil.signToken(payload, secret, expiresIn?)` | `Promise<string>` |
| `ClaireUtil.verifyToken(token, secret)` | `Promise<Record<string, unknown>>` |
| `c.auth<T>()` | typed payload, throws if absent |

## Next

- [Enabling CORS](/docs/guides/cors)
- [Built-in Middleware](/docs/api/built-in-middleware)
