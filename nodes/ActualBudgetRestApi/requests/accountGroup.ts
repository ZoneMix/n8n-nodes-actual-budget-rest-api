import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request, updateBody } from './helpers';

const RESOURCE = 'account group';

export const buildAccountGroupRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/account-groups');
		case 'create':
			return request('POST', '/v2/account-groups', {
				body: { group: { name: get<string>('groupName') } },
			});
		case 'update':
			return request('PUT', `/v2/account-groups/${get<string>('accountGroupId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/account-groups/${get<string>('accountGroupId')}`);
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
