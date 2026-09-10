import type { IDataObject } from 'n8n-workflow';
import type { BuiltRequest, ParamGetter } from './types';
import { unsupportedOperation } from './types';
import { request, splitList, updateBody } from './helpers';

const RESOURCE = 'payee';

export const buildPayeeRequest = (operation: string, get: ParamGetter): BuiltRequest => {
	switch (operation) {
		case 'getAll':
			return request('GET', '/v2/payees');
		case 'getCommon':
			return request('GET', '/v2/payees/common');
		case 'create':
			return request('POST', '/v2/payees', {
				body: { payee: { name: get<string>('payeeName') } },
			});
		case 'update':
			return request('PUT', `/v2/payees/${get<string>('payeeId')}`, {
				body: updateBody(get<IDataObject>('updateFields', {})),
			});
		case 'delete':
			return request('DELETE', `/v2/payees/${get<string>('payeeId')}`);
		case 'merge':
			return request('POST', '/v2/payees/merge', {
				body: {
					targetId: get<string>('targetId'),
					mergeIds: splitList(get<string>('mergeIds')),
				},
			});
		default:
			throw unsupportedOperation(RESOURCE, operation);
	}
};
