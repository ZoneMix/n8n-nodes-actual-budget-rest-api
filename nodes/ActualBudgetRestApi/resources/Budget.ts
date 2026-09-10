import type { INodeProperties } from 'n8n-workflow';

export const budgetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['budget'],
			},
		},
		options: [
			{
				name: 'Batch Update',
				value: 'batchUpdate',
				action: 'Batch update budgets',
				description: 'Apply many budget amounts and carryover flags in one call',
			},
			{
				name: 'Get Month',
				value: 'getMonth',
				action: 'Get budget for month',
				description: 'Get budget data for a specific month',
			},
			{
				name: 'Get Months',
				value: 'getMonths',
				action: 'Get budget months',
				description: 'Get list of available budget months',
			},
			{
				name: 'Hold Budget',
				value: 'hold',
				action: 'Hold budget from next month',
				description: 'Hold an amount from the next month',
			},
			{
				name: 'Reset Hold',
				value: 'resetHold',
				action: 'Reset budget hold',
				description: 'Reset held amount for a month',
			},
			{
				name: 'Set Category Budget',
				value: 'setCategoryBudget',
				action: 'Set category budget amount',
				description: 'Set budgeted amount for a category',
			},
			{
				name: 'Set Category Carryover',
				value: 'setCategoryCarryover',
				action: 'Set category carryover',
				description: 'Set carryover flag for a category',
			},
		],
		default: 'getMonths',
	},
];

export const budgetFields: INodeProperties[] = [
	{
		displayName: 'Month',
		name: 'month',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2025-12',
		displayOptions: {
			show: {
				resource: ['budget'],
				operation: ['getMonth', 'setCategoryBudget', 'setCategoryCarryover', 'hold', 'resetHold'],
			},
		},
		description: 'Month in YYYY-MM format',
	},
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['budget'],
				operation: ['setCategoryBudget', 'setCategoryCarryover'],
			},
		},
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ['budget'],
				operation: ['setCategoryBudget', 'hold'],
			},
		},
		description: 'Amount in cents (e.g., 50000 = $500.00)',
	},
	{
		displayName: 'Carryover Flag',
		name: 'flag',
		type: 'boolean',
		default: false,
		required: true,
		displayOptions: {
			show: {
				resource: ['budget'],
				operation: ['setCategoryCarryover'],
			},
		},
		description: 'Whether to carry over the remaining balance to next month',
	},
	{
		displayName: 'Operations (JSON)',
		name: 'operations',
		type: 'json',
		default: '[]',
		required: true,
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['budget'],
				operation: ['batchUpdate'],
			},
		},
		description:
			'JSON array of up to 500 operations. Each entry is either {"type":"setAmount","month":"2026-01","categoryId":"…","amount":1000} or {"type":"setCarryover","month":"2026-01","categoryId":"…","flag":true}.',
	},
];
