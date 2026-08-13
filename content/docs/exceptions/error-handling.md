# Error Handling

ClaireX catches all errors thrown in handlers and middleware automatically. No uncaught exceptions crash the server.

## How It Works

The entire request lifecycle in `ClaireX` is wrapped in a try/catch:

```ts
try {
  // middleware → handler → middleware
} catch (e) {
  if (e instanceof ClaireException) {
    return e.toResponse()
  }
  // Unknown error → generic 500
  return new Response(JSON.stringify({ exception: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## ClaireException

If the thrown error is a `ClaireException`, its `toResponse()` method is called — returning a structured JSON response with the correct status code.

```ts
throw new ClaireException(400, 'Validation failed')
// → { "exception": "Validation failed" } with status 400
```

## Unknown Errors

Any error that is NOT a `ClaireException` results in a generic 500 response. The error is logged server-side but not exposed to the client.

```ts
throw new Error('something broke')
// → { "exception": "Internal Server Error" } with status 500
```

## 404 Not Found

If no route matches the incoming request, ClaireX automatically returns a 404:

```ts
// No matching route → 404 ClaireException
```

## Best Practices

- **Throw `ClaireException`** for expected errors (not found, validation, auth)
- **Let unknown errors bubble** — the catch block handles them safely
- **Use subclasses** for common patterns (`NotFoundException`, `ValidationException`)
- **Include metadata** when useful for debugging:

```ts
throw new ClaireException(422, 'Validation failed', {
  errors: [
    { field: 'email', message: 'Required' },
    { field: 'name', message: 'Too short' }
  ]
})
```
