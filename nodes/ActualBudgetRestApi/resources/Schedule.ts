import type { INodeProperties } from 'n8n-workflow';

const AMOUNT_OP_OPTIONS = [
	{
		name: 'Approximately',
		value: 'isapprox',
	},
	{
		name: 'Between',
		value: 'isbetween',
	},
	{
		name: 'Exactly',
		value: 'is',
	},
];

export const scheduleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a schedule',
				description: 'Create a new schedule',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a schedule',
				description: 'Delete a schedule by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many schedules',
				description: 'Retrieve many schedules',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a schedule',
				description: 'Update a schedule by ID',
			},
		],
		default: 'getAll',
	},
];

export const scheduleFields: INodeProperties[] = [
	{
		displayName: 'Schedule ID',
		name: 'scheduleId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: '',
		required: true,
		placeholder: '2026-02-01',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		description: 'First occurrence in YYYY-MM-DD format',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'account',
				type: 'string',
				default: '',
				description: 'Account the scheduled transaction belongs to',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Amount in cents (e.g., -120000 = -$1,200.00)',
			},
			{
				displayName: 'Amount Operator',
				name: 'amountOp',
				type: 'options',
				default: 'is',
				options: AMOUNT_OP_OPTIONS,
				description: 'How the amount is matched against real transactions',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name shown for the schedule',
			},
			{
				displayName: 'Payee ID',
				name: 'payee',
				type: 'string',
				default: '',
				description: 'Payee the scheduled transaction is for',
			},
			{
				displayName: 'Posts Transaction',
				name: 'posts_transaction',
				type: 'boolean',
				default: false,
				description: 'Whether the schedule posts its transaction automatically',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'account',
				type: 'string',
				default: '',
				description: 'Account the scheduled transaction belongs to',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Amount in cents (e.g., -120000 = -$1,200.00)',
			},
			{
				displayName: 'Amount Operator',
				name: 'amountOp',
				type: 'options',
				default: 'is',
				options: AMOUNT_OP_OPTIONS,
				description: 'How the amount is matched against real transactions',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				placeholder: '2026-02-01',
				description: 'Next occurrence in YYYY-MM-DD format',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name shown for the schedule',
			},
			{
				displayName: 'Payee ID',
				name: 'payee',
				type: 'string',
				default: '',
				description: 'Payee the scheduled transaction is for',
			},
			{
				displayName: 'Posts Transaction',
				name: 'posts_transaction',
				type: 'boolean',
				default: false,
				description: 'Whether the schedule posts its transaction automatically',
			},
		],
	},
	{
		displayName: 'Reset Next Date',
		name: 'resetNextDate',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['update'],
			},
		},
		description:
			'Whether to recompute the next occurrence from the updated date. Left to the engine’s default when off.',
	},
];
