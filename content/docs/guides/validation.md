# Validating Input

ClaireX validates request bodies without Zod, Yup, or Joi. Validation is a class you extend.

## One validator per resource

Most schema libraries push you toward one schema per action, a create schema, an update schema, a replace schema. For a ten-resource API that is roughly thirty schemas.

ClaireX takes a different position: **PATCH is a partial of POST.** That is REST semantics, not a framework convention. The *shape* does not change between actions, only whether fields are required.

So you write one validator per resource, and the framework adjusts enforcement based on the HTTP method.

```ts
// src/validators/user.validator.claire
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

Attach the same class to every route on the resource:

```ts
protected register(): void {
  this.routes("post",  "/",    this.createUser, [new userValidator()]);
  this.routes("patch", "/:id", this.updateUser, [new userValidator()]);
}
```

## Enforcement per method

| Method | Schema | `required` enforced | Notes |
|---|---|---|---|
| `POST` | full | yes | creating, everything needed |
| `PUT` | full | yes | full replacement |
| `PATCH` | partial | no | type, `min`, `max` still checked on present fields |
| `GET` `DELETE` `HEAD` `OPTIONS` | — | — | skipped, no body to validate |

## Reading the validated body

Which accessor you use depends on the method:

```ts
// POST / PUT — every field guaranteed
const body = c.valid<User>();

// PATCH — fields optional
const patch = c.patched<User>();   // returns Partial<User>
```

Using the wrong one throws immediately with a message naming the correct one. See [Partial Updates](/docs/guides/partial-updates) for why they are separate.

## Rule options

```ts
type ValidationRule = {
  type: "string" | "number" | "boolean";
  required?: boolean;
  min?: number;
  max?: number;
  immutable?: boolean;
};
```

**`type`**: checked with `typeof`.

**`required`**: the field must be present and not `null`. Enforced on POST and PUT; ignored on PATCH.

**`min` / `max`**: string length or numeric value, depending on `type`. Always enforced when the field is present, on every method.

**`immutable`**: the field can be set on create but never updated. Sending it on a PATCH returns 400.

```ts
{
  id:       { type: "number", required: true, immutable: true },
  name:     { type: "string", required: true, min: 3, max: 50 },
  age:      { type: "number", required: true, min: 18 },
  nickname: { type: "string", min: 2 },                          // optional
}
```

## Order of checks

Per request:

1. Is this a bodyless method? → skip validation entirely
2. Was an `immutable` field sent on a PATCH? → 400
3. Per field: `required` → `type` → `min` → `max`
4. Did a PATCH arrive with no recognised fields? → 400

Validation stops at the first failure. One error per response.

## Two things that happen automatically

**Unknown fields are stripped.** The validated body is built from schema keys only, so extra fields never reach your handler:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"id":3,"name":"Ada","age":36,"isAdmin":true}'
```

`isAdmin` is discarded. It was never validated, so it is not allowed to arrive wearing a validated type.

**Empty PATCH bodies are rejected.** A PATCH with nothing recognisable returns 400 rather than silently doing nothing:

```json
{ "exception": "Validation failed!: at least one field is required" }
```

## Error format

Every failure is a 400 with the same shape:

```json
{ "exception": "Validation failed!: \"name\" must be at least 3 characters" }
```

Examples:

| Body | Response |
|---|---|
| `{"name":"Ada"}` on POST | `id is required!` |
| `{"id":"3",...}` | `"id" must be of type "number"` |
| `{"name":"ab",...}` | `"name" must be at least 3 characters` |
| `{"age":12,...}` | `"age" must be at least 18` |
| `{"id":99}` on PATCH | `"id" cannot be updated` |
| `{}` on PATCH | `at least one field is required` |

## Validators are route-level only

```ts
//  correct
this.routes("post", "/", this.createUser, [new userValidator()]);

// throws at startup
super("/users", [new userValidator()]);

// throws at startup
app.use(new userValidator());
```

The framework refuses to start if a validator is attached globally or at key level, because a validator reads the request body, and a key-level validator cannot know which route is being hit or what shape that route expects. It would also break GET routes, which have no body.

## Types and schemas are separate

ClaireX does not derive types from schemas:

```ts
// the compile-time shape
export type User = { id: number; name: string; age: number };

// the runtime shape
export class userValidator extends ClaireValidator {
  override rules(): ValidationSchema { ... }
}
```

Two declarations, deliberately. TypeScript types vanish at runtime; validation rules only exist at runtime. Generating one from the other means inference, and no inference is the point.

## Not yet supported

- Nested objects
- Arrays
- Enums / literal unions
- Custom refinements (regex, functions)
- Error accumulation (fails on the first error)

## Next

- [Partial Updates](/docs/guides/partial-updates)
- [ClaireValidator reference](/docs/api/claire-validator)
