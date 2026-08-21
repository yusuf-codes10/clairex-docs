# ClaireKey: Five Roles

Most frameworks give you a router and let you assemble the rest — controllers, groups, modules, middleware scopes. ClaireX gives you one class that covers all of it.

## What it replaces

| Elsewhere you need | ClaireX uses |
|---|---|
| Controller | ClaireKey |
| Router group | ClaireKey (prefix) |
| Plugin | ClaireKey (self-contained, mountable) |
| Middleware scope | ClaireKey (owns its middleware) |
| Module | ClaireKey (self-registers) |

```ts
export class userKey extends ClaireKey {
  constructor() {
    super("/users", [new authGuard()]);   // prefix + scope + middleware
  }

  protected register(): void {            // module — self-registering
    this.routes("get", "/", this.getUsers);
    this.routes("post", "/", this.createUser, [new userValidator()]);
  }

  private getUsers(c: ClaireContext): Response {    // controller
    return c.response.json(users);
  }
}
```

```ts
app.unlock(new userKey());                // plugin — mounted in one call
```

## The five roles

**Controller.** Handlers are methods on the class. Related endpoints live together with the state they operate on.

**Router group.** The prefix passed to `super()` applies to every route. There is no separate grouping construct.

**Plugin.** A key is self-contained — it carries its routes, handlers, and middleware. `unlock()` mounts the whole thing. That is what a plugin system usually provides, so ClaireX has no `IPlugin` interface: it would duplicate ClaireKey for no gain.

**Middleware scope.** Middleware passed to `super()` applies to every route on the key — the middle layer between global and per-route.

**Module.** `register()` is called by the base constructor, so a key wires itself up. `new userKey()` produces a fully-formed unit.

## Why the app cannot define routes

`ClaireX` has three methods: `unlock()`, `use()`, `listen()`. There is no `app.get()`.

That is enforced by composition — `ClaireX` owns a `ClaireRouter` privately rather than extending one, so the HTTP helpers are not on its surface.

The reasoning: a framework that permits both inline routes and structured resources gets both. Codebases drift toward whichever is quicker in the moment, and quick usually means inline. Six months later the routes are split between two conventions.

Removing the choice removes the drift.

## Adding a resource

```ts
new ClaireX(3000)
  .unlock(new userKey())
  .unlock(new postKey())
  .unlock(new commentKey())
  .listen();
```

Three files and one line per resource. Nothing about adding a resource touches an existing one, because everything a resource needs is inside its key.

## Handler binding

Handlers are bound to the key when registered, so `this` refers to the instance:

```ts
export class userKey extends ClaireKey {
  private users: User[] = [];

  protected register(): void {
    this.routes("get", "/", this.getUsers);   // bound automatically
  }

  private getUsers(c: ClaireContext): Response {
    return c.response.json(this.users);       // `this` works
  }
}
```

No `.bind(this)` at the call site, no arrow-function wrapper.

## Limitations

**No nesting.** A key cannot mount another key. Nested prefixes are done with paths:

```ts
this.routes("get", "/:userId/posts", this.getUserPosts);
```

**One prefix per key.** A key covering two unrelated prefixes should be two keys.

## The name

Claire Redfield's signature ability in *Resident Evil* is lockpicking — she opens the way into new areas. A ClaireKey unlocks one resource of your API. `app.unlock(new userKey())` reads as what it does.

## Next

- [Defining Routes](/docs/guides/routes)
- [Architecture](/docs/concepts/architecture)
