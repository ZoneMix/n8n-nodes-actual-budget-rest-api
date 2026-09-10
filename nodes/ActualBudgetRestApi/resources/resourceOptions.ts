import type { INodePropertyOptions } from 'n8n-workflow';

/** Every resource the node exposes, in the order the UI lists them. */
export const RESOURCE_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Account', value: 'account' },
	{ name: 'Account Group', value: 'accountGroup' },
	{ name: 'Bank Sync', value: 'bankSync' },
	{ name: 'Budget', value: 'budget' },
	{ name: 'Category', value: 'category' },
	{ name: 'Category Group', value: 'categoryGroup' },
	{ name: 'Health', value: 'health' },
	{ name: 'Metric', value: 'metrics' },
	{ name: 'Note', value: 'note' },
	{ name: 'Payee', value: 'payee' },
	{ name: 'Preference', value: 'preference' },
	{ name: 'Query', value: 'query' },
	{ name: 'Rule', value: 'rule' },
	{ name: 'Schedule', value: 'schedule' },
	{ name: 'System', value: 'system' },
	{ name: 'Tag', value: 'tag' },
	{ name: 'Transaction', value: 'transaction' },
];
