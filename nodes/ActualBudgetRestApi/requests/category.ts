import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { omitBlank, request, updateBody } from './helpers';

const RESOURCE = 'category';

/** `?hidden=true|false` — sent only when the user added it to the filter collection. */
export const hiddenQuery = (get: ParamGetter): IDataObject => {
	const filters = get<IDataObject>('filters', {});
	return filters.hidden === undefined ? {} : { hidden: filters.hidden };
};

/** `?transferCategoryId=` — where the deleted category's transactions are moved. */
export const transferCategoryQuery = (get: ParamGetter): IDataObject =>
	omitBlank({ transferCategoryId: get<string>('transferCategoryId', '') });

const createBody = (get: ParamGetter): IDataObject => ({
	category: {
		name: get<string>('categoryName'),
		group_id: get<string>('groupId'),
		...get<IDataObject>('additionalFields', {}),
	},
});

export const buildCategoryRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/categories', { qs: hiddenQuery(get) });
		case 'create':
			return request('POST', '/v2/categories', { body: createBody(get) });
		case 'update':
			return request('PUT', `/v2/categories/${get<string>('categoryId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/categories/${get<string>('categoryId')}`, {
				qs: transferCategoryQuery(get),
			});
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
