import type { INodeProperties } from 'n8n-workflow';

export const categoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['category'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many categories',
				description: 'Retrieve many categories',
				routing: {
					request: {
						method: 'GET',
						url: '/categories',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a category',
				description: 'Create a new category',
				routing: {
					request: {
						method: 'POST',
						url: '/categories',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a category',
				description: 'Update a category by ID',
				routing: {
					request: {
						method: 'PUT',
						url: '=/categories/{{$parameter.categoryId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a category',
				description: 'Delete a category by ID',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/categories/{{$parameter.categoryId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const categoryFields: INodeProperties[] = [
	// Category ID
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['update', 'delete'],
			},
		},
	},
	// Create fields
	{
		displayName: 'Category Name',
		name: 'categoryName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['create'],
			},
		},
		description: 'The name of the category',
		routing: {
			send: {
				type: 'body',
				property: 'category.name',
			},
		},
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['create'],
			},
		},
		description: 'The category group ID',
		routing: {
			send: {
				type: 'body',
				property: 'category.group_id',
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
				resource: ['category'],
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
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'fields.group_id',
					},
				},
			},
		],
	},
];
