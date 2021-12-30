# H5P type definitions and schemas

These files help you by providing code completion in VS Code or other IDEs.

## Types

`npm install --save-dev @h5p-types/h5p-core` will give you code completion if
you add `@h5p-types` to your type roots in TypeScript (`tsconfig.json`):

```json
{ "typeRoots": ["node_modules/@types", "node_modules/@h5p-types"] }
```

## JSON Schemas

Add this to settings.json in VS Code to get code completion when editing
`library.json` and `semantics.json` (semantic code completion is not very
context sensitive and offers more options than are allowed, but it's a start):

```json
{
  "json.schemas": [
    {
      "fileMatch": ["/semantics.json"],
      "url": "https://raw.githubusercontent.com/sr258/h5p-types/main/schemas/semantics-schema.json"
    },
    {
      "fileMatch": ["/library.json"],
      "url": "https://raw.githubusercontent.com/sr258/h5p-types/main/schemas/library-schema.json"
    }
  ]
}
```
