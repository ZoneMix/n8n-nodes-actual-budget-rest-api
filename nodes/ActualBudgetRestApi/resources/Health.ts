import type { INodeProperties } from 'n8n-workflow';

export const healthOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['health'],
			},
		},
		options: [
			{
				name: 'Check',
				value: 'check',
				action: 'Health check',
				description: 'Check API health status',
				routing: {
					request: {
						method: 'GET',
						url: '/health',
					},
				},
			},
		],
		default: 'check',
	},
];

export const healthFields: INodeProperties[] = [];
