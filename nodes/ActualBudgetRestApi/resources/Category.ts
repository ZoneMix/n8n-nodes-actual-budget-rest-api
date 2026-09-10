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
				name: 'Create',
				value: 'create',
				action: 'Create a category',
				description: 'Create a new category',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a category',
				description: 'Delete a category by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many categories',
				description: 'Retrieve many categories',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a category',
				description: 'Update a category by ID',
			},
		],
		default: 'getAll',
	},
];

export const categoryFields: INodeProperties[] = [
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether to return hidden categories instead of visible ones',
			},
		],
	},
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
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['create'],
			},
		},
		description: 'The category group this category belongs to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether the category is hidden',
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
				resource: ['category'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				description: 'Category group to move the category into',
			},
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether the category is hidden',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the category',
			},
		],
	},
	{
		displayName: 'Transfer Category ID',
		name: 'transferCategoryId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['delete'],
			},
		},
		description: 'Optional category to move the deleted category’s transactions to',
	},
];
