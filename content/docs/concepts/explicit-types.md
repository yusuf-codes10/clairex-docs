# Why Explicit Types

ClaireX asks you to declare types the way you would in Java. No inference, no derivation, no generics doing the work behind the scenes.

That is a constraint, and it is the point.

## The problem it addresses

Type inference is excellent until it is wrong. When a library infers a type through a chain of conditional generics and produces something unexpected, the error message describes the *result* rather than the *cause*:

```
Type 'ZodObject<{ name: ZodString; age: ZodNumber }, "strip", ZodTypeAny,
  { name: string; age: number }, { name: string; age: number }>'
  is not assignable to ...
```

The type is correct. The message is technically accurate. And you now spend twenty minutes reading generic soup to find out which link broke.

ClaireX's position: if the compiler never guesses, you never debug a guess.

## What it looks like

You declare the type:

```ts
export type User = {
  id: number;
  name: string;
  age: number;
};
```

You declare the runtime rules:

```ts
export class userValidator extends ClaireValidator {
  override rules(): ValidationSchema {
    return {
      id:   { type: "number", required: true },
      name: { type: "string", required: true, min: 3 },
      age:  { type: "number", required: true, min: 18 },
    };
  }
}
```

You state which type you are reading:

```ts
const body = c.valid<User>();
```

Three declarations. Nothing inferred.

## "Isn't that duplication?"

It is two declarations of related things — but they serve different purposes and exist at different times.

| | `type User` | `rules()` |
|---|---|---|
| Exists at | compile time | run time |
| Checked by | TypeScript | ClaireX |
| Erased after build | ✅ | ❌ |
| Catches | wrong property names, wrong assignments | malformed requests |

Deriving one from the other means inference, and inference is the thing being avoided.

The trade is explicit: slightly more typing, in exchange for error messages that name the actual problem.

## Where it pays off

The clearest example is PATCH.

Because `patched<T>()` returns `Partial<T>` rather than `T`, TypeScript knows every field may be absent, and refuses an unguarded assignment:

```ts
const patch = c.patched<User>();
found.name = patch.name;
// ❌ Type 'string | undefined' is not assignable to type 'string'
```

That message is immediately actionable. It names the type, names the problem, and points at the line. Contrast that with a framework that infers the body type from a schema and hands you something that *looks* right until a field goes missing in production.

See [Partial Updates](/docs/guides/partial-updates).

## The framework holds itself to it

Every method, getter, and function in ClaireX declares its return type:

```ts
get params(): Record<string, string> { ... }
get queries(): Record<string, string[]> { ... }
async json(): Promise<unknown> { ... }
json(data: unknown, status: number = 200): Response { ... }
```

A framework that asks for explicit typing while relying on inference internally would not be worth taking seriously.

The `.claire` extension makes it enforceable in your code too — Rule 2 rejects any method with an access modifier that omits its return type. See [.claire Rules](/docs/claire-files/rules).

## `unknown`, not `any`

Raw request bodies are typed `unknown`:

```ts
const data = await c.request.json();   // Promise<unknown>
```

Not `any`. `any` would let you dot into it and pretend you knew the shape. `unknown` forces you to prove it — which is what a validator does.

The only `as` cast in the framework is inside `valid<T>()`, immediately after the validator has proven the shape at runtime. That is an assertion backed by a check, not a guess.

## When this is the wrong choice

If you prefer inference doing the work, want maximum flexibility, or like functional composition over classes, ClaireX will feel restrictive. Those are legitimate preferences.

ClaireX is for people who would rather write the type than discover it.

## Next

- [Validating Input](/docs/guides/validation)
- [Partial Updates](/docs/guides/partial-updates)
