# n8n-nodes-actual-budget-rest-api

This is an n8n community node. It lets you use Actual Budget in your n8n workflows.

[Actual Budget](https://actualbudget.org/) is a local-first personal finance tool. This node integrates with the [Actual Budget REST API wrapper](https://github.com/zonemix/actual-budget-rest-api) to automate budget management, transaction tracking, and financial workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

For local development, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Operations

65 operations across 17 resources.

### Account

| Operation | Request |
|---|---|
| Get Many | `GET /v2/accounts` |
| Create | `POST /v2/accounts` |
| Update | `PUT /v2/accounts/{id}` |
| Delete | `DELETE /v2/accounts/{id}` |
| Close | `POST /v2/accounts/{id}/close` |
| Reopen | `POST /v2/accounts/{id}/reopen` |
| Get Balance | `GET /v2/accounts/{id}/balance?cutoff=` |

Create and Update take `offbudget`, `closed` and `account_group_id`. Close takes an
optional transfer account and category for the remaining balance.

### Account Group

| Operation | Request |
|---|---|
| Get Many | `GET /v2/account-groups` |
| Create | `POST /v2/account-groups` |
| Update | `PUT /v2/account-groups/{id}` |
| Delete | `DELETE /v2/account-groups/{id}` |

### Bank Sync

| Operation | Request |
|---|---|
| Run | `POST /v2/accounts/{id}/bank-sync` |

### Transaction

| Operation | Request |
|---|---|
| Get Many | `GET /v2/accounts/{id}/transactions?start=&end=` |
| Create | `POST /v2/accounts/{id}/transactions` |
| Import | `POST /v2/accounts/{id}/transactions/import` |
| Update | `PUT /v2/transactions/{id}` |
| Delete | `DELETE /v2/transactions/{id}` |

Each transaction row takes amount, date, payee, category, notes, imported ID and
cleared directly, and `imported_payee`, `payee_name`, `reconciled`, `transfer_id`,
`starting_balance_flag` and `subtransactions` under Additional Fields. Import adds
the `opts` object: default cleared, dry run, reimport deleted and payee name
normalisation.

Update accepts the same widened set, so adding Subtransactions to an existing
transaction is how you split one after the fact.

### Category

| Operation | Request |
|---|---|
| Get Many | `GET /v2/categories?hidden=` |
| Create | `POST /v2/categories` |
| Update | `PUT /v2/categories/{id}` |
| Delete | `DELETE /v2/categories/{id}?transferCategoryId=` |

### Category Group

| Operation | Request |
|---|---|
| Get Many | `GET /v2/category-groups?hidden=` |
| Create | `POST /v2/category-groups` |
| Update | `PUT /v2/category-groups/{id}` |
| Delete | `DELETE /v2/category-groups/{id}?transferCategoryId=` |

### Payee

| Operation | Request |
|---|---|
| Get Many | `GET /v2/payees` |
| Get Common | `GET /v2/payees/common` |
| Create | `POST /v2/payees` |
| Update | `PUT /v2/payees/{id}` |
| Delete | `DELETE /v2/payees/{id}` |
| Merge | `POST /v2/payees/merge` |

### Budget

| Operation | Request |
|---|---|
| Get Months | `GET /v2/budgets/months` |
| Get Month | `GET /v2/budgets/{month}` |
| Set Category Budget | `POST /v2/budgets/{month}/categories/{categoryId}/budget` |
| Set Category Carryover | `POST /v2/budgets/{month}/categories/{categoryId}/carryover` |
| Hold Budget | `POST /v2/budgets/{month}/hold` |
| Reset Hold | `POST /v2/budgets/{month}/reset-hold` |
| Batch Update | `POST /v2/budgets/batch` |

Batch Update takes a JSON array of up to 500 entries, each
`{"type":"setAmount","month":"2026-01","categoryId":"…","amount":1000}` or
`{"type":"setCarryover","month":"2026-01","categoryId":"…","flag":true}`.

### Rule

| Operation | Request |
|---|---|
| Get Many | `GET /v2/rules` |
| Get For Payee | `GET /v2/rules/payees/{payeeId}` |
| Create | `POST /v2/rules` |
| Update | `PUT /v2/rules/{id}` |
| Delete | `DELETE /v2/rules/{id}` |

Conditions and actions are JSON arrays. The valid fields and operators come from
Actual's own rule engine and are rejected by the API if they are not.

### Schedule

| Operation | Request |
|---|---|
| Get Many | `GET /v2/schedules` |
| Create | `POST /v2/schedules` |
| Update | `PUT /v2/schedules/{id}?resetNextDate=` |
| Delete | `DELETE /v2/schedules/{id}` |

Reset Next Date is only sent when it is on; leaving it off keeps the engine's own
behaviour.

Two fields have a JSON alternative, because the API accepts a union that an n8n
field cannot express. Amount Range replaces Amount for the Between operator, as
`{"num1":-105000,"num2":-95000}`. Date Recurrence replaces the single date, as
`{"start":"2026-02-01","frequency":"monthly"}` plus any of `interval`,
`skipWeekend`, `weekendSolveMode`, `endMode`, `endOccurrences` and `endDate`.
Whichever JSON field is set wins over its plain counterpart.

### Tag

| Operation | Request |
|---|---|
| Get Many | `GET /v2/tags` |
| Create | `POST /v2/tags` |
| Update | `PUT /v2/tags/{id}` |
| Delete | `DELETE /v2/tags/{id}` |

### Note

| Operation | Request |
|---|---|
| Get | `GET /v2/notes/{id}` |
| Update | `PUT /v2/notes/{id}` |

The ID is the account, category, payee or schedule the note belongs to. Leaving
the note empty sends `null`, which is how the API clears one. Reading the note of
an entity that has none returns `null` rather than a 404.

### Preference

| Operation | Request |
|---|---|
| Get | `GET /v2/preferences` |

### Query

| Operation | Request |
|---|---|
| Execute | `POST /v2/query` |

ActualQL against a whitelist of read-only tables, with `filter`, `select` or
`calculate`, `groupBy`, `orderBy`, `limit`, `offset` and `options.splits`. The
response carries `data` and `truncated`; `result` is a deprecated alias.

Calculate takes an aggregate object such as `{"$sum":"amount"}` or a bare field
name such as `amount`. Setting it replaces the field selection, because the API
rejects the two together.

### System

| Operation | Request |
|---|---|
| Get Server Version | `GET /v2/server/version` |
| Sync Now | `POST /v2/sync` |
| Lookup ID by Name | `GET /v2/lookup/{type}/{name}` |
| Get Budget Files | `GET /v2/budget/files` |
| Load Budget | `POST /v2/budget/load` |
| Export Budget | `POST /v2/budget/export` |

Export Budget returns the budget as n8n binary data on the `data` property, named
from the response's `Content-Disposition` (`actual-budget-YYYY-MM-DD.zip`), falling
back to `budget.zip`. Load Budget takes an `id` from Get Budget Files, not a sync
ID; both it and Export Budget require an admin token, and Load Budget swaps the
open budget for the whole API process. Lookup types are `accounts`, `categories`,
`payees` and `schedules`, and an unknown name is a 404.

### Health

| Operation | Request |
|---|---|
| Check | `GET /v2/health` |

### Metric

| Operation | Request |
|---|---|
| Get Full | `GET /v2/metrics` |
| Get Summary | `GET /v2/metrics/summary` |
| Reset | `POST /v2/metrics/reset` |

## Credentials

### JWT (recommended)

1. Set up the [Actual Budget REST API wrapper](https://github.com/zonemix/actual-budget-rest-api) and make sure it is reachable from n8n.
2. In n8n, create credentials of type **Actual Budget REST API JWT**.
3. Fill in:
   - **Base URL**: your API endpoint without `/v2`, for example `http://localhost:3000` or `https://actual-api.example.com`
   - **Username** and **Password**: the API's `ADMIN_USER` and `ADMIN_PASSWORD`
4. Use the credential test, which calls `/v2/health`.

The node exchanges the username and password for an access token on first use and
caches it until shortly before it expires, so repeated executions do not hit the
API's login rate limit. A 401 clears the cached token so the next execution logs
in again.

### OAuth2

For deployments that issue OAuth2 clients, use the **Actual Budget REST API OAuth2 API**
credential and configure the client in the API wrapper first.

Tokens carry a scope of `read`, `write` or `admin`. The legacy `api` scope means
read and write together and remains the default, so existing credentials keep
working. Set **Scope** to `read` for a workflow that only queries, and to `admin`
for one that resets metrics. Several scopes are space-separated, e.g. `read write`.

## Compatibility

- Minimum n8n version: **1.0.0**
- Requires the Actual Budget REST API wrapper at **v2.3.0** or later. Earlier
  wrappers do not serve the rule, schedule, tag, note, preference, account group,
  system or bank sync endpoints, and reject the widened transaction and query
  fields.

## Usage

### Amounts

Every amount in Actual Budget is an integer number of cents:

| Amount | Value |
|---|---|
| $100.00 | `10000` |
| -$45.99 | `-4599` |
| $1,234.56 | `123456` |

### Dates

Transaction and schedule dates use `YYYY-MM-DD`. Budget months use `YYYY-MM`.

### Example: import bank transactions

1. Fetch the statement with an **HTTP Request** node and parse it in a **Code** node.
2. Add this node, choose **Transaction → Import** and give it the Account ID.
3. Map each row's `imported_id` so re-running the workflow deduplicates instead of
   creating copies, and set **Dry Run** while you are still testing the mapping.

### Example: categorise with a rule

1. **Rule → Create**.
2. Conditions: `[{"field":"imported_payee","op":"contains","value":"KROGER"}]`
3. Actions: `[{"op":"set","field":"category","value":"<category id>"}]`
4. Use **System → Lookup ID by Name** beforehand if you have the category name
   rather than its ID.

### Errors

Failures surface as n8n node errors carrying the API's status code and its error
body, including the `requestId` for tracing. Turning on **Continue On Fail** puts
that same envelope in the item's JSON instead of stopping the workflow.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Actual Budget](https://actualbudget.org/)
- [Actual Budget REST API wrapper](https://github.com/zonemix/actual-budget-rest-api)
- [Actual Budget REST API OpenAPI documentation](https://github.com/zonemix/actual-budget-rest-api/blob/main/src/docs/openapi.yml)
- [ActualQL query syntax](https://actualbudget.org/docs/api/actual-ql/)
- [DEVELOPMENT.md](DEVELOPMENT.md) for the node's architecture and release flow
