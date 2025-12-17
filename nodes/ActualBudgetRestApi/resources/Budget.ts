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
				name: 'Get Month',
				value: 'getMonth',
				action: 'Get budget for month',
				description: 'Get budget data for a specific month',
				routing: {
					request: {
						method: 'GET',
						url: '=/budgets/{{$parameter.month}}',
					},
				},
			},
			{
				name: 'Get Months',
				value: 'getMonths',
				action: 'Get budget months',
				description: 'Get list of available budget months',
				routing: {
					request: {
						method: 'GET',
						url: '/budgets/months',
					},
				},
			},
			{
				name: 'Hold Budget',
				value: 'hold',
				action: 'Hold budget from next month',
				description: 'Hold an amount from the next month',
				routing: {
					request: {
						method: 'POST',
						url: '=/budgets/{{$parameter.month}}/hold',
					},
				},
			},
			{
				name: 'Reset Hold',
				value: 'resetHold',
				action: 'Reset budget hold',
				description: 'Reset held amount for a month',
				routing: {
					request: {
						method: 'POST',
						url: '=/budgets/{{$parameter.month}}/reset-hold',
					},
				},
			},
			{
				name: 'Set Category Budget',
				value: 'setCategoryBudget',
				action: 'Set category budget amount',
				description: 'Set budgeted amount for a category',
				routing: {
					request: {
						method: 'POST',
						url: '=/budgets/{{$parameter.month}}/categories/{{$parameter.categoryId}}/budget',
					},
				},
			},
			{
				name: 'Set Category Carryover',
				value: 'setCategoryCarryover',
				action: 'Set category carryover',
				description: 'Set carryover flag for a category',
				routing: {
					request: {
						method: 'POST',
						url: '=/budgets/{{$parameter.month}}/categories/{{$parameter.categoryId}}/carryover',
					},
				},
			},
		],
		default: 'getMonths',
	},
];

export const budgetFields: INodeProperties[] = [
	// Month (for getMonth, setCategoryBudget, setCategoryCarryover, hold, resetHold)
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
	// Category ID
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
	// Set category budget amount
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
		routing: {
			send: {
				type: 'body',
				property: 'amount',
			},
		},
	},
	// Set category carryover
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
		description: 'Whether to carry over remaining balance to next month',
		routing: {
			send: {
				type: 'body',
				property: 'flag',
			},
		},
	},
];
