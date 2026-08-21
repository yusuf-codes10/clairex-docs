# ClaireX

The application class. Three methods.

```ts
import { ClaireX } from "@clairex/core";

new ClaireX(3000)
  .unlock(new userKey())
  .use(new ClaireCors("*", ["Content-Type"], ["GET", "POST"], []))
  .listen();
```

## `constructor(port?)`

| Parameter | Type | Default |
|---|---|---|
| `port` | `number` | `3000` |

Registers `ClaireLogger` as the first global middleware automatically.

## `unlock(key)`

Mounts a `ClaireKey` and all of its routes.

| Parameter | Type |
|---|---|
| `key` | `ClaireKey` |

**Returns** `this` — chainable.

```ts
app.unlock(new userKey());
app.unlock(new postKey());
```

## `use(middleware)`

Registers global middleware, running on every route in registration order.

| Parameter | Type |
|---|---|
| `middleware` | `ClaireMiddleware` |

**Returns** `this` — chainable.

**Throws** `ClaireException` 500 if passed a `ClaireValidator` — validators are route-level only.

```ts
app.use(new ClaireCors(...));
app.use(new rateLimiter());
```

## `listen()`

Starts `Bun.serve` on the configured port and prints the startup banner.

**Returns** `void` — terminates a chain.

## No route methods

There is no `app.get()`, `app.post()`, or equivalent. `ClaireX` owns a `ClaireRouter` privately rather than extending one, so routes are defined on keys.

See [ClaireKey: Five Roles](/docs/concepts/claire-key).

## Notes

`ClaireLogger` is registered before any middleware you add, so its `after()` runs last and its timings include everything.

Every request is wrapped in a try/catch. `ClaireException` instances become their declared status; anything else becomes a generic 500.

## Next

- [ClaireKey](/docs/api/claire-key)
- [Built-in Middleware](/docs/api/built-in-middleware)
