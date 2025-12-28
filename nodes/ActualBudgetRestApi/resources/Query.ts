import type { INodeProperties } from 'n8n-workflow';

export const queryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
		options: [
			{
				name: 'Execute',
				value: 'execute',
				action: 'Execute actual ql query',
				description: 'Execute an ActualQL query against Actual Budget data',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/query',
					},
				},
			},
		],
		default: 'execute',
	},
];

export const queryFields: INodeProperties[] = [
	{
		displayName: 'Table',
		name: 'table',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['execute'],
			},
		},
		options: [
			{
				name: 'Accounts',
				value: 'accounts',
			},
			{
				name: 'Budget Months',
				value: 'budget_months',
			},
			{
				name: 'Budgets',
				value: 'budgets',
			},
			{
				name: 'Categories',
				value: 'categories',
			},
			{
				name: 'Category Groups',
				value: 'category_groups',
			},
			{
				name: 'Payees',
				value: 'payees',
			},
			{
				name: 'Rules',
				value: 'rules',
			},
			{
				name: 'Schedules',
				value: 'schedules',
			},
			{
				name: 'Transactions',
				value: 'transactions',
			},
		],
		default: 'transactions',
		description: 'Table to query (whitelist enforced for security)',
	},
	{
		displayName: 'Select Fields',
		name: 'select',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['execute'],
			},
		},
		options: [
			{
				name: '[All]',
				value: '*',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
		],
		default: '*',
		description: 'Fields to select',
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['execute'],
				select: ['custom'],
			},
		},
		default: '',
		placeholder: 'ID,amount,date',
		description: 'Comma-separated list of field names (max 50 fields)',
	},
	{
		displayName: 'Filter (JSON)',
		name: 'filter',
		type: 'json',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['execute'],
			},
		},
		default: '{}',
		description:
			'Filter conditions as JSON object. Example: {"date": {"$gte": "2024-01-01"}}. Max depth: 5 levels.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['execute'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
			},
		],
	},
];

