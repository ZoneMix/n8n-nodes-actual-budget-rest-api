import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request, updateBody } from './helpers';

const RESOURCE = 'tag';

export const buildTagRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/tags');
		case 'create':
			return request('POST', '/v2/tags', {
				body: {
					tag: {
						tag: get<string>('tagName'),
						...get<IDataObject>('additionalFields', {}),
					},
				},
			});
		case 'update':
			return request('PUT', `/v2/tags/${get<string>('tagId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/tags/${get<string>('tagId')}`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
