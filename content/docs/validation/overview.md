# Validation Overview

`ClaireValidator` is the built-in validation system in ClaireX. It's an abstract class that extends `ClaireMiddleware` — validation runs as a middleware in the `before()` lifecycle, automatically parsing and validating the request body before your handler executes.

## Philosophy

- **No external libraries** — No Zod, no Yup, no Joi. Validation is built into the framework.
- **Class-based** — Each validator is a class you extend and configure with a schema.
- **Middleware-powered** — Validators are middlewares, so they plug into the same pipeline at any level.
- **Type-safe retrieval** — After validation passes, access the body via `c.valid<T>()` with your type applied.

## How It Works

1. You define a validator class with a `rules()` method that returns a schema
2. Attach the validator as route-level middleware
3. On each request, `before()` parses the JSON body and checks it against your schema
4. If validation fails → short-circuits with a 400 error response
5. If validation passes → stores the body on the context for typed retrieval

## Quick Example

Define a validator:

```ts
import { ClaireValidator } from 'clairex-core/core/validator'
import type { ValidationSchema } from 'clairex-core/core/types'

export class UserValidator extends ClaireValidator {
  override rules(): ValidationSchema {
    return {
      id: { type: 'number', required: true, max: 200 },
      name: { type: 'string', required: true, min: 3 },
      age: { type: 'number', required: true }
    }
  }
}
```

Attach it to a route:

```ts
import { UserValidator } from '../validators/userValidator'

register(): void {
  this.routes('post', '/', this.create, [new UserValidator()])
}
```

Access validated data in the handler:

```ts
type User = { id: number; name: string; age: number }

private async create(c: ClaireContext): Promise<Response> {
  const body = c.valid<User>()
  // body is typed as User — validation already passed
  return c.response.json(body, 201)
}
```

## Validation Errors

When validation fails, the validator short-circuits with a structured error response:

```json
{
  "exception": "Validation failed!: name is required!"
}
```

The response status is always `400`. Error messages include the field name and the reason for failure.

## Class Hierarchy

```
ClaireValidator extends ClaireMiddleware
```

Because `ClaireValidator` extends `ClaireMiddleware`, it has access to `before()` and `after()`. The validation logic lives in `before()` — you only need to override `rules()`.

## File Naming Convention

Validators follow a clear naming pattern:

```
src/validators/
├── userValidator.ts
├── postValidator.ts
└── loginValidator.ts
```

## Next Steps

- [Rules & Schema](/docs/validation/rules) — All available rule options and how to define schemas
