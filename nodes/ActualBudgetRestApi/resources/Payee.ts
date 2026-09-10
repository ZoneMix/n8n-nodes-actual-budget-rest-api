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
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a payee',
				description: 'Delete a payee by ID',
			},
			{
				name: 'Get Common',
				value: 'getCommon',
				action: 'Get common payees',
				description: 'Retrieve the payees used most often',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many payees',
				description: 'Retrieve many payees',
			},
			{
				name: 'Merge',
				value: 'merge',
				action: 'Merge payees',
				description: 'Merge multiple payees into one',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a payee',
				description: 'Update a payee by ID',
			},
		],
		default: 'getAll',
	},
];

export const payeeFields: INodeProperties[] = [
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
	},
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
				description: 'New name for the payee',
			},
		],
	},
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
		description: 'Comma-separated list of payee IDs to merge (these are deleted)',
	},
];
