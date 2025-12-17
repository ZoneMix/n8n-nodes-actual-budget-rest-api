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

For local development:

```bash
cd n8n-nodes-actual-budget-rest-api
npm install
npm run build
npm link
```

Then in your n8n installation directory:

```bash
npm link n8n-nodes-actual-budget-rest-api
```

## Operations

This node supports the following resources and operations:

### Account
- **Get Many** - Retrieve all accounts
- **Create** - Create a new account
- **Update** - Update an account by ID
- **Delete** - Delete an account by ID
- **Close** - Close an account (with optional transfer)
- **Reopen** - Reopen a closed account
- **Get Balance** - Get account balance (optionally as of a specific date)

### Transaction
- **Get Many** - Get transactions for an account (with optional date filters)
- **Create** - Add new transactions to an account
- **Update** - Update a transaction by ID
- **Delete** - Delete a transaction by ID
- **Import** - Import transactions with reconciliation using `imported_id`

### Category
- **Get Many** - Retrieve all categories
- **Create** - Create a new category
- **Update** - Update a category by ID
- **Delete** - Delete a category by ID

### Category Group
- **Get Many** - Retrieve all category groups
- **Create** - Create a new category group
- **Update** - Update a category group by ID
- **Delete** - Delete a category group by ID

### Payee
- **Get Many** - Retrieve all payees
- **Create** - Create a new payee
- **Update** - Update a payee by ID
- **Delete** - Delete a payee by ID
- **Merge** - Merge multiple payees into one

### Budget
- **Get Months** - Get list of available budget months
- **Get Month** - Get budget data for a specific month (YYYY-MM)
- **Set Category Budget** - Set budgeted amount for a category in a month
- **Set Category Carryover** - Enable/disable carryover for a category
- **Hold Budget** - Hold amount from next month
- **Reset Hold** - Reset held amount

### Health
- **Check** - Check API health status

## Credentials

This node supports **JWT authentication** via username and password.

### Prerequisites
1. Set up the [Actual Budget REST API wrapper](https://github.com/zonemix/actual-budget-rest-api)
2. Ensure the API is running and accessible
3. Obtain your admin username and password (configured via `ADMIN_USER` and `ADMIN_PASSWORD` environment variables)

### Setting up credentials
1. In n8n, create new credentials of type **Actual Budget REST API JWT**
2. Enter your:
   - **Base URL**: Your API endpoint
     - Development: `http://localhost:3000`
     - Production: `https://actual-api.yourdomain.com`
   - **Username**: Admin username (from API's `ADMIN_USER` env var)
   - **Password**: Admin password (from API's `ADMIN_PASSWORD` env var)
3. Test the credentials using the built-in test function

The credential will automatically exchange your username/password for a JWT access token when making requests.

### OAuth2 Support (Optional)
For production deployments, OAuth2 is also supported via the `actualBudgetRestApiOAuth2Api` credential. Configure the OAuth2 client in your API wrapper first (see [API documentation](https://github.com/zonemix/actual-budget-rest-api#connecting-n8n)).

## Compatibility

- Minimum n8n version: **1.0.0**
- Tested with n8n: **1.70+**
- Compatible with Actual Budget REST API wrapper: **v1.0.0+**

## Configuration

### Development Setup
Use `http://localhost:3000` as the Base URL when running the API wrapper locally.

### Production Setup
For production deployments:
1. Deploy the Actual Budget REST API wrapper to your server
2. Configure a domain/subdomain (e.g., `https://actual-api.yourdomain.com`)
3. Set up HTTPS (required for production)
4. In n8n credentials, set **Base URL** to your production URL
5. Ensure your production URL is included in the API's `ALLOWED_ORIGINS` environment variable

## Usage

### Example: Create an Account
1. Add an **Actual Budget REST API** node
2. Select **Account** resource
3. Select **Create** operation
4. Fill in:
   - Account Name: `"Checking"`
   - Off Budget: `false`
   - Initial Balance: `50000` (= $500.00)
5. Execute

### Example: Import Transactions
1. Use a **Code** node or **HTTP Request** to fetch bank transactions
2. Add **Actual Budget REST API** node
3. Select **Transaction** resource
4. Select **Import** operation
5. Provide Account ID and map transactions with `imported_id` for deduplication
6. Execute

### Working with Amounts
All monetary amounts in Actual Budget are stored as **integers in cents**:
- $100.00 = `10000`
- -$45.99 = `-4599`
- $1,234.56 = `123456`

### Date Formats
Dates must be in **YYYY-MM-DD** format (e.g., `2025-12-17`).  
Budget months use **YYYY-MM** format (e.g., `2025-12`).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Actual Budget](https://actualbudget.org/)
- [Actual Budget REST API wrapper](https://github.com/zonemix/actual-budget-rest-api)
- [Actual Budget REST API OpenAPI Documentation](https://github.com/zonemix/actual-budget-rest-api/blob/main/src/docs/openapi.yml)
