# ClaireException

The framework's error class. Extends `Error`.

```ts
import { ClaireException } from "@clairex/core";

throw new ClaireException(404, "User not found!");

// or
return new ClaireException(404, "User not found!").toResponse();
```

## `constructor(statusCode, content, metadata?)`

| Parameter | Type | |
|---|---|---|
| `statusCode` | `number` | HTTP status for the response |
| `content` | `string` | message — sent to the client, and the `Error` message |
| `metadata` | `Record<string, string>` | optional extra detail |

```ts
throw new ClaireException(400, "Invalid input", { field: "email" });
```

## `toResponse()`

```ts
toResponse(): Response
```

Serialises to JSON and logs a styled box to the terminal.

```json
{ "exception": "User not found!" }
```

Status is the exception's `statusCode`; `Content-Type: application/json`.

## Getters

| | Type |
|---|---|
| `statusCode` | `number` |
| `content` | `string` |
| `metadata` | `Record<string, string> \| undefined` |

## Throw or return

```ts
// throw — unwinds to the framework's global catch
throw new ClaireException(404, "Not found");

// return — never leaves the handler
return new ClaireException(404, "Not found").toResponse();
```

Identical output. `throw` suits bailing out from deep in a call stack; `return` keeps the handler in control. `ClaireHandler` requires a `Response`, so forgetting `.toResponse()` on the return path is a compile error.

## Global handling

```ts
catch (e) {
  if (e instanceof ClaireException) return e.toResponse();
  return new ClaireException(500, "Internal Server Error").toResponse();
}
```

Known exceptions carry their status. Anything else becomes a generic 500 — no stack traces leak to clients.

## No subclasses

`NotFoundException` and friends were deliberately not added. Status codes are universal; class names add a layer to learn without adding information.

```ts
throw new ClaireException(404, "User not found!");
```

## Framework guards

The framework raises `ClaireException` itself when it detects misuse — a missing validator, a mismatched body accessor, a misplaced validator, a missing JWT middleware. Each message names the fix.

See [Handling Errors](/docs/guides/errors).

## Next

- [Handling Errors](/docs/guides/errors)
- [ClaireX](/docs/api/clairex)
