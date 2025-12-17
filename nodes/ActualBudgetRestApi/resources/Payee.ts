import type { INodeProperties } from 'n8n-workflow';

export const payeeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['payee'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a payee',
				description: 'Create a new payee',
				routing: {
					request: {
						method: 'POST',
						url: '/payees',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a payee',
				description: 'Delete a payee by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/payees/{{$parameter.payeeId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many payees',
				description: 'Retrieve many payees',
				routing: {
					request: {
						method: 'GET',
						url: '/payees',
					},
				},
			},
			{
				name: 'Merge',
				value: 'merge',
				action: 'Merge payees',
				description: 'Merge multiple payees into one',
				routing: {
					request: {
						method: 'POST',
						url: '/payees/merge',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a payee',
				description: 'Update a payee by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/payees/{{$parameter.payeeId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const payeeFields: INodeProperties[] = [
	// Payee ID
	{
		displayName: 'Payee ID',
		name: 'payeeId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['payee'],
				operation: ['update', 'delete'],
			},
		},
	},
	// Create fields
	{
		displayName: 'Payee Name',
		name: 'payeeName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['payee'],
				operation: ['create'],
			},
		},
		description: 'The name of the payee',
		routing: {
			send: {
				type: 'body',
				property: 'payee.name',
			},
		},
	},
	{
		displayName: 'Transfer Account ID',
		name: 'transferAccountId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['payee'],
				operation: ['create'],
			},
		},
		description: 'Optional account ID if this is a transfer payee',
		routing: {
			send: {
				type: 'body',
				property: 'payee.transfer_acct',
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
				resource: ['payee'],
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
				displayName: 'Transfer Account ID',
				name: 'transfer_acct',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'fields.transfer_acct',
					},
				},
			},
		],
	},
	// Merge fields
	{
		displayName: 'Target Payee ID',
		name: 'targetId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['payee'],
				operation: ['merge'],
			},
		},
		description: 'The payee ID to merge into (keep this one)',
		routing: {
			send: {
				type: 'body',
				property: 'targetId',
			},
		},
	},
	{
		displayName: 'Payee IDs to Merge',
		name: 'mergeIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['payee'],
				operation: ['merge'],
			},
		},
		description: 'Comma-separated list of payee IDs to merge (will be deleted)',
		routing: {
			send: {
				type: 'body',
				property: 'mergeIds',
				value: '={{ $parameter.mergeIds.split(",").map(id => id.trim()) }}',
			},
		},
	},
];
