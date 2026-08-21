# ClaireValidator

Abstract base class for body validation. Extends `ClaireMiddleware` — validation runs in `before()`.

```ts
import { ClaireValidator } from "@clairex/core";
import type { ValidationSchema } from "@clairex/core";

export class userValidator extends ClaireValidator {
  override rules(): ValidationSchema {
    return {
      id:   { type: "number", required: true, immutable: true },
      name: { type: "string", required: true, min: 3, max: 50 },
      age:  { type: "number", required: true, min: 18 },
    };
  }
}
```

## `rules()`

```ts
abstract rules(): ValidationSchema;
```

The only method you must implement. Returns the canonical schema for the resource — one schema serves every action.

::alert{type="info"}
Annotate the return type as `ValidationSchema` explicitly. Without it TypeScript widens the string literals and the object no longer matches.
::

## `partial(schema)`

```ts
protected partial(schema: ValidationSchema): ValidationSchema
```

Returns a copy of the schema with `required: false` on every rule. Fields marked `immutable` are removed entirely.

Applied automatically on PATCH requests. `protected` so a subclass can use it directly if needed.

The runtime counterpart to TypeScript's `Partial<T>`.

## `before(ctx)`

Inherited from `ClaireMiddleware` and implemented by `ClaireValidator`. You do not override it.

Per request:

1. Bodyless method (`GET`, `DELETE`, `HEAD`, `OPTIONS`)? → skip
2. Choose the schema — `partial(rules())` for PATCH, `rules()` otherwise
3. Parse the body
4. `immutable` field present on a PATCH? → 400
5. Per field: `required` → `type` → `min` → `max`
6. Collect passing fields — schema keys only
7. PATCH with no recognised fields? → 400
8. Store the result and the partial flag on the context

Stops at the first failure.

## Enforcement by method

| Method | Schema | `required` |
|---|---|---|
| POST | `rules()` | ✅ |
| PUT | `rules()` | ✅ |
| PATCH | `partial(rules())` | ❌ |
| GET / DELETE / HEAD / OPTIONS | — | skipped |

## Route-level only

```ts
// ✅
this.routes("post", "/", this.createUser, [new userValidator()]);

// ❌ throws at startup
super("/users", [new userValidator()]);
app.use(new userValidator());
```

A validator reads the request body, so it cannot be applied where the route — and therefore the expected shape — is unknown. Both `ClaireX.use()` and the `ClaireKey` constructor check for this and throw.

## Reading the result

```ts
const body = c.valid<User>();      // POST / PUT
const patch = c.patched<User>();   // PATCH → Partial<User>
```

## Guarantees

**Unknown fields are stripped.** The stored body is built from schema keys only, so unvalidated data never reaches the handler.

**Immutable fields are rejected, not ignored.** Sending one on PATCH returns 400.

## Errors

All failures are 400:

```json
{ "exception": "Validation failed!: \"name\" must be at least 3 characters" }
```

## Not supported

Nested objects, arrays, enums, custom refinements, and error accumulation.

## Next

- [Validating Input](/docs/guides/validation)
- [Types](/docs/api/types)
