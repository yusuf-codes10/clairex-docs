# ClaireLogger

`ClaireLogger` is the built-in request logger that ships with ClaireX. It is automatically registered as the first global middleware on every app — you don't need to add it yourself.

## What It Logs

For every request, ClaireLogger outputs:

- **Before the handler** — The HTTP method and full URL (color-coded by method)
- **After the handler** — The HTTP method, URL, and response duration in milliseconds

```
→ GET http://localhost:3000/users
← GET http://localhost:3000/users 1.24ms
```

## Color Coding

HTTP methods are color-coded in the terminal:

| Method | Color |
|--------|-------|
| GET | Green |
| POST | Blue |
| PUT | Yellow |
| PATCH | Purple |
| DELETE | Red |

## Implementation

`ClaireLogger` extends `ClaireMiddleware` and uses both lifecycle hooks:

```ts
class ClaireLogger extends ClaireMiddleware {
  private start: number = 0

  override before(c: ClaireContext): void {
    this.start = performance.now()
    console.log(`→ ${colorMethod(c.request.method)} ${c.request.url}`)
  }

  override after(c: ClaireContext, response: Response): Response {
    const duration = (performance.now() - this.start).toFixed(2)
    console.log(`← ${colorMethod(c.request.method)} ${c.request.url} ${duration}ms`)
    return response
  }
}
```

## Automatic Registration

ClaireLogger is added in the `ClaireX` constructor — it's always the first middleware in the chain:

```ts
constructor(port?: number) {
  this.port = port ?? 3000
  this._middlewareChain.push(new ClaireLogger())
}
```

Any middleware you add via `app.use()` runs **after** ClaireLogger.

## Disabling the Logger

ClaireLogger is built into the framework. Since it's the first entry in the middleware chain, it always logs before and after every request. There is currently no toggle to disable it — it's designed to always give you visibility into what your server is doing.

## Using It as a Pattern

ClaireLogger demonstrates a key middleware pattern — using `before()` to capture a start time, and `after()` to measure duration. You can use the same approach for custom performance monitoring:

```ts
class PerformanceMonitor extends ClaireMiddleware {
  private start: number = 0

  override before(c: ClaireContext): void {
    this.start = performance.now()
  }

  override after(c: ClaireContext, response: Response): Response {
    const duration = performance.now() - this.start
    if (duration > 1000) {
      console.warn(`Slow request: ${c.request.pathname} took ${duration.toFixed(0)}ms`)
    }
    return response
  }
}
```
