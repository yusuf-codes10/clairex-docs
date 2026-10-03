# Introduction

ClaireX is a Class-based, Explicitly typed Web Framework for [Bun](https://bun.sh/).

Everything is a class you instantiate, extend, and override. Everything is typed, nothing is infered. Validation is built into the Framework, no dependency.

```ts
new ClaireX(3000)
  .listen();
```

## 4 main principles

**Explicit types only.** No inference. You declare types the way you would in Java. This is a deliberate constraint: when the compiler never guesses, you never debug a guess.

**Built-in validation.** No Zod, no Yup, no Joi. ClaireValidator is part of the framework, and it is a class you extend like everything else.

**Object-oriented.** Routes, middleware, validators, exceptions — all classes. You instantiate them, and you override the parts you want to change.

**Bun-native.** Built directly on `Bun.serve.` Zero runtime dependencies.