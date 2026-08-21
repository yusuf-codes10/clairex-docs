# Partial Updates

PATCH is where most APIs quietly lose data. This page explains the bug, and how ClaireX makes it impossible to write.

## The bug

Here is a handler that looks completely reasonable:

```ts
private updateUser(c: ClaireContext): Response {
  const { name } = c.valid<User>();

  const found = users.find((u) => u.id === Number(c.request.params.id));
  if (!found) return new ClaireException(404, "Not found").toResponse();

  found.name = name;
  return c.response.json(found);
}
```

It compiles. It passes review. And this request destroys data:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":24}'
```

The client sent only `age`. So `name` is `undefined`, and `found.name = undefined` **erases the stored name**. No exception. No warning. Nothing in the logs.

## Why it happened

`c.valid<User>()` claimed to return a `User` — an object where `name` is a `string`. At runtime it returned an object with no `name` at all.

That is a **type lie**, and the framework cannot catch it by inspecting the generic, because *you* supply the generic. Nothing stopped you writing `<User>` on a route that only ever receives partial bodies.

## The fix: two accessors

ClaireX gives you two ways to read a validated body, and controls the return type of each:

```ts
valid<T>(): T              // POST / PUT — every field guaranteed
patched<T>(): Partial<T>   // PATCH      — every field optional
```

The asymmetry is the whole mechanism. You pass `User`; `patched()` hands back `Partial<User>`. You cannot widen it.

So the unsafe assignment now fails to compile:

```ts
const patch = c.patched<User>();
found.name = patch.name;
// ❌ Type 'string | undefined' is not assignable to type 'string'
```

That error is the framework doing its job. The bug is caught while you type, not after it has eaten production data.

## Writing it correctly

```ts
private updateUser(c: ClaireContext): Response {
  const { id } = c.request.params;
  const patch: Partial<User> = c.patched<User>();

  const found: User | undefined = users.find((u) => u.id === Number(id));
  if (!found) return new ClaireException(404, "User not found!").toResponse();

  if (patch.name !== undefined) found.name = patch.name;
  if (patch.age !== undefined) found.age = patch.age;

  return c.response.json(found);
}
```

Check each field, then apply it. Fields the client did not send are left alone.

::alert{type="warning"}
**Do not destructure up front.**

```ts
const { name } = c.patched<User>();   // discards "was it sent?"
```

Once destructured, `name` is just `string | undefined` with no way to distinguish *"sent as undefined"* from *"not sent"*. Keep the object and check properties on it.
::

## The runtime guard

The type system covers the code you write. A runtime guard covers the pairing.

`ClaireValidator` records whether the body it stored was partial. Each accessor checks that flag:

```ts
// on a PATCH route
c.valid<User>();
// → 500 "This route received a partial body (PATCH). Use c.patched<T>() instead."

// on a POST route
c.patched<User>();
// → 500 "This route received a full body. Use c.valid<T>() instead."
```

Both messages name the fix. You cannot mismatch them silently.

## Reference

| | `valid<T>()` | `patched<T>()` |
|---|---|---|
| Returns | `T` | `Partial<T>` |
| Methods | POST, PUT | PATCH |
| Fields | all guaranteed present | may be absent |
| Handler must | use directly | check `!== undefined` |
| Guards against | missing validator | silent field erasure |

## Protecting fields entirely

Some fields should never be updated. Mark them `immutable`:

```ts
override rules(): ValidationSchema {
  return {
    id:   { type: "number", required: true, immutable: true },
    name: { type: "string", required: true, min: 3 },
    age:  { type: "number", required: true, min: 18 },
  };
}
```

`id` is required when creating a user, and rejected when updating one:

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"id":99}'

# {"exception":"Validation failed!: \"id\" cannot be updated"}
```

The request is **rejected**, not silently ignored — the client is told they did something wrong. And because immutable fields are stripped from the partial schema, `patch.id` does not exist for a handler to assign even by accident.

## What PATCH still validates

Optional does not mean unchecked. Type, `min`, and `max` apply to every field that is present:

```bash
# name too short — still rejected on PATCH
curl -X PATCH http://localhost:3000/users/1 -d '{"name":"ab"}'
# {"exception":"Validation failed!: \"name\" must be at least 3 characters"}

# wrong type — still rejected
curl -X PATCH http://localhost:3000/users/1 -d '{"age":"twenty"}'
# {"exception":"Validation failed! \"age\" must be of type \"number\""}

# nothing recognisable — rejected
curl -X PATCH http://localhost:3000/users/1 -d '{}'
# {"exception":"Validation failed!: at least one field is required"}
```

Only `required` is relaxed.

## Next

- [Validating Input](/docs/guides/validation)
- [ClaireContext reference](/docs/api/claire-context)
