# ClaireException

`ClaireException` extends the native `Error` class and provides structured error responses for your API.

## Structure

```ts
class ClaireException extends Error {
  public statusCode: number
  public content: string
  public metadata?: Record<string, unknown>
}
```

| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` | HTTP status code (400, 401, 404, 500, etc.) |
| `content` | `string` | Error message sent in the response body |
| `metadata` | `Record<string, unknown>` | Optional additional context |

## Creating an Exception

```ts
import { ClaireException } from 'clairex-core'

throw new ClaireException(404, 'User not found')
throw new ClaireException(400, 'Invalid email format', { field: 'email' })
```

## `toResponse()`

Converts the exception into a structured JSON `Response`:

```ts
const exception = new ClaireException(404, 'Not found')
const response = exception.toResponse()
// Response body: { "exception": "Not found" }
// Status: 404
```

## Throwing in Handlers

```ts
app.get('/users/:id', async (ctx) => {
  const user = await findUser(ctx.request.params.id)
  if (!user) {
    throw new ClaireException(404, 'User not found')
  }
  return ctx.response.json(user)
})
```

The framework catches the exception automatically and returns the structured response.

## Custom Subclasses

You can extend `ClaireException` for reusable typed errors:

```ts
class NotFoundException extends ClaireException {
  constructor(resource: string) {
    super(404, `${resource} not found`)
  }
}

class UnauthorizedException extends ClaireException {
  constructor() {
    super(401, 'Unauthorized')
  }
}
```
