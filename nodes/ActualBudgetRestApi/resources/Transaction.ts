import type { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create transactions',
				description: 'Add new transactions to an account',
				routing: {
					request: {
						method: 'POST',
						url: '=/accounts/{{$parameter.accountId}}/transactions',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a transaction',
				description: 'Delete a transaction by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/transactions/{{$parameter.transactionId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get account transactions',
				description: 'Get transactions for an account',
				routing: {
					request: {
						method: 'GET',
						url: '=/accounts/{{$parameter.accountId}}/transactions',
					},
				},
			},
			{
				name: 'Import',
				value: 'import',
				action: 'Import transactions',
				description: 'Import transactions with reconciliation',
				routing: {
					request: {
						method: 'POST',
						url: '=/accounts/{{$parameter.accountId}}/transactions/import',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a transaction',
				description: 'Update a transaction by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/transactions/{{$parameter.transactionId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const transactionFields: INodeProperties[] = [
	// Account ID (for getAll, create, import)
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getAll', 'create', 'import'],
			},
		},
	},
	// Transaction ID (for update, delete)
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['update', 'delete'],
			},
		},
	},
	// GetAll filters
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'start',
				type: 'string',
				default: '',
				placeholder: '2025-01-01',
				description: 'Start date in YYYY-MM-DD format',
				routing: {
					send: {
						type: 'query',
						property: 'start',
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'end',
				type: 'string',
				default: '',
				placeholder: '2025-12-31',
				description: 'End date in YYYY-MM-DD format',
				routing: {
					send: {
						type: 'query',
						property: 'end',
					},
				},
			},
		],
	},
	// Create transaction(s)
	{
		displayName: 'Transactions',
		name: 'transactions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['create', 'import'],
			},
		},
		options: [
			{
				name: 'transaction',
				displayName: 'Transaction',
				values: [
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'Amount in cents (e.g.,	-4599	=	-$45.99)',
					},
					{
						displayName: 'Category ID',
						name: 'category',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Cleared',
						name: 'cleared',
						type: 'boolean',
						default: false,
						description: 'Whether the transaction is cleared',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						placeholder: '2025-12-17',
						description: 'Transaction date in YYYY-MM-DD format',
					},
					{
						displayName: 'Imported ID',
						name: 'imported_id',
						type: 'string',
						default: '',
						description: 'Optional unique import ID for reconciliation (import operation)',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Optional transaction notes',
					},
					{
						displayName: 'Payee Name or ID',
						name: 'payee',
						type: 'string',
						default: '',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'transactions',
				value: '={{ $parameter.transactions.transaction }}',
			},
		},
	},
	// Create options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Run Transfers',
				name: 'runTransfers',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically create transfer transactions',
				routing: {
					send: {
						type: 'body',
						property: 'runTransfers',
					},
				},
			},
			{
				displayName: 'Learn Categories',
				name: 'learnCategories',
				type: 'boolean',
				default: true,
				description: 'Whether to learn payee-category associations',
				routing: {
					send: {
						type: 'body',
						property: 'learnCategories',
					},
				},
			},
		],
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Amount in cents',
				routing: {
					send: {
						type: 'body',
						property: 'fields.amount',
					},
				},
			},
			{
				displayName: 'Category ID',
				name: 'category',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'fields.category',
					},
				},
			},
			{
				displayName: 'Cleared',
				name: 'cleared',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'fields.cleared',
					},
				},
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				placeholder: '2025-12-17',
				description: 'Date in YYYY-MM-DD format',
				routing: {
					send: {
						type: 'body',
						property: 'fields.date',
					},
				},
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'fields.notes',
					},
				},
			},
			{
				displayName: 'Payee',
				name: 'payee',
				type: 'string',
				default: '',
				description: 'Payee name or ID',
				routing: {
					send: {
						type: 'body',
						property: 'fields.payee',
					},
				},
			},
		],
	},
];
