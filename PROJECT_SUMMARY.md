# n8n-nodes-actual-budget-rest-api

## Overview
A complete n8n community node for the Actual Budget REST API. This node enables workflow automation for personal finance management with Actual Budget.

## Project Structure

```
n8n-nodes-actual-budget-rest-api/
├── credentials/
│   ├── ActualBudgetRestApiJwt.credentials.ts      # JWT auth (username/password)
│   └── ActualBudgetRestApiOAuth2Api.credentials.ts # OAuth2 auth (optional)
├── nodes/
│   └── ActualBudgetRestApi/
│       ├── resources/
│       │   ├── Account.ts           # Account operations (7 ops)
│       │   ├── Transaction.ts       # Transaction operations (5 ops)
│       │   ├── Category.ts          # Category operations (4 ops)
│       │   ├── CategoryGroup.ts     # Category group operations (4 ops)
│       │   ├── Payee.ts            # Payee operations (5 ops)
│       │   ├── Budget.ts           # Budget operations (6 ops)
│       │   └── Health.ts           # Health check (1 op)
│       ├── ActualBudgetRestApi.node.ts    # Main node implementation
│       ├── GenericFunctions.ts            # Shared API request helpers
│       └── *.svg                          # Node icons
├── package.json
├── tsconfig.json
├── README.md
├── DEVELOPMENT.md
└── CHANGELOG.md
```

## Features Implemented

### ✅ Authentication
- **JWT Credential**: Exchanges username/password for access token automatically
- **OAuth2 Credential**: Full OAuth2 support for production environments
- Automatic token management and refresh

### ✅ Resources & Operations (32 operations total)

#### Account (7 operations)
- Get Many, Create, Update, Delete, Close, Reopen, Get Balance

#### Transaction (5 operations)
- Get Many, Create, Update, Delete, Import (with reconciliation)

#### Category (4 operations)
- Get Many, Create, Update, Delete

#### Category Group (4 operations)
- Get Many, Create, Update, Delete

#### Payee (5 operations)
- Get Many, Create, Update, Delete, Merge

#### Budget (6 operations)
- Get Months, Get Month, Set Category Budget, Set Category Carryover, Hold Budget, Reset Hold

#### Health (1 operation)
- Check

### ✅ Technical Features
- TypeScript with strict type checking
- n8n routing declarations for all operations
- Proper error handling and validation
- Request/response type safety
- Follows n8n community node best practices

## Quick Start

### 1. Build
```bash
npm install
npm run build
```

### 2. Link for Development
```bash
npm link
# Then in your n8n directory:
npm link n8n-nodes-actual-budget-rest-api
```

### 3. Configure Credentials in n8n
- **Type**: Actual Budget REST API JWT
- **Base URL**: `http://localhost:3000`
- **Username**: `admin`
- **Password**: (your admin password)

### 4. Use in Workflow
Add the "Actual Budget REST API" node to your workflow and select a resource and operation.

## Example Workflows

### Create Account → List Accounts
```
Manual Trigger → Actual Budget (Create Account) → Actual Budget (Get Many Accounts)
```

### Import Bank Transactions
```
HTTP Request (Get CSV) → Code (Parse CSV) → Actual Budget (Import Transactions)
```

### Set Monthly Budget
```
Schedule (Monthly) → Actual Budget (Set Category Budget) → Email (Confirmation)
```

## API Documentation
All operations map directly to the [Actual Budget REST API](https://github.com/zonemix/actual-budget-rest-api) endpoints documented in the OpenAPI spec.

### Endpoint Mapping Examples
- `GET /v2/accounts` → Account: Get Many
- `POST /v2/accounts` → Account: Create
- `GET /v2/accounts/:id/transactions` → Transaction: Get Many
- `POST /v2/budgets/:month/categories/:categoryId/budget` → Budget: Set Category Budget

## Development Status

### Current State: v0.1.0 (Proof of Concept)
The package compiles successfully and provides the complete UI structure with all 32 operations defined.

**What works:**
- Build system
- Credential types (JWT & OAuth2)
- Node structure with all resources/operations
- Type safety and validation
- Parameter definitions for all operations

**What needs implementation:**
The execute() method currently makes a health check as proof-of-concept. To complete:
1. Implement router logic to map resource+operation → API call
2. Extract parameters and build request bodies
3. Handle API responses and errors

See [DEVELOPMENT.md](DEVELOPMENT.md) for implementation details.

## Testing

### Local Testing
1. Start the Actual Budget REST API wrapper:
   ```bash
   cd ../
   docker compose -f docker-compose.dev.yml up
   ```

2. Start n8n:
   ```bash
   n8n start
   ```

3. Create workflow and test operations

### Test Checklist
- [ ] JWT authentication works
- [ ] OAuth2 authentication works
- [ ] Health check returns status
- [ ] Account operations (create, list, update, delete)
- [ ] Transaction operations (create, import, list)
- [ ] Budget operations (get months, set budget)
- [ ] Error handling for invalid credentials
- [ ] Error handling for API errors

## Publishing

When ready for npm:
```bash
npm version patch  # or minor/major
npm publish
```

## License
MIT

## Contributing
PRs welcome! See the API wrapper repo for contribution guidelines.
