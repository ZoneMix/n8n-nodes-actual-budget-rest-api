# Development Guide

How this node is put together, how to run it against a local API, and how a
release is cut.

## Architecture

Three layers, each with one job:

```
resources/*.ts     what the user sees   (n8n property descriptions)
        ↓ resource + operation + parameters
requests/*.ts      what gets sent       (pure builders, one per resource)
        ↓ { method, endpoint, body?, qs?, binary? }
ActualBudgetRestApi.node.ts             (credentials, HTTP, errors, output)
```

**`resources/`** holds only `INodeProperties` arrays: the operation list and the
fields each operation shows. They carry no `routing` blocks — a node that
implements `execute()` ignores declarative routing, so an endpoint written there
would be dead code that drifts from the real one.

**`requests/`** turns a resource, an operation and a parameter reader into one
`BuiltRequest`. Builders are pure functions:

```ts
export const buildTagRequest = (operation: string, get: ParamGetter): BuiltRequest => { … };
```

`ParamGetter` is the whole seam that makes this testable: it is
`<T>(name: string, fallback?: T) => T`, which `execute()` satisfies with
`getNodeParameter` bound to the current item, and a test satisfies with a plain
object. `requests/index.ts` maps every resource name to its builder and is the
only thing `execute()` calls.

`requests/helpers.ts` carries the shared shaping rules: `request()` assembles a
`BuiltRequest` and drops an empty body or query string, `omitBlank()` removes the
empty strings that n8n collections always submit, and the `parseJson*` helpers
turn JSON string parameters into values, raising `RequestBuildError` with the
parameter's own name when they cannot.

**The node file** resolves credentials once per execution, loops over the input
items, and for each one builds a request, sends it and pushes the result. Its
supporting modules:

| Module | Holds |
|---|---|
| `GenericFunctions.ts` | base-URL normalising and joining, OAuth2 base-URL recovery, error extraction, auth-failure classification, the request sender |
| `auth.ts` | the JWT login, kept out of any function that reads credentials |
| `tokenCache.ts` | the access-token cache and its expiry arithmetic |

Two details worth knowing before changing them:

- **The JWT flow is manual on purpose.** The API issues a token from a username
  and password, and this node caches it for the process. `apiRequest` therefore
  sets the `Authorization` header itself for JWT and only uses
  `httpRequestWithAuthentication` for OAuth2. Moving JWT to n8n's credential
  layer means `preAuthentication` on the credential class, which is a breaking
  credential change and belongs in a major release.
- **Errors are copied field by field.** n8n's HTTP errors hold the request and
  response objects, which cannot be serialised. `extractErrorDetails` pulls out
  the message, status code, status text and response body, and nothing else ever
  reaches `NodeApiError`.

## Adding an operation

1. Add the option and any fields in `resources/<Resource>.ts`, keeping the
   options alphabetical by display name — the linter enforces it.
2. Add the test case in `tests/requests/<resource>.test.ts` and watch it fail.
3. Add the `case` in `requests/<resource>.ts` and watch it pass.
4. Add the row to the README's operation table.

A new resource additionally needs an entry in `resources/resourceOptions.ts` and
in the `RESOURCE_BUILDERS` map, plus its two property arrays spread into the node
description. The dispatcher test asserts that map's key list, so a resource that
is wired into only one of the two places fails the suite.

## Running the checks

```bash
npm install
npm run lint     # n8n-node lint (eslint + the community-node rules)
npm test         # node --test through tsx, over tests/**/*.test.ts
npm run build    # n8n-node build (tsc to dist/)
```

Tests import `node:test` and `node:assert` through `tests/harness.mjs`. The lint
config applies `no-restricted-imports` to every `.ts` file and Node's built-in
test modules are not on its allowlist, so the `.mjs` re-export keeps the test
files themselves clean without weakening the rule.

`package.json` sets `n8n.strict`, which makes `n8n-node lint` refuse to run if
`eslint.config.mjs` differs from the CLI's own template. Do not edit that file.

## Testing against a running API

```bash
npm run build
npm link

# in your n8n installation
npm link n8n-nodes-actual-budget-rest-api
n8n start
```

Point a JWT credential at the API (`http://localhost:3000` for the wrapper's dev
compose file) with the `ADMIN_USER` and `ADMIN_PASSWORD` it was started with. The
credential test hits `/v2/health`, so it passes before any budget is loaded.

`npm run dev` runs the CLI's watch mode instead, which rebuilds and restarts n8n
on every change.

To undo the link:

```bash
npm unlink n8n-nodes-actual-budget-rest-api   # in the n8n installation
npm unlink                                     # here
```

## Releasing

Publishing is driven by GitHub Releases, not by a local `npm publish`.

1. Update `CHANGELOG.md` and the version in `package.json`.
2. Merge to `main`; CI must be green on Node 22 and 24.
3. Tag the commit and publish a GitHub Release for it.
4. `.github/workflows/publish.yml` runs lint, test and build on Node 24, then
   `npm publish --ignore-scripts` with the `NPM_TOKEN` secret.

Because the publish step ignores scripts, `prepublishOnly` does not run — the
workflow's own build step is what produces `dist/`, the only directory the
package ships.
