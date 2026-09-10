import type { INodeProperties } from 'n8n-workflow';

const STAGE_OPTIONS = [
	{
		name: 'Default',
		value: 'default',
	},
	{
		name: 'Post',
		value: 'post',
	},
	{
		name: 'Pre',
		value: 'pre',
	},
];

const CONDITIONS_OP_OPTIONS = [
	{
		name: 'And',
		value: 'and',
	},
	{
		name: 'Or',
		value: 'or',
	},
];

const CONDITIONS_DESCRIPTION =
	'JSON array of conditions, e.g. [{"field":"payee","op":"is","value":"payee-id"}]. Valid fields and operators come from Actual’s own rule engine.';

const ACTIONS_DESCRIPTION =
	'JSON array of actions, e.g. [{"op":"set","field":"category","value":"category-id"}]';

export const ruleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a rule',
				description: 'Create a new rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a rule',
				description: 'Delete a rule by ID',
			},
			{
				name: 'Get For Payee',
				value: 'getForPayee',
				action: 'Get rules for a payee',
				description: 'Retrieve the rules that reference one payee',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many rules',
				description: 'Retrieve many rules',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a rule',
				description: 'Update a rule by ID',
			},
		],
		default: 'getAll',
	},
];

export const ruleFields: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['update', 'delete'],
			},
		},
	},
	{
		displayName: 'Payee ID',
		name: 'payeeId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['getForPayee'],
			},
		},
	},
	{
		displayName: 'Stage',
		name: 'stage',
		type: 'options',
		default: 'default',
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create'],
			},
		},
		options: STAGE_OPTIONS,
		description: 'When the rule runs relative to the other rules',
	},
	{
		displayName: 'Conditions (JSON)',
		name: 'conditions',
		type: 'json',
		default: '[]',
		required: true,
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create'],
			},
		},
		description: CONDITIONS_DESCRIPTION,
	},
	{
		displayName: 'Actions (JSON)',
		name: 'actions',
		type: 'json',
		default: '[]',
		required: true,
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create'],
			},
		},
		description: ACTIONS_DESCRIPTION,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Conditions Operator',
				name: 'conditionsOp',
				type: 'options',
				default: 'and',
				options: CONDITIONS_OP_OPTIONS,
				description: 'Whether every condition must match, or any of them',
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
				resource: ['rule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Actions (JSON)',
				name: 'actions',
				type: 'json',
				default: '[]',
				description: ACTIONS_DESCRIPTION,
			},
			{
				displayName: 'Conditions (JSON)',
				name: 'conditions',
				type: 'json',
				default: '[]',
				description: CONDITIONS_DESCRIPTION,
			},
			{
				displayName: 'Conditions Operator',
				name: 'conditionsOp',
				type: 'options',
				default: 'and',
				options: CONDITIONS_OP_OPTIONS,
				description: 'Whether every condition must match, or any of them',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				default: 'default',
				options: STAGE_OPTIONS,
				description: 'When the rule runs relative to the other rules',
			},
		],
	},
];
