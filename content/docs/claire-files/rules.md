# Rules

Two rules are enforced today. Two more are planned.

| # | Rule | Status |
|---|---|---|
| 1 | The file must export a class | enforced |
| 2 | Methods with an access modifier must declare an explicit return type | enforced |
| 3 | `c.valid<T>()` requires a validator on the route | planned |
| 4 | All parameters must have explicit types | planned |

## Rule 1 export a class

Every `.claire` file must export a class, named or default.

```ts
// valid
export class userKey extends ClaireKey { ... }

// valid
export default class userKey extends ClaireKey { ... }
```

```ts
// rejected — exports a function
export const hello = () => {
  console.log("hello");
};
```

```
   ╔════════════════════════════════════════════════════════╗
   ║  ClairePlugin — 1 violation                             ║
   ╠════════════════════════════════════════════════════════╣
   ║  posts.claire:1  .claire files must export a class      ║
   ╚════════════════════════════════════════════════════════╝
```

If a file is not a class, it should not be a `.claire` file. Use `.ts`.

## Rule 2 explicit return types

Any method with an access modifier -`private`, `public`, `protected`, `override`- must declare its return type.

```ts
// valid
private getUsers(c: ClaireContext): Response {
  return c.response.json(users);
}

private async createUser(c: ClaireContext): Promise<Response> {
  return c.response.json(users, 201);
}

override rules(): ValidationSchema {
  return { name: { type: "string", required: true } };
}
```

```ts
// rejected — no return type
private getUsers(c: ClaireContext) {
  return c.response.json(users);
}
```

Constructors are exempt, they have no return type.

```ts
// valid
constructor() {
  super("/users");
}
```

Methods without an access modifier are not checked, since the rule targets deliberately-declared class members.

## Planned rules

**Rule 3 — validator usage.** Calling `c.valid<T>()` in a handler whose route has no validator attached would be rejected at load time. Today this is caught at runtime, on the first request:

```
No validated body found. Did you forget to attach a ClaireValidator middleware to this route?
```

Both halves of the check live in the same file -the route registration in `register()` and the call in the handler- so the correlation is possible.

**Rule 4 explicit parameter types.** `(c)` would be rejected in favour of `(c: ClaireContext)`. Straightforward, and consistent with Rule 2.

## Failure behaviour

A violation prints the styled box and exits with code `1`. The server never starts.

All violations in a file are reported at once, with line numbers, you are not fixing them one run at a time.

## Next

- [Editor Setup](/docs/claire-files/editor-setup)
- [.claire Overview](/docs/claire-files/overview)
