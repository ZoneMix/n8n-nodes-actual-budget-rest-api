import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { hiddenQuery, transferCategoryQuery } from './category';
import { request, updateBody } from './helpers';

const RESOURCE = 'category group';

const createBody = (get: ParamGetter): IDataObject => ({
	group: {
		name: get<string>('groupName'),
		is_income: get<boolean>('isIncome', false),
		...get<IDataObject>('additionalFields', {}),
	},
});

export const buildCategoryGroupRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/category-groups', { qs: hiddenQuery(get) });
		case 'create':
			return request('POST', '/v2/category-groups', { body: createBody(get) });
		case 'update':
			return request('PUT', `/v2/category-groups/${get<string>('groupId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/category-groups/${get<string>('groupId')}`, {
				qs: transferCategoryQuery(get),
			});
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
