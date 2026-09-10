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
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an account',
				description: 'Create a new account',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an account',
				description: 'Delete an account by ID',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				action: 'Get account balance',
				description: 'Get balance for an account',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many accounts',
				description: 'Retrieve many accounts',
			},
			{
				name: 'Reopen',
				value: 'reopen',
				action: 'Reopen an account',
				description: 'Reopen a closed account',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an account',
				description: 'Update an account by ID',
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
	},
	{
		displayName: 'Account Group ID',
		name: 'accountGroupId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'Optional account group to place the account in',
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
				displayName: 'Account Group ID',
				name: 'account_group_id',
				type: 'string',
				default: '',
				description: 'Account group to move the account into',
			},
			{
				displayName: 'Closed',
				name: 'closed',
				type: 'boolean',
				default: false,
				description: 'Whether the account is closed',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the account',
			},
			{
				displayName: 'Off Budget',
				name: 'offbudget',
				type: 'boolean',
				default: false,
				description: 'Whether the account is off budget',
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
		description: 'Optional account ID to transfer the remaining balance to',
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
		description:
			'Optional date in YYYY-MM-DD format, or a full ISO timestamp, to calculate the balance as of that point',
	},
];
