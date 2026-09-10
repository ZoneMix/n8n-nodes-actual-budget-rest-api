import type { INodeProperties } from 'n8n-workflow';

export const metricsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['metrics'],
			},
		},
		options: [
			{
				name: 'Get Full',
				value: 'getFull',
				action: 'Get full metrics',
				description: 'Get comprehensive metrics snapshot (all metrics)',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				action: 'Get summary metrics',
				description: 'Get lightweight summary metrics only',
			},
			{
				name: 'Reset',
				value: 'reset',
				action: 'Reset metrics',
				description: 'Reset all metrics counters to zero',
			},
		],
		default: 'getSummary',
	},
];

export const metricsFields: INodeProperties[] = [];
