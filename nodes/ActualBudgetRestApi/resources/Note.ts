import type { INodeProperties } from 'n8n-workflow';

export const noteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['note'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a note',
				description: 'Get the note attached to an entity',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a note',
				description: 'Replace the note attached to an entity',
			},
		],
		default: 'get',
	},
];

export const noteFields: INodeProperties[] = [
	{
		displayName: 'Entity ID',
		name: 'noteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['note'],
			},
		},
		description: 'ID of the account, category, payee or schedule the note belongs to',
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['note'],
				operation: ['update'],
			},
		},
		description: 'Note text, up to 5000 characters. An empty value clears the note.',
	},
];
