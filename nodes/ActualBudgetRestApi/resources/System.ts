import type { INodeProperties } from 'n8n-workflow';

export const systemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['system'],
			},
		},
		options: [
			{
				name: 'Export Budget',
				value: 'exportBudget',
				action: 'Export the budget file',
				description: 'Download the loaded budget as a ZIP file',
			},
			{
				name: 'Get Budget Files',
				value: 'budgetFiles',
				action: 'Get budget files',
				description: 'List the budget files the server knows about',
			},
			{
				name: 'Get Server Version',
				value: 'serverVersion',
				action: 'Get the server version',
				description: 'Read the version of the Actual sync server',
			},
			{
				name: 'Load Budget',
				value: 'loadBudget',
				action: 'Load a budget file',
				description: 'Load a budget file into the API',
			},
			{
				name: 'Lookup ID by Name',
				value: 'lookupId',
				action: 'Look up an ID by name',
				description: 'Resolve the ID of an account, category, payee or schedule',
			},
			{
				name: 'Sync Now',
				value: 'syncNow',
				action: 'Sync now',
				description: 'Push and pull changes against the Actual sync server',
			},
		],
		default: 'serverVersion',
	},
];

export const systemFields: INodeProperties[] = [
	{
		displayName: 'Lookup Type',
		name: 'lookupType',
		type: 'options',
		default: 'payees',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['lookupId'],
			},
		},
		options: [
			{
				name: 'Accounts',
				value: 'accounts',
			},
			{
				name: 'Categories',
				value: 'categories',
			},
			{
				name: 'Payees',
				value: 'payees',
			},
			{
				name: 'Schedules',
				value: 'schedules',
			},
		],
		description: 'Which kind of entity to look up',
	},
	{
		displayName: 'Name',
		name: 'lookupName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['lookupId'],
			},
		},
		description: 'Exact name of the entity to resolve',
	},
	{
		displayName: 'Sync ID',
		name: 'syncId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['loadBudget'],
			},
		},
		description: 'Budget file to load. Leave empty to load the file the API is configured for.',
	},
];
