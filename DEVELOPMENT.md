# n8n Node Development Guide

## Build the node

```bash
cd n8n-nodes-actual-budget-rest-api
npm install
npm run build
```

## Link for local development

After building, link the package so n8n can use it:

```bash
npm link
```

Then in your n8n installation directory (or globally if n8n is installed globally):

```bash
npm link n8n-nodes-actual-budget-rest-api
```

## Testing with n8n

1. Start your Actual Budget REST API (see main README)
2. Start n8n in development mode:
   ```bash
   n8n start
   ```
3. In n8n UI:
   - Create a new workflow
   - Add a new node and search for "Actual Budget"
   - Configure credentials:
     - Base URL: `http://localhost:3000`
     - Username: `admin`
     - Password: (your admin password)
   - Test the node with a simple health check

## Current Status

### ✅ Implemented
- JWT credential type with username/password authentication
- OAuth2 credential type (optional)
- Node scaffolding with all resources defined:
  - Account
  - Transaction
  - Category
  - Category Group
  - Payee
  - Budget
  - Health
- Build configuration
- TypeScript compilation
- Package metadata

### 🚧 TODO (Future Enhancements)
The current implementation provides a **proof of concept** with JWT authentication working. The execute() function currently makes a health check request as a demonstration.

To complete full functionality, the execute() method needs to be expanded to:

1. **Router implementation**: Map resource + operation parameters to actual API endpoints
2. **Request building**: Construct proper HTTP requests based on user-provided parameters
3. **Response handling**: Parse and return API responses appropriately
4. **Error handling**: Provide meaningful error messages

### Example: Implementing Account Operations

```typescript
// In execute() method
const resource = this.getNodeParameter('resource', i) as string;
const operation = this.getNodeParameter('operation', i) as string;

if (resource === 'account') {
  if (operation === 'getAll') {
    responseData = await this.helpers.request({
      method: 'GET',
      url: `${baseUrl}/accounts`,
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true,
    });
  } else if (operation === 'create') {
    const accountName = this.getNodeParameter('accountName', i) as string;
    const offbudget = this.getNodeParameter('offbudget', i) as boolean;
    // ... build request body
    responseData = await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}/accounts`,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { account: { name: accountName, offbudget } },
      json: true,
    });
  }
}
```

## Unlink (cleanup)

```bash
npm unlink n8n-nodes-actual-budget-rest-api
cd n8n-nodes-actual-budget-rest-api
npm unlink
```

## Publishing

When ready to publish to npm:

```bash
npm run lint
npm run build
npm publish
```

Make sure to update version in package.json before publishing.
