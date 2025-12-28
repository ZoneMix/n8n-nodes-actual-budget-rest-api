import type { INodeProperties } from 'n8n-workflow';

export const categoryGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many category groups',
				description: 'Retrieve many category groups',
				routing: {
					request: {
						method: 'GET',
						url: '/v2/category-groups',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a category group',
				description: 'Create a new category group',
				routing: {
					request: {
						method: 'POST',
						url: '/v2/category-groups',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a category group',
				description: 'Update a category group by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v2/category-groups/{{$parameter.groupId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a category group',
				description: 'Delete a category group by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v2/category-groups/{{$parameter.groupId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const categoryGroupFields: INodeProperties[] = [
	// Group ID
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The category group ID',
	},
	// Create fields
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
				operation: ['create'],
			},
		},
		description: 'The name of the category group',
		routing: {
			send: {
				type: 'body',
				property: 'group.name',
			},
		},
	},
	{
		displayName: 'Is Income',
		name: 'isIncome',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
				operation: ['create'],
			},
		},
		description: 'Whether this is an income group',
		routing: {
			send: {
				type: 'body',
				property: 'group.is_income',
			},
		},
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'fields.name',
					},
				},
			},
			{
				displayName: 'Is Income',
				name: 'is_income',
				type: 'boolean',
				default: false,
				routing: {
					send: {
						type: 'body',
						property: 'fields.is_income',
					},
				},
			},
		],
	},
];
