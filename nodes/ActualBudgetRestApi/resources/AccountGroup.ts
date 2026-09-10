import type { INodeProperties } from 'n8n-workflow';

export const accountGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accountGroup'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an account group',
				description: 'Create a new account group',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an account group',
				description: 'Delete an account group by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many account groups',
				description: 'Retrieve many account groups',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an account group',
				description: 'Update an account group by ID',
			},
		],
		default: 'getAll',
	},
];

export const accountGroupFields: INodeProperties[] = [
	{
		displayName: 'Account Group ID',
		name: 'accountGroupId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountGroup'],
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountGroup'],
				operation: ['create'],
			},
		},
		description: 'The name of the account group',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['accountGroup'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the account group',
			},
		],
	},
];
