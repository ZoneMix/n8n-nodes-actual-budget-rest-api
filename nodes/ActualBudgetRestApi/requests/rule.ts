import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { parseJsonArray, request, updateBody } from './helpers';

const RESOURCE = 'rule';

/** Conditions and actions are entered as JSON arrays in the node UI. */
const parseArrayField = (fields: IDataObject, key: string, label: string): IDataObject => {
	const raw = fields[key];
	return typeof raw === 'string' ? { [key]: parseJsonArray(raw, label) } : {};
};

const parseRuleFields = (fields: IDataObject): IDataObject => ({
	...fields,
	...parseArrayField(fields, 'conditions', 'Conditions'),
	...parseArrayField(fields, 'actions', 'Actions'),
});

const createBody = (get: ParamGetter): IDataObject => ({
	rule: {
		stage: get<string>('stage', 'default'),
		...get<IDataObject>('additionalFields', {}),
		conditions: parseJsonArray(get<string>('conditions'), 'Conditions'),
		actions: parseJsonArray(get<string>('actions'), 'Actions'),
	},
});

export const buildRuleRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/rules');
		case 'getForPayee':
			return request('GET', `/v2/rules/payees/${get<string>('payeeId')}`);
		case 'create':
			return request('POST', '/v2/rules', { body: createBody(get) });
		case 'update':
			return request('PUT', `/v2/rules/${get<string>('ruleId')}`, {
				body: updateBody(parseRuleFields(get<IDataObject>('updateFields', {}))),
			});
		case 'delete':
			return request('DELETE', `/v2/rules/${get<string>('ruleId')}`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
