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
				name: 'Create',
				value: 'create',
				action: 'Create a category group',
				description: 'Create a new category group',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a category group',
				description: 'Delete a category group by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many category groups',
				description: 'Retrieve many category groups',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a category group',
				description: 'Update a category group by ID',
			},
		],
		default: 'getAll',
	},
];

export const categoryGroupFields: INodeProperties[] = [
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
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether to return hidden category groups instead of visible ones',
			},
		],
	},
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
		description: 'Whether this group holds income categories',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['categoryGroup'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether the category group is hidden',
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
				resource: ['categoryGroup'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Hidden',
				name: 'hidden',
				type: 'boolean',
				default: false,
				description: 'Whether the category group is hidden',
			},
			{
				displayName: 'Is Income',
				name: 'is_income',
				type: 'boolean',
				default: false,
				description: 'Whether this group holds income categories',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the category group',
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
				resource: ['categoryGroup'],
				operation: ['delete'],
			},
		},
		description: 'Optional category to move the deleted group’s categories to',
	},
];
