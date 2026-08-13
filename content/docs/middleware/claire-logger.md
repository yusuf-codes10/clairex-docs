# ClaireLogger

`ClaireLogger` is the built-in logging middleware that ships with ClaireX. It's automatically registered as the first global middleware.

## What It Logs

### Before (request start)

```
→ GET /users
```

### After (response complete)

```
← GET /users 12ms
```

It logs the HTTP method, URL path, and response duration in milliseconds.

## Auto-Registration

`ClaireLogger` is pushed into the global middleware chain in the `ClaireX` constructor. You don't need to register it manually — it's always there.

```ts
// This happens internally in the ClaireX constructor
this._middlewareChain.push(new ClaireLogger())
```

## Implementation

```ts
class ClaireLogger extends ClaireMiddleware {
  async before(ctx: ClaireContext): Promise<void> {
    // Logs method + URL at request start
  }

  async after(ctx: ClaireContext, response: Response): Promise<Response> {
    // Logs method + URL + duration at response end
    return response
  }
}
```

## Notes

- Always the first middleware to run (registered first in the chain)
- Does not short-circuit — always returns `void` from `before()`
- Output includes colored formatting in the terminal
