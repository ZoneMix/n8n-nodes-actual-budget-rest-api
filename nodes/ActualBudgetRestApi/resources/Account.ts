import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Close',
				value: 'close',
				action: 'Close an account',
				description: 'Close an account by ID',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/accounts/{{$parameter.accountId}}/close',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an account',
				description: 'Create a new account',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/accounts',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an account',
				description: 'Delete an account by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v2/accounts/{{$parameter.accountId}}',
					},
				},
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				action: 'Get account balance',
				description: 'Get balance for an account',
				routing: {
					request: {
						method: 'GET',
						url: '=/v2/accounts/{{$parameter.accountId}}/balance',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many accounts',
				description: 'Retrieve many accounts',
				routing: {
					request: {
						method: 'GET',
						url: '/v2/accounts',
					},
				},
			},
			{
				name: 'Reopen',
				value: 'reopen',
				action: 'Reopen an account',
				description: 'Reopen a closed account',
				routing: {
					request: {
						method: 'POST',
						url: '=/v2/accounts/{{$parameter.accountId}}/reopen',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an account',
				description: 'Update an account by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v2/accounts/{{$parameter.accountId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const accountFields: INodeProperties[] = [
	// Account ID (used by update, delete, close, reopen, getBalance)
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['update', 'delete', 'close', 'reopen', 'getBalance'],
			},
		},
	},
	// Create fields
	{
		displayName: 'Account Name',
		name: 'accountName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'The name of the account',
		routing: {
			send: {
				type: 'body',
				property: 'account.name',
			},
		},
	},
	{
		displayName: 'Off Budget',
		name: 'offbudget',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'Whether the account is off budget',
		routing: {
			send: {
				type: 'body',
				property: 'account.offbudget',
			},
		},
	},
	{
		displayName: 'Closed',
		name: 'closed',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'Whether the account is closed',
		routing: {
			send: {
				type: 'body',
				property: 'account.closed',
			},
		},
	},
	{
		displayName: 'Initial Balance',
		name: 'initialBalance',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'Initial balance in cents (e.g., 5000 = $50.00)',
		routing: {
			send: {
				type: 'body',
				property: 'initialBalance',
			},
		},
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
				resource: ['account'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'fields.name',
					},
				},
			},
			{
				displayName: 'Off Budget',
				name: 'offbudget',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'fields.offbudget',
					},
				},
			},
			{
				displayName: 'Closed',
				name: 'closed',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'fields.closed',
					},
				},
			},
		],
	},
	// Close account fields
	{
		displayName: 'Transfer Account ID',
		name: 'transferAccountId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['close'],
			},
		},
		description: 'Optional account ID to transfer remaining balance to',
		routing: {
			send: {
				type: 'body',
				property: 'transferAccountId',
			},
		},
	},
	{
		displayName: 'Transfer Category ID',
		name: 'transferCategoryId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['close'],
			},
		},
		description: 'Optional category ID for the transfer transaction',
		routing: {
			send: {
				type: 'body',
				property: 'categoryId',
			},
		},
	},
	// Get balance fields
	{
		displayName: 'Cutoff Date',
		name: 'cutoff',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getBalance'],
			},
		},
		description: 'Optional date in YYYY-MM-DD format to calculate balance as of that date',
		routing: {
			send: {
				type: 'query',
				property: 'cutoff',
			},
		},
	},
];
