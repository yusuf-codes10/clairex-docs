# Rules & Schema

Validation in ClaireX is defined through a schema — a `Record` where each key is a field name and each value is a `ValidationRule` describing the expected type and constraints.

## Types

```ts
type ValidationRule = {
  type: 'number' | 'string' | 'boolean'
  required?: boolean
  min?: number
  max?: number
}

type ValidationSchema = Record<string, ValidationRule>
```

## Defining a Schema

Override the `rules()` method in your validator to return a `ValidationSchema`:

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

## Rule Options

### `type` (required)

The expected JavaScript type of the field. Checked using `typeof`:

```ts
{ type: 'string' }   // typeof value === 'string'
{ type: 'number' }   // typeof value === 'number'
{ type: 'boolean' }  // typeof value === 'boolean'
```

**Error:** `"Validation failed! "name" must be of type "string""`

### `required`

When `true`, the field must be present and not `null` or `undefined`:

```ts
{ type: 'string', required: true }
```

**Error:** `"Validation failed!: name is required!"`

### `min`

Minimum constraint. Behavior depends on the type:

- **String** — minimum character length
- **Number** — minimum numeric value

```ts
{ type: 'string', min: 3 }   // name must be at least 3 characters
{ type: 'number', min: 18 }  // age must be at least 18
```

**Error (string):** `"Validation failed!: "name" must be at least 3 characters"`
**Error (number):** `"Validation failed!: "age" must be at least 18"`

### `max`

Maximum constraint. Behavior depends on the type:

- **String** — maximum character length
- **Number** — maximum numeric value

```ts
{ type: 'string', max: 50 }   // name must be at most 50 characters
{ type: 'number', max: 200 }  // id must be at most 200
```

**Error (string):** `"Validation failed!: "name" must be at most 50 characters"`
**Error (number):** `"Validation failed!: "id" must be at most 200"`

## Validation Order

For each field in the schema, checks run in this order:

1. **Required check** — Is the field present?
2. **Type check** — Does `typeof value` match the expected type?
3. **Min check** — Does the value meet the minimum constraint?
4. **Max check** — Does the value meet the maximum constraint?

Validation stops at the **first failure** — only one error is returned per request.

## Complete Example

```ts
import { ClaireValidator } from 'clairex-core/core/validator'
import type { ValidationSchema } from 'clairex-core/core/types'

export class ProductValidator extends ClaireValidator {
  override rules(): ValidationSchema {
    return {
      name: { type: 'string', required: true, min: 2, max: 100 },
      price: { type: 'number', required: true, min: 0 },
      quantity: { type: 'number', required: true, min: 0, max: 10000 },
      active: { type: 'boolean', required: true }
    }
  }
}
```

## Accessing Validated Data

After validation passes, the body is stored on the context. Retrieve it with `c.valid<T>()`:

```ts
type Product = {
  name: string
  price: number
  quantity: number
  active: boolean
}

private async create(c: ClaireContext): Promise<Response> {
  const product = c.valid<Product>()
  // product is typed — all fields guaranteed to exist and be the correct type
  return c.response.json(product, 201)
}
```

## Optional Fields

If a field is not `required` and is absent from the body, it passes validation — the checks for type, min, and max only run if the value is present:

```ts
{
  nickname: { type: 'string', min: 2, max: 20 }  // optional, but if present must be 2-20 chars
}
```

## Error Response Format

All validation errors return a `400` status with this structure:

```json
{
  "exception": "Validation failed!: <field> <reason>"
}
```

This uses `ClaireException` under the hood — the same error format as the rest of the framework.
