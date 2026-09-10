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
		description: 'Fields to select. Ignored when Calculate is set, which the API cannot combine with a selection.',
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
		description: 'Comma-separated list of field names',
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
			'One filter object, or an array of up to 50 sibling filters. Example: {"date": {"$gte": "2024-01-01"}}. Nesting via $and/$or is capped at 5 levels.',
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
				displayName: 'Calculate (JSON)',
				name: 'calculate',
				type: 'json',
				default: '{"$sum":"amount"}',
				description:
					'Aggregate expression such as {"$sum":"amount"}. Replaces the field selection and returns a single value.',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'string',
				default: '',
				placeholder: 'category,account',
				description: 'Comma-separated list of fields to group by',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Rows to skip. The API applies its own maximum as the limit when none is given.',
				typeOptions: {
					minValue: 0,
				},
			},
			{
				displayName: 'Order By (JSON)',
				name: 'orderBy',
				type: 'json',
				default: '[{"date":"desc"}]',
				description:
					'JSON array of field names and direction objects, e.g. [{"date":"desc"}]. A single quoted field name such as "date" also works.',
			},
			{
				displayName: 'Splits',
				name: 'splits',
				type: 'options',
				default: 'inline',
				description: 'How split transactions are returned',
				options: [
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'Grouped',
						value: 'grouped',
					},
					{
						name: 'Inline',
						value: 'inline',
					},
				],
			},
		],
	},
];
