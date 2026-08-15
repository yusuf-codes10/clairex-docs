# ClaireException

`ClaireException` is the base exception class in ClaireX. It provides structured error responses with a status code, message, and optional metadata. You can throw it to bubble to the global catch, or call `.toResponse()` to return inline.

## Class Signature

```ts
class ClaireException extends Error {
  constructor(statusCode: number, content: string, metadata?: Record<string, string>)

  get statusCode(): number
  get content(): string
  get metadata(): Record<string, string> | undefined

  toResponse(): Response
}
```

## Creating an Exception

```ts
import { ClaireException } from 'clairex-core/core/exception'

// Basic exception
new ClaireException(404, 'User not found')

// With metadata
new ClaireException(400, 'Invalid input', { field: 'email', hint: 'Must be a valid email' })
```

## Two Ways to Use

### 1. Throw — Bubbles to Global Catch

```ts
private getById(c: ClaireContext): Response {
  const user = users.find(u => u.id === Number(c.request.params.id))
  if (!user) throw new ClaireException(404, 'User not found')
  return c.response.json(user)
}
```

When thrown, the exception bubbles up to ClaireX's global try/catch in the fetch handler, which calls `e.toResponse()` and returns the structured error to the client.

### 2. Return Inline — Handler Stays in Control

```ts
private async create(c: ClaireContext): Promise<Response> {
  const body = c.valid<User>()
  if (users.find(u => u.id === body.id)) {
    return new ClaireException(400, 'User id already exists!').toResponse()
  }
  users.push(body)
  return c.response.json(users, 201)
}
```

Calling `.toResponse()` converts the exception into a `Response` immediately without throwing. The handler remains in control of the flow.

## Response Format

`.toResponse()` returns a JSON response with this structure:

```json
{
  "exception": "User not found"
}
```

- Status code is set from the `statusCode` argument
- Content-Type is `application/json`
- The `content` string is placed in the `exception` field

## Console Logging

When `.toResponse()` is called, ClaireX also logs the exception to the console in a styled format:

```
   ╔══════════════════════════════════════════════════════════════╗
   ║  ClaireException [404]                                      ║
   ╠══════════════════════════════════════════════════════════════╣
   ║  User not found                                             ║
   ╚══════════════════════════════════════════════════════════════╝
```

This gives you visibility into errors during development without needing to check network responses.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `statusCode` | `number` | The HTTP status code (getter, backing field pattern) |
| `content` | `string` | The error message |
| `metadata` | `Record<string, string> \| undefined` | Optional key-value metadata |

## Extending ClaireException

You can create custom exception subclasses for common error types:

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

Usage:

```ts
throw new NotFoundException('User')
throw new UnauthorizedException()
```

## Inheritance

```
ClaireException extends Error
```

Because it extends `Error`, you get standard error properties (`message`, `name`, `stack`) in addition to the ClaireX-specific ones.
