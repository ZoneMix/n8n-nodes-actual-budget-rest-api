import type { INodeProperties } from 'n8n-workflow';

/**
 * The transaction list shared by Create and Import. Fields beyond the everyday
 * ones live in a nested collection so they are only sent when the user adds
 * them — a fixed collection otherwise submits every declared field.
 */
export const transactionEntryField: INodeProperties = {
	displayName: 'Transactions',
	name: 'transactions',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	default: {},
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['create', 'import'],
		},
	},
	options: [
		{
			name: 'transaction',
			displayName: 'Transaction',
			values: [
				{
					displayName: 'Additional Fields',
					name: 'additionalFields',
					type: 'collection',
					placeholder: 'Add Field',
					default: {},
					options: [
						{
							displayName: 'Imported Payee',
							name: 'imported_payee',
							type: 'string',
							default: '',
							description: 'Raw payee text as it arrived from the bank',
						},
						{
							displayName: 'Payee Name',
							name: 'payee_name',
							type: 'string',
							default: '',
							description: 'Payee name to create or match instead of an ID',
						},
						{
							displayName: 'Reconciled',
							name: 'reconciled',
							type: 'boolean',
							default: false,
							description: 'Whether the transaction is locked as reconciled',
						},
						{
							displayName: 'Starting Balance Flag',
							name: 'starting_balance_flag',
							type: 'boolean',
							default: false,
							description: 'Whether this transaction is the starting balance of the account',
						},
						{
							displayName: 'Subtransactions (JSON)',
							name: 'subtransactions',
							type: 'json',
							default: '[]',
							description:
								'JSON array of splits. Each entry needs an amount in cents and may set a category, notes or a payee. The split amounts must add up to the transaction amount.',
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
				{
					displayName: 'Amount',
					name: 'amount',
					type: 'number',
					default: 0,
					description: 'Amount in cents, negative for spending (-4599 is -$45.99)',
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
					description: 'Transaction date in YYYY-MM-DD format',
				},
				{
					displayName: 'Imported ID',
					name: 'imported_id',
					type: 'string',
					default: '',
					description: 'Unique bank ID used to deduplicate on import',
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
			],
		},
	],
};

/** Create-only flags, passed through to Actual's addTransactions. */
export const transactionCreateOptions: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['create'],
		},
	},
	options: [
		{
			displayName: 'Learn Categories',
			name: 'learnCategories',
			type: 'boolean',
			default: true,
			description: 'Whether to learn payee-category associations',
		},
		{
			displayName: 'Run Transfers',
			name: 'runTransfers',
			type: 'boolean',
			default: true,
			description: 'Whether to automatically create transfer transactions',
		},
	],
};

/** Import-only options, sent to the API as the `opts` object. */
export const transactionImportOptions: INodeProperties = {
	displayName: 'Import Options',
	name: 'importOptions',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['import'],
		},
	},
	options: [
		{
			displayName: 'Default Cleared',
			name: 'defaultCleared',
			type: 'boolean',
			default: true,
			description: 'Whether imported transactions start out cleared',
		},
		{
			displayName: 'Dry Run',
			name: 'dryRun',
			type: 'boolean',
			default: false,
			description: 'Whether to report what would be imported without writing anything',
		},
		{
			displayName: 'Payee Name Normalization',
			name: 'payeeNameNormalization',
			type: 'options',
			default: 'title-case',
			description: 'How incoming payee names are rewritten',
			options: [
				{
					name: 'Original',
					value: 'original',
				},
				{
					name: 'Title Case',
					value: 'title-case',
				},
			],
		},
		{
			displayName: 'Reimport Deleted',
			name: 'reimportDeleted',
			type: 'boolean',
			default: false,
			description: 'Whether to bring back transactions that were previously deleted',
		},
	],
};
