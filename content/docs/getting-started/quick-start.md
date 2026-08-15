# Quick Start

Build a working ClaireX API in under a minute.

## Using Keys

For real applications, you'll organize routes into Keys. A Key is a self-contained unit that owns a prefix, handlers, and optional scoped middleware.

Create `src/keys/users.key.ts`:

```ts
import { ClaireKey } from 'clairex-core/core/key'
import { ClaireContext } from 'clairex-core/core/context'

const users = [
  { id: 1, name: 'Claire', age: 23 },
  { id: 2, name: 'John', age: 33 },
]

export class UserKey extends ClaireKey {
  constructor() {
    super('/users')
  }

  register(): void {
    this.routes('get', '/', this.getAll)
    this.routes('get', '/:id', this.getById)
  }

  private getAll(c: ClaireContext): Response {
    return c.response.json(users)
  }

  private getById(c: ClaireContext): Response {
    const { id } = c.request.params
    const user = users.find(u => u.id === Number(id))
    if (!user) throw new ClaireException(404, 'User not found')
    return c.response.json(user)
  }
}
```

Create `src/index.ts`:

```ts
import { ClaireX } from 'clairex-core'
import { UserKey } from './keys/users.key'

new ClaireX(3000)
  .unlock(new UserKey())
  .listen()
```

That's it — method chaining makes the setup clean and readable.

## What Just Happened?

1. `new ClaireX(3000)` — Creates the app on port 3000
2. `.unlock(new UserKey())` — Registers all routes from the UserKey (prefixed with `/users`)
3. `.listen()` — Starts the Bun server

ClaireX automatically includes a `ClaireLogger` middleware that logs every request with method, URL, and duration.

## Next Steps

- [ClaireX](/docs/core/clairex) — Understand the application class
- [Keys](/docs/keys/overview) — Deep dive into organizing routes with Keys
- [Middleware](/docs/middleware/overview) — Add global and scoped middleware
