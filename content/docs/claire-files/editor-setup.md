# Editor Setup

`.claire` files run correctly with no editor configuration. But VS Code will underline every `.claire` import in red:

```
Cannot find module '../validators/user.validator.claire'
```

That error is cosmetic, Bun resolves the import fine at runtime. It happens because TypeScript's module resolver only recognises `.ts`, `.tsx`, `.mts`, and `.cts`. It has no idea `.claire` exists.

## Install the extension

```bash
code --install-extension packages/vscode-extension/clairex-vscode-0.1.0.vsix
```

Restart VS Code. That is the whole setup, the extension configures everything itself.

## What it does

**Resolves `.claire` imports.** The extension ships `@clairex/typescript-plugin`, a TypeScript Language Service Plugin that intercepts module resolution and resolves `.claire` paths as TypeScript. You get real types across `.claire` boundaries, not `any`, and with no generated declaration files.

**Gives `.claire` files full TypeScript support.** IntelliSense, hover types, go-to-definition, rename, quick fixes, formatting. `.claire` files behave exactly like `.ts` files.

**Adds a distinct file icon.** A wine-coloured TypeScript icon, so `.claire` files are visually distinguishable in the explorer. Requires [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme).

**Provides snippets.** Scaffolds for keys, validators, and middleware.

## How it works

The extension contributes three things and needs no JavaScript of its own:

```json
{
  "typescriptServerPlugins": [
    { "name": "@clairex/typescript-plugin", "enableForWorkspaceTypeScriptVersions": true }
  ],
  "configurationDefaults": {
    "files.associations": { "*.claire": "typescript" }
  }
}
```

The `files.associations` default is the important part: it hands `.claire` documents to VS Code's built-in TypeScript extension, which is what unlocks the language features. Since a `.claire` file *is* TypeScript, TypeScript should own it.

::alert{type="info"}
An earlier version registered `.claire` as its own language ID with a custom grammar. That gave syntax highlighting but nothing else, VS Code's TypeScript extension only serves documents whose language is `typescript`, so `.claire` files were excluded from every language feature. Handing them to TypeScript instead was the fix.
::

## Without the extension

Everything still works. You lose editor conveniences, not functionality:

| | With extension | Without |
|---|---|---|
| `bun dev` runs | Yes | Yes |
| Load-time rule enforcement | Yes | Yes |
| Syntax highlighting | Yes |  needs manual `files.associations` |
| `.claire` imports resolve | Yes |  red underlines |
| IntelliSense, hover, rename | Yes | NO |

If you would rather not install it, you can get partway there manually in `.vscode/settings.json`:

```json
{
  "files.associations": { "*.claire": "typescript" },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

That gives you highlighting and language features. Import resolution still needs the plugin.

## Other editors

The TypeScript plugin is not VS Code specific, any editor that runs `tsserver` can load it. Add it to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "@clairex/typescript-plugin" }]
  }
}
```

Two caveats: the plugin must be resolvable from `node_modules` (relative paths are rejected), and your editor must use the **workspace** TypeScript rather than a bundled copy.

## Known limitation

ClaireX rule violations do not appear as inline squiggles. They are reported at load time, in the terminal, when you run the app. Editor diagnostics are planned.

## Next

- [Rules](/docs/claire-files/rules)
- [.claire Overview](/docs/claire-files/overview)
