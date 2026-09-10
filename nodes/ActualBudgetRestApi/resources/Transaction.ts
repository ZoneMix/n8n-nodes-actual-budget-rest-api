import type { INodeProperties } from 'n8n-workflow';
import {
	transactionCreateOptions,
	transactionEntryField,
	transactionImportOptions,
} from './TransactionEntry';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create transactions',
				description: 'Add new transactions to an account',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a transaction',
				description: 'Delete a transaction by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get account transactions',
				description: 'Get transactions for an account',
			},
			{
				name: 'Import',
				value: 'import',
				action: 'Import transactions',
				description: 'Import transactions with reconciliation',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a transaction',
				description: 'Update a transaction by ID',
			},
		],
		default: 'getAll',
	},
];

export const transactionFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getAll', 'create', 'import'],
			},
		},
	},
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'end',
				type: 'string',
				default: '',
				placeholder: '2025-12-31',
				description: 'End date in YYYY-MM-DD format',
			},
			{
				displayName: 'Start Date',
				name: 'start',
				type: 'string',
				default: '',
				placeholder: '2025-01-01',
				description: 'Start date in YYYY-MM-DD format',
			},
		],
	},
	transactionEntryField,
	transactionCreateOptions,
	transactionImportOptions,
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Amount in cents',
			},
			{
				displayName: 'Category ID',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Category to assign the transaction to',
			},
			{
				displayName: 'Cleared',
				name: 'cleared',
				type: 'boolean',
				default: false,
				description: 'Whether the transaction is cleared',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				placeholder: '2025-12-17',
				description: 'Date in YYYY-MM-DD format',
			},
			{
				displayName: 'Imported Payee',
				name: 'imported_payee',
				type: 'string',
				default: '',
				description: 'Raw payee text as it arrived from the bank',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Free-text notes for the transaction',
			},
			{
				displayName: 'Payee Name or ID',
				name: 'payee',
				type: 'string',
				default: '',
				description: 'Existing payee ID, or a payee name the API resolves',
			},
			{
				displayName: 'Reconciled',
				name: 'reconciled',
				type: 'boolean',
				default: false,
				description: 'Whether the transaction is locked as reconciled',
			},
			{
				displayName: 'Transfer ID',
				name: 'transfer_id',
				type: 'string',
				default: '',
				description: 'Transaction this one transfers to or from',
			},
		],
	},
];
