import type { INodeProperties } from 'n8n-workflow';

export const preferenceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['preference'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get budget preferences',
				description: 'Retrieve the preferences of the loaded budget file',
			},
		],
		default: 'get',
	},
];

export const preferenceFields: INodeProperties[] = [];
