# Changelog

All notable changes to this node are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-09-10

Coverage of Actual Budget REST API **v2.3.0**: 65 operations across 17 resources,
up from 36 across 9. Requires the API wrapper at v2.3.0 or later.

### Added

- **Rule** — Get Many, Get For Payee, Create, Update, Delete.
- **Schedule** — Get Many, Create, Update (with Reset Next Date), Delete.
- **Tag** — Get Many, Create, Update, Delete.
- **Note** — Get, Update, for any account, category, payee or schedule. An empty
  note field sends `null`, which is how the API clears a note.
- **Preference** — Get.
- **Account Group** — Get Many, Create, Update, Delete.
- **System** — Get Server Version, Sync Now, Lookup ID by Name, Get Budget Files,
  Load Budget, Export Budget. The export arrives as n8n binary data, named from
  the response's `Content-Disposition` and falling back to `budget.zip`. Load
  Budget takes a budget ID from Get Budget Files; it and the export need an admin
  token.
- **Bank Sync** — Run, to pull transactions from an account's bank connection.
- **Budget: Batch Update** — up to 500 amount and carryover changes in one call.
- **Payee: Get Common** — the payees used most often.
- Account Create and Update take `account_group_id`.
- Transaction Create, Import and Update take `imported_payee`, `payee_name`,
  `reconciled`, `transfer_id`, `starting_balance_flag` and `subtransactions`;
  Import takes the `opts` object (default cleared, dry run, reimport deleted,
  payee name normalisation).
- Category and Category Group Get Many take a `hidden` filter, and Delete takes
  `transferCategoryId`.
- Query takes `orderBy`, `groupBy`, `calculate`, `limit`, `offset` and
  `options.splits`. Responses now carry `data` and `truncated`; `result` is a
  deprecated alias the API still returns.
- Test suite: 157 assertions over Node's own test runner, covering the request
  every operation builds plus the shared helpers.

### Changed

- Request construction moved out of `execute()` into pure builders under
  `nodes/ActualBudgetRestApi/requests/`, one per resource. `execute()` now reads
  the resource and operation, builds a request, sends it and pushes the result.
- Error extraction, base-URL handling and the JWT token cache moved into
  `GenericFunctions.ts`, `auth.ts` and `tokenCache.ts`. Token cache behaviour is
  unchanged, including both 60 second margins.
- Blank strings from transaction rows are no longer sent to the API. A row that
  left Date empty used to be rejected with a 400.
- `@n8n/node-cli` is pinned to 0.47.2; CI runs lint, test and build on Node 22
  and 24, and every GitHub action is pinned to a commit SHA.

### Fixed

- Account Get Balance now sends the Cutoff Date, and Close Account now sends the
  transfer account and category. Both were collected in the UI and dropped.
- Query Limit is sent at the top level of the query. It was nested under
  `options`, which the API rejects because that object is strict.
- Close Account sends the transfer category as `transferCategoryId`, the name the
  API expects. The inert routing block it replaced named the field `categoryId`,
  so following that description would have produced a request the API ignores.

### Removed

- The Transfer Account ID field on Payee Create and Update. The schemas the API
  enforces accept only `name`, so the value was stripped before it reached Actual.
  The published spec still lists `transfer_acct`; if the API is widened to match
  it, the field comes back.
- `routing` blocks in the resource descriptions. A node with an `execute()`
  method ignores them, so they were dead code that duplicated every endpoint.
- `PROJECT_SUMMARY.md`, which described a proof of concept the node outgrew.

## [1.0.0] - 2025-12-28

- Moved every endpoint to the `/v2` prefix for REST API wrapper v2.1.0.

## [0.2.1] - 2025-12-19

- Cached JWT access tokens to avoid the login rate limit, returned a proper
  error when an expired token produced a 400, and recovered the base URL from
  the OAuth2 endpoints when it was not set explicitly.

## [0.2.0] - 2025-12-19

- Added the Metrics resource and fixed the default credential values so the base
  URL is always set.

## [0.1.3] - 2025-12-17

- Fixed the npm publish workflow.

## [0.1.2] - 2025-12-17

- First published release: JWT and OAuth2 credentials with Account, Transaction,
  Category, Category Group, Payee, Budget and Health resources.
