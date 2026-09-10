import type { INodeProperties } from 'n8n-workflow';

export const bankSyncOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bankSync'],
			},
		},
		options: [
			{
				name: 'Run',
				value: 'run',
				action: 'Run a bank sync',
				description: 'Pull new transactions from the bank linked to an account',
			},
		],
		default: 'run',
	},
];

export const bankSyncFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['bankSync'],
			},
		},
		description: 'Account whose bank connection is synced',
	},
];
