# Types

Exported from `@clairex/core`.

```ts
import type {
  ClaireHandler,
  ValidationRule,
  ValidationSchema,
  RouterEntry,
} from "@clairex/core";
```

## `ClaireHandler`

```ts
type ClaireHandler = (c: ClaireContext) => Response | Promise<Response>;
```

The signature every route handler must satisfy. Both sync and async are permitted; returning anything other than a `Response` is a compile error.

```ts
private getUsers(c: ClaireContext): Response { ... }
private async createUser(c: ClaireContext): Promise<Response> { ... }
```

## `ValidationRule`

```ts
type ValidationRule = {
  type: "number" | "string" | "boolean";
  required?: boolean;
  min?: number;
  max?: number;
  immutable?: boolean;
};
```

| Field | |
|---|---|
| `type` | expected runtime type, checked with `typeof` |
| `required` | must be present and not `null`. Enforced on POST/PUT; ignored on PATCH |
| `min` | string length or numeric value, depending on `type` |
| `max` | string length or numeric value, depending on `type` |
| `immutable` | cannot be updated — sending it on PATCH returns 400 |

All optional fields default to absent, which reads as falsy. Write them only when you mean them.

```ts
{ type: "number", required: true, immutable: true }
{ type: "string", required: true, min: 3, max: 50 }
{ type: "string", min: 2 }                            // optional field
```

## `ValidationSchema`

```ts
type ValidationSchema = Record<string, ValidationRule>;
```

The shape returned by `rules()`. Maps field names to their rules.

```ts
override rules(): ValidationSchema {
  return {
    id:   { type: "number", required: true },
    name: { type: "string", required: true, min: 3 },
  };
}
```

::alert{type="info"}
Always annotate the return type. Without it TypeScript widens `"number"` to `string` and the object no longer satisfies `ValidationSchema`.
::

## `RouterEntry`

```ts
type RouterEntry = {
  method: string;
  pattern: string;
  handler: ClaireHandler;
  middlewares?: ClaireMiddleware[];        // key level
  routeMiddlewares?: ClaireMiddleware[];   // route level
};
```

Internal — one registered route in the router's flat array. Exported for completeness; application code does not construct these.

## TypeScript utility types

ClaireX relies on built-in utility types rather than generating its own:

```ts
c.patched<User>()          // returns Partial<User>
c.valid<Pick<User, "name" | "age">>()
```

`Partial<T>` is TypeScript's; `partial()` on `ClaireValidator` is its runtime counterpart. The names mirror each other deliberately.

## Next

- [ClaireValidator](/docs/api/claire-validator)
- [Why Explicit Types](/docs/concepts/explicit-types)
